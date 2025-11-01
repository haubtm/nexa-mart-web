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

import {
  useCustomerList,
  useEmployeeList,
  useProductList,
  useRefundList,
} from '@/features/main';
import { useDebounce } from '@/lib';

const { RangePicker } = DatePicker;

/* ===== Types (khai báo theo response user đưa) ===== */
type Employee = {
  employeeId: number;
  name: string;
  email: string;
  employeeCode: string;
  role: 'ADMIN' | 'STAFF' | string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};

type Customer = {
  customerId: number;
  name: string;
  email?: string | null;
  phone?: string | null;
  customerCode?: string | null;
  gender?: string | null;
  address?: string | null;
  dateOfBirth?: string | null;
  customerType?: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};

type RefundRow = {
  returnId: number;
  returnCode: string;
  returnDate: string; // ISO
  invoiceNumber: string;
  customerName: string | null;
  customerPhone: string | null;
  employeeName: string;
  totalRefundAmount: number;
  reclaimedDiscountAmount: number;
  finalRefundAmount: number;
  reasonNote: string | null;
};

type RefundListResp = {
  content: RefundRow[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  numberOfElements: number;
};

/* ===== Helpers ===== */
const currency = (v: number) =>
  (v ?? 0).toLocaleString('vi-VN', { maximumFractionDigits: 0 });

const formatDateTime = (iso?: string) =>
  iso ? dayjs(iso).format('DD/MM/YYYY HH:mm') : '';

/* ===== Component ===== */
const RefundContainer: React.FC = () => {
  // Trạng thái text search cho 3 Select có showSearch
  const [searchInput, setSearchInput] = useState({
    employeeName: '',
    customerName: '',
    productName: '',
  });
  const debouncedSearchInput = useDebounce(searchInput, 300);

  // Gọi 3 API lookup theo text search
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
  const products = productResp?.data?.products ?? [];

  // Flattern product units -> chọn theo productUnitId
  const productUnitOptions = useMemo(() => {
    const opts: { label: string; value: number }[] = [];
    products.forEach((p) => {
      (p.units ?? []).forEach((u) => {
        const tail = u.barcode
          ? ` (${u.unitName} • ${u.barcode})`
          : ` (${u.unitName})`;
        opts.push({
          label: `${p.name}${tail}`,
          value: u.id!,
        });
      });
    });
    return opts;
  }, [products]);

  // Query params lọc danh sách refund
  const [queryParams, setQueryParams] = useState<{
    employeeId?: number;
    customerId?: number;
    productUnitId?: number;
    fromDate?: string; // YYYY-MM-DD
    toDate?: string; // YYYY-MM-DD
    searchKeyword: string;
    page: number;
    size: number;
    sortBy: 'returnDate' | 'finalRefundAmount';
    sortDirection: 'asc' | 'desc';
  }>({
    employeeId: undefined,
    customerId: undefined,
    productUnitId: undefined,
    fromDate: undefined,
    toDate: undefined,
    searchKeyword: '',
    page: 0,
    size: 10,
    sortBy: 'returnDate',
    sortDirection: 'desc',
  });

  // Debounce cho searchKeyword
  const debouncedKeyword = useDebounce(queryParams.searchKeyword, 300);

  // Gọi danh sách phiếu trả
  const { data: refundResp, isPending: isRefundLoading } = useRefundList({
    ...queryParams,
    searchKeyword: debouncedKeyword,
  });
  const refundList: RefundListResp | undefined = refundResp?.data;

  // Datasource & pagination
  const dataSource = (refundList?.content ?? []).map((r) => ({
    key: r.returnId,
    ...r,
  }));

  const pagination: TablePaginationConfig = {
    current: (refundList?.pageable?.pageNumber ?? 0) + 1,
    pageSize: refundList?.pageable?.pageSize ?? queryParams.size,
    total: refundList?.totalElements ?? 0,
    showSizeChanger: true,
    pageSizeOptions: [10, 20, 50, 100],
  };

  // Columns
  const columns = useMemo<ColumnsType<RefundRow>>(
    () => [
      {
        title: 'STT',
        dataIndex: 'index',
        key: 'index',
        width: 70,
        align: 'center',
        render: (_: any, __: RefundRow, idx: number) =>
          ((pagination.current ?? 1) - 1) * (pagination.pageSize ?? 10) +
          idx +
          1,
      },
      {
        title: 'Mã phiếu trả',
        dataIndex: 'returnCode',
        key: 'returnCode',
        width: 180,
        render: (v: string) => <Tag>{v}</Tag>,
      },
      {
        title: 'Ngày trả',
        dataIndex: 'returnDate',
        key: 'returnDate',
        sorter: true,
        width: 180,
        render: (v: string) => formatDateTime(v),
      },
      {
        title: 'Số hóa đơn',
        dataIndex: 'invoiceNumber',
        key: 'invoiceNumber',
        width: 180,
      },
      {
        title: 'Khách hàng',
        key: 'customer',
        width: 220,
        render: (_: any, r: RefundRow) =>
          r.customerName ? (
            <Space direction="vertical" size={0}>
              <span>{r.customerName}</span>
              {r.customerPhone ? <small>{r.customerPhone}</small> : null}
            </Space>
          ) : (
            <span>Khách vãng lai</span>
          ),
      },
      {
        title: 'Nhân viên',
        dataIndex: 'employeeName',
        key: 'employeeName',
        width: 200,
      },
      {
        title: 'Tiền hoàn',
        dataIndex: 'totalRefundAmount',
        key: 'totalRefundAmount',
        align: 'right',
        width: 140,
        render: (v: number) => currency(v),
      },
      {
        title: 'Thu hồi KM',
        dataIndex: 'reclaimedDiscountAmount',
        key: 'reclaimedDiscountAmount',
        align: 'right',
        width: 140,
        render: (v: number) => currency(v),
      },
      {
        title: 'Tiền trả khách',
        dataIndex: 'finalRefundAmount',
        key: 'finalRefundAmount',
        sorter: true,
        align: 'right',
        width: 160,
        render: (v: number) => <b>{currency(v)}</b>,
      },
      {
        title: 'Ghi chú',
        dataIndex: 'reasonNote',
        key: 'reasonNote',
        ellipsis: true,
      },
    ],
    [pagination.current, pagination.pageSize],
  );

  // Sự kiện bảng (phân trang + sort)
  const onTableChange: TableProps<RefundRow>['onChange'] = (
    pag,
    _filters,
    sorter,
  ) => {
    const next = { ...queryParams };
    next.page = (pag.current ?? 1) - 1;
    next.size = pag.pageSize ?? queryParams.size;

    // Sort
    const s = Array.isArray(sorter) ? sorter[0] : sorter;
    if (s?.field === 'finalRefundAmount') {
      next.sortBy = 'finalRefundAmount';
      next.sortDirection = s.order === 'ascend' ? 'asc' : 'desc';
    } else if (s?.field === 'returnDate') {
      next.sortBy = 'returnDate';
      next.sortDirection = s.order === 'ascend' ? 'asc' : 'desc';
    }
    setQueryParams(next);
  };

  // Handlers bộ lọc
  const handleRangeChange = (range: null | [Dayjs, Dayjs]) => {
    if (!range) {
      setQueryParams((s) => ({
        ...s,
        fromDate: undefined,
        toDate: undefined,
        page: 0,
      }));
      return;
    }
    setQueryParams((s) => ({
      ...s,
      fromDate: range[0].format('YYYY-MM-DD'),
      toDate: range[1].format('YYYY-MM-DD'),
      page: 0,
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
      page: 0,
      size: 10,
      sortBy: 'returnDate',
      sortDirection: 'desc',
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
                setQueryParams((s) => ({ ...s, employeeId: v, page: 0 }))
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
                setQueryParams((s) => ({ ...s, customerId: v, page: 0 }))
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
                setQueryParams((s) => ({ ...s, productUnitId: v, page: 0 }))
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
              placeholder={['Từ ngày', 'Đến ngày']}
              onChange={(vals) => handleRangeChange(vals as any)}
              value={
                queryParams.fromDate && queryParams.toDate
                  ? [dayjs(queryParams.fromDate), dayjs(queryParams.toDate)]
                  : null
              }
              allowEmpty={[true, true]}
            />
          </Col>

          <Col xs={24} md={12} lg={8}>
            <div style={{ marginBottom: 6 }}>Tìm kiếm</div>
            <Input.Search
              allowClear
              placeholder="Mã phiếu, số HĐ, ghi chú..."
              value={queryParams.searchKeyword}
              onChange={(e) =>
                setQueryParams((s) => ({
                  ...s,
                  searchKeyword: e.target.value,
                  page: 0,
                }))
              }
            />
          </Col>

          <Col xs={24} md={12} lg={8} />

          <Col xs={24} md={12} lg={8} style={{ textAlign: 'right' }}>
            <div style={{ height: 28 }} />
            <Space>
              <Button onClick={clearFilters}>Xoá bộ lọc</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Bảng danh sách */}
      <Card>
        <Table<RefundRow>
          rowKey="returnId"
          loading={isRefundLoading}
          columns={columns}
          dataSource={dataSource}
          pagination={pagination}
          onChange={onTableChange}
          scroll={{ x: 1100 }}
        />
      </Card>
    </Space>
  );
};

export default RefundContainer;
export { RefundContainer };
