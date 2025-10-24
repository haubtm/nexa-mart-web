import React, { useMemo, useState } from 'react';
import {
  Card,
  Row,
  Col,
  Select,
  DatePicker,
  Input,
  Table,
  Space,
  Button,
  Tag,
} from 'antd';
import type {
  ColumnsType,
  TablePaginationConfig,
  TableProps,
} from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';

import { useOrderList } from '@/features/sale';
import {
  useCustomerList,
  useEmployeeList,
  useProductList,
} from '@/features/main';
import { useDebounce } from '@/lib';
import { EInvoiceStatus } from '@/lib';

const { RangePicker } = DatePicker;

/* ========= Types theo response ========= */
type Employee = {
  employeeId: number;
  name: string;
  email: string;
  employeeCode: string;
  role: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};

type Customer = {
  customerId: number;
  name: string;
  phone?: string | null;
};

type ProductUnit = {
  id: number;
  unitName: string;
  barcode?: string | null;
  code?: string | null;
};

type Product = {
  id: number;
  name: string;
  units: ProductUnit[];
};

type InvoiceItem = {
  invoiceDetailId: number;
  productUnitId: number;
  productName: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  lineTotal: number;
};

type Invoice = {
  invoiceId: number;
  invoiceNumber: string;
  invoiceDate: string;
  orderId: number;
  customerName: string | null;
  employeeName: string;
  paymentMethod: 'CASH' | 'BANK_TRANSFER' | string;
  status: EInvoiceStatus;
  subtotal: number;
  totalDiscount: number;
  totalTax: number;
  totalAmount: number;
  paidAmount: number;
  items: InvoiceItem[];
  createdAt: string;
};

type OrderListResp = {
  invoices: Invoice[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
};

/* ========= Helpers ========= */
const currency = (v: number) =>
  (v ?? 0).toLocaleString('vi-VN', { maximumFractionDigits: 0 });

const formatDateTime = (iso?: string) =>
  iso ? dayjs(iso).format('DD/MM/YYYY HH:mm') : '';

const statusTag = (s?: EInvoiceStatus) => {
  const map: Record<EInvoiceStatus, { color: string; text: string }> = {
    [EInvoiceStatus.CANCELLED]: { color: 'default', text: 'Đã hủy' },
    [EInvoiceStatus.DRAFT]: { color: 'processing', text: 'Nháp' },
    [EInvoiceStatus.ISSUED]: { color: 'warning', text: 'Đã xuất' },
    [EInvoiceStatus.PAID]: { color: 'success', text: 'Đã thanh toán' },
    [EInvoiceStatus.PARTIALLY_PAID]: {
      color: 'purple',
      text: 'Thanh toán một phần',
    },
    [EInvoiceStatus.REFUNDED]: { color: 'magenta', text: 'Đã hoàn' },
  };
  if (!s) return <Tag>-</Tag>;
  const v = map[s] ?? { color: 'default', text: s };
  return <Tag color={v.color}>{v.text}</Tag>;
};

/* ========= Component ========= */
const OrderContainer: React.FC = () => {
  // Trạng thái text search cho 3 Select
  const [searchInput, setSearchInput] = useState({
    employeeName: '',
    customerName: '',
    productName: '',
  });
  const debouncedSearchInput = useDebounce(searchInput, 300);

  // Lookups
  const { data: employeeResp, isPending: isEmployeeLoading } = useEmployeeList({
    search: debouncedSearchInput.employeeName,
  });
  const employees: Employee[] = employeeResp?.data ?? [];

  const { data: customerResp, isPending: isCustomerLoading } = useCustomerList({
    search: debouncedSearchInput.customerName,
  });
  const customers: Customer[] = customerResp?.data?.content ?? [];

  const { data: productResp, isPending: isProductLoading } = useProductList({
    searchTerm: debouncedSearchInput.productName,
  });
  const products: Product[] = productResp?.data?.products ?? [];

  // Flattern product units -> chọn theo productUnitId
  const productUnitOptions = useMemo(() => {
    const opts: { label: string; value: number }[] = [];
    products.forEach((p) => {
      (p.units ?? []).forEach((u) => {
        const tail = u.barcode
          ? ` (${u.unitName} • ${u.barcode})`
          : u.code
            ? ` (${u.unitName} • ${u.code})`
            : ` (${u.unitName})`;
        opts.push({
          label: `${p.name}${tail}`,
          value: u.id,
        });
      });
    });
    return opts;
  }, [products]);

  // Query params
  const [queryParams, setQueryParams] = useState<{
    employeeId?: number;
    customerId?: number;
    productUnitId?: number;
    fromDate?: string; // YYYY-MM-DD
    toDate?: string; // YYYY-MM-DD
    searchKeyword: string;
    status?: EInvoiceStatus;
    pageNumber: number;
    pageSize: number;
  }>({
    employeeId: undefined,
    customerId: undefined,
    productUnitId: undefined,
    fromDate: undefined,
    toDate: undefined,
    searchKeyword: '',
    pageNumber: 0,
    pageSize: 10,
    status: undefined,
  });

  // Debounce keyword
  const debouncedKeyword = useDebounce(queryParams.searchKeyword, 300);

  // Fetch danh sách hoá đơn
  const { data: listResp, isPending: isLoading } = useOrderList({
    ...queryParams,
    searchKeyword: debouncedKeyword,
  });
  const orderList: OrderListResp | undefined = listResp?.data;

  // Datasource & pagination
  const dataSource = (orderList?.invoices ?? []).map((r) => ({
    key: r.invoiceId,
    ...r,
  }));

  const pagination: TablePaginationConfig = {
    current: (orderList?.pageNumber ?? 0) + 1,
    pageSize: orderList?.pageSize ?? queryParams.pageSize,
    total: orderList?.totalCount ?? 0,
    showSizeChanger: true,
    pageSizeOptions: [10, 20, 50, 100],
  };

  // Columns
  const columns = useMemo<ColumnsType<Invoice>>(
    () => [
      {
        title: 'STT',
        key: 'idx',
        width: 70,
        align: 'center',
        render: (_: any, __: Invoice, idx: number) =>
          ((pagination.current ?? 1) - 1) * (pagination.pageSize ?? 10) +
          idx +
          1,
      },
      {
        title: 'Số hóa đơn',
        dataIndex: 'invoiceNumber',
        key: 'invoiceNumber',
        width: 200,
        render: (v: string) => <Tag>{v}</Tag>,
      },
      {
        title: 'Ngày hóa đơn',
        dataIndex: 'invoiceDate',
        key: 'invoiceDate',
        width: 180,
        render: (v: string) => formatDateTime(v),
      },
      {
        title: 'Khách hàng',
        key: 'customer',
        width: 220,
        render: (_: any, r: Invoice) =>
          r.customerName ? <span>{r.customerName}</span> : <span>-</span>,
      },
      {
        title: 'Nhân viên',
        dataIndex: 'employeeName',
        key: 'employeeName',
        width: 200,
      },
      {
        title: 'PT thanh toán',
        dataIndex: 'paymentMethod',
        key: 'paymentMethod',
        width: 140,
      },
      {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
        width: 160,
        render: (s: EInvoiceStatus) => statusTag(s),
      },
      {
        title: 'Tạm tính',
        dataIndex: 'subtotal',
        key: 'subtotal',
        align: 'right',
        width: 140,
        render: (v: number) => currency(v),
      },
      {
        title: 'Giảm giá',
        dataIndex: 'totalDiscount',
        key: 'totalDiscount',
        align: 'right',
        width: 140,
        render: (v: number) => currency(v),
      },
      {
        title: 'Thành tiền',
        dataIndex: 'totalAmount',
        key: 'totalAmount',
        align: 'right',
        width: 140,
        render: (v: number) => <b>{currency(v)}</b>,
      },
      {
        title: 'Đã trả',
        dataIndex: 'paidAmount',
        key: 'paidAmount',
        align: 'right',
        width: 140,
        render: (v: number) => currency(v),
      },
    ],
    [pagination.current, pagination.pageSize],
  );

  // onChange bảng (phân trang)
  const onTableChange: TableProps<Invoice>['onChange'] = (pag) => {
    setQueryParams((s) => ({
      ...s,
      pageNumber: (pag.current ?? 1) - 1,
      pageSize: pag.pageSize ?? s.pageSize,
    }));
  };

  // Handlers bộ lọc
  const handleRangeChange = (range: null | [Dayjs, Dayjs]) => {
    if (!range) {
      setQueryParams((s) => ({
        ...s,
        fromDate: undefined,
        toDate: undefined,
        pageNumber: 0,
      }));
      return;
    }
    setQueryParams((s) => ({
      ...s,
      fromDate: range[0].format('YYYY-MM-DD'),
      toDate: range[1].format('YYYY-MM-DD'),
      pageNumber: 0,
    }));
  };

  const clearFilters = () => {
    setSearchInput({ employeeName: '', customerName: '', productName: '' });
    setQueryParams({
      employeeId: undefined,
      customerId: undefined,
      productUnitId: undefined,
      fromDate: undefined,
      toDate: undefined,
      searchKeyword: '',
      status: undefined,
      pageNumber: 0,
      pageSize: 10,
    });
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      {/* Bộ lọc */}
      <Card>
        <Row gutter={[12, 12]}>
          <Col xs={24} md={12} lg={6}>
            <div style={{ marginBottom: 6 }}>Nhân viên</div>
            <Select
              allowClear
              showSearch
              placeholder="Tìm & chọn nhân viên"
              loading={isEmployeeLoading}
              style={{ width: '100%' }}
              onSearch={(q) =>
                setSearchInput((s) => ({ ...s, employeeName: q }))
              }
              onChange={(v) =>
                setQueryParams((s) => ({ ...s, employeeId: v, pageNumber: 0 }))
              }
              filterOption={false}
              options={(employees ?? []).map((e: Employee) => ({
                label: `${e.name} (${e.employeeCode})`,
                value: e.employeeId,
              }))}
              value={queryParams.employeeId}
            />
          </Col>

          <Col xs={24} md={12} lg={6}>
            <div style={{ marginBottom: 6 }}>Khách hàng</div>
            <Select
              allowClear
              showSearch
              placeholder="Tìm & chọn khách hàng"
              loading={isCustomerLoading}
              style={{ width: '100%' }}
              onSearch={(q) =>
                setSearchInput((s) => ({ ...s, customerName: q }))
              }
              onChange={(v) =>
                setQueryParams((s) => ({ ...s, customerId: v, pageNumber: 0 }))
              }
              filterOption={false}
              options={(customers ?? []).map((c: Customer) => ({
                label: `${c.name}${c.phone ? ` • ${c.phone}` : ''}`,
                value: c.customerId,
              }))}
              value={queryParams.customerId}
            />
          </Col>

          <Col xs={24} md={12} lg={6}>
            <div style={{ marginBottom: 6 }}>Sản phẩm</div>
            <Select
              allowClear
              showSearch
              placeholder="Tìm & chọn đơn vị SP"
              loading={isProductLoading}
              style={{ width: '100%' }}
              onSearch={(q) =>
                setSearchInput((s) => ({ ...s, productName: q }))
              }
              onChange={(v) =>
                setQueryParams((s) => ({
                  ...s,
                  productUnitId: v,
                  pageNumber: 0,
                }))
              }
              filterOption={false}
              options={productUnitOptions}
              value={queryParams.productUnitId}
            />
          </Col>

          <Col xs={24} md={12} lg={6}>
            <div style={{ marginBottom: 6 }}>Từ ngày – Đến ngày</div>
            <RangePicker
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
              onChange={(vals) => handleRangeChange(vals as any)}
              placeholder={['Từ ngày', 'Đến ngày']}
              value={
                queryParams.fromDate && queryParams.toDate
                  ? [dayjs(queryParams.fromDate), dayjs(queryParams.toDate)]
                  : null
              }
              allowEmpty={[true, true]}
            />
          </Col>

          <Col xs={24} md={12} lg={6}>
            <div style={{ marginBottom: 6 }}>Trạng thái</div>
            <Select
              allowClear
              placeholder="Chọn trạng thái"
              style={{ width: '100%' }}
              value={queryParams.status}
              onChange={(v) =>
                setQueryParams((s) => ({ ...s, status: v, pageNumber: 0 }))
              }
              options={Object.values(EInvoiceStatus).map((v) => ({
                label: statusTag(v as EInvoiceStatus),
                value: v,
              }))}
              optionRender={(opt) => <div>{opt.data.label}</div>}
            />
          </Col>

          <Col xs={24} md={12} lg={10}>
            <div style={{ marginBottom: 6 }}>Tìm kiếm</div>
            <Input.Search
              allowClear
              placeholder="Số HĐ, mã đơn hàng, ghi chú..."
              value={queryParams.searchKeyword}
              onChange={(e) =>
                setQueryParams((s) => ({
                  ...s,
                  searchKeyword: e.target.value,
                  pageNumber: 0,
                }))
              }
            />
          </Col>

          <Col xs={24} md={12} lg={8} style={{ textAlign: 'right' }}>
            <div style={{ height: 28 }} />
            <Space>
              <Button onClick={clearFilters}>Xoá bộ lọc</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Bảng */}
      <Card>
        <Table<Invoice>
          rowKey="invoiceId"
          loading={isLoading}
          columns={columns}
          dataSource={dataSource}
          pagination={pagination}
          onChange={onTableChange}
          expandable={{
            expandedRowRender: (r) => (
              <Table<InvoiceItem>
                rowKey="invoiceDetailId"
                size="small"
                pagination={false}
                columns={[
                  {
                    title: 'Sản phẩm',
                    dataIndex: 'productName',
                    key: 'productName',
                  },
                  { title: 'ĐVT', dataIndex: 'unit', key: 'unit', width: 80 },
                  {
                    title: 'SL',
                    dataIndex: 'quantity',
                    key: 'quantity',
                    align: 'right',
                    width: 80,
                  },
                  {
                    title: 'Đơn giá',
                    dataIndex: 'unitPrice',
                    key: 'unitPrice',
                    align: 'right',
                    width: 120,
                    render: (v) => currency(v),
                  },
                  {
                    title: 'Giảm',
                    dataIndex: 'discountAmount',
                    key: 'discountAmount',
                    align: 'right',
                    width: 120,
                    render: (v) => currency(v),
                  },
                  {
                    title: 'Thành tiền',
                    dataIndex: 'lineTotal',
                    key: 'lineTotal',
                    align: 'right',
                    width: 140,
                    render: (v) => <b>{currency(v)}</b>,
                  },
                ]}
                dataSource={r.items}
              />
            ),
          }}
          scroll={{ x: 1200 }}
        />
      </Card>
    </Space>
  );
};

export { OrderContainer };
