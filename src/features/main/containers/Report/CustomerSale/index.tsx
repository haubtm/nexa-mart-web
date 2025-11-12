import React, { useEffect, useMemo, useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import {
  Card,
  Col,
  DatePicker,
  Form,
  Row,
  Select,
  Space,
  Table,
  Typography,
  Empty,
  Spin,
  Divider,
  Tag,
  Button,
} from 'antd';
import styled from 'styled-components';
import dayjs from 'dayjs';
import { useDebounce } from '@/lib';
import { useCustomerList, useReportCustomerSale } from '@/features/main';

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

// ===== Types from API =====
interface ICustomerItem {
  customerId: number;
  name: string;
  code?: string;
  address?: string;
  customerType?: string;
  email?: string | null;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface ICategorySaleRow {
  categoryName: string;
  revenueBeforeDiscount: number;
  discount: number;
  revenueAfterDiscount: number;
}

interface ICustomerSalesBlock {
  customerId: number;
  customerCode: string;
  customerName: string;
  address: string;
  customerType: string;
  categorySalesList: ICategorySaleRow[];
  totalDiscount: number;
  totalRevenueBeforeDiscount: number;
  totalRevenueAfterDiscount: number;
}

interface IReportResponseData {
  fromDate: string; // YYYY-MM-DD
  toDate: string; // YYYY-MM-DD
  customerSalesList: ICustomerSalesBlock[];
  grandTotalDiscount: number;
  grandTotalRevenueBeforeDiscount: number;
  grandTotalRevenueAfterDiscount: number;
}

// ===== UI row types =====
type RowKind = 'detail' | 'subtotal' | 'grandtotal' | 'sectionHeader';

interface ITableRow {
  key: string;
  kind: RowKind;
  stt?: number | string;
  customerCode?: string;
  customerName?: string;
  address?: string;
  customerType?: string;
  categoryName?: string;
  totalDiscount?: number;
  revenueBeforeDiscount?: number;
  revenueAfterDiscount?: number;
}

// ===== Helpers =====
const fmtMoney = (v?: number) =>
  typeof v === 'number' ? v.toLocaleString('vi-VN') : '';

const fmtDate = (d?: string) => (d ? dayjs(d).format('DD/MM/YYYY') : '');

// ===== Styled Wrapper (no Tailwind) =====
const StyledWrapper = styled.div`
  padding: 16px;

  .row-section td {
    background: #fafafa !important;
    font-weight: 600;
  }
  .row-subtotal td {
    background: #f5f5f5 !important;
    font-weight: 600;
  }
  .row-grandtotal td {
    background: #eeeeee !important;
    font-weight: 700;
  }
`;

// ===== Component =====
const ReportCustomerSaleContainer: React.FC = () => {
  // Search customers
  const [search, setSearch] = useState('');
  const searchDebounced = useDebounce(search);
  const { data: customerResp, isLoading: isCustomerLoading } = useCustomerList({
    search: searchDebounced,
  });

  const customerOptions = useMemo(() => {
    const list: ICustomerItem[] = customerResp?.data?.content ?? [];
    return list.map((c) => ({
      label: `${c.name}${c.code ? ` — ${c.code}` : ''}`,
      value: c.customerId,
    }));
  }, [customerResp]);

  // Query params
  const [form] = Form.useForm();
  const [queryParams, setQueryParams] = useState<{
    fromDate?: string;
    toDate?: string;
    customerId?: number;
  }>(() => ({
    fromDate: dayjs().format('YYYY-MM-DD'),
    toDate: dayjs().format('YYYY-MM-DD'),
  }));

  // Fetch report
  const { data: reportResp, isLoading: isReportLoading } = useReportCustomerSale(
    queryParams as any,
  );
  const reportData: IReportResponseData | undefined = reportResp?.data;

  // Sync form defaults
  useEffect(() => {
    form.setFieldsValue({
      dateRange: [dayjs(queryParams.fromDate), dayjs(queryParams.toDate)],
      customerId: queryParams.customerId,
      search,
    });
  }, []);

  // Build table rows
  const tableRows: ITableRow[] = useMemo(() => {
    if (!reportData) return [];

    const rows: ITableRow[] = [];

    (reportData.customerSalesList || []).forEach((block, idx) => {
      // Section header per customer
      rows.push({
        key: `hdr-${idx}`,
        kind: 'sectionHeader',
        stt: idx + 1,
        customerCode: block.customerCode,
        customerName: block.customerName,
        address: block.address,
        customerType: block.customerType,
      });

      (block.categorySalesList || []).forEach((c, i) => {
        rows.push({
          key: `d-${idx}-${i}`,
          kind: 'detail',
          stt: i + 1,
          categoryName: c.categoryName,
          totalDiscount: c.discount,
          revenueBeforeDiscount: c.revenueBeforeDiscount,
          revenueAfterDiscount: c.revenueAfterDiscount,
        });
      });

      // Subtotal row per customer
      rows.push({
        key: `sub-${idx}`,
        kind: 'subtotal',
        stt: 'Tổng cộng',
        totalDiscount: block.totalDiscount,
        revenueBeforeDiscount: block.totalRevenueBeforeDiscount,
        revenueAfterDiscount: block.totalRevenueAfterDiscount,
      });
    });

    // Grand total
    rows.push({
      key: 'grand',
      kind: 'grandtotal',
      stt: 'Tổng cộng',
      totalDiscount: reportData.grandTotalDiscount,
      revenueBeforeDiscount: reportData.grandTotalRevenueBeforeDiscount,
      revenueAfterDiscount: reportData.grandTotalRevenueAfterDiscount,
    });

    return rows;
  }, [reportData]);

  const columns: ColumnsType<ITableRow> = [
    {
      title: 'STT',
      dataIndex: 'stt',
      width: 60,
      render: (v, record) => {
        if (record.kind === 'sectionHeader')
          return <Text strong>{v as number}</Text>;
        return v as React.ReactNode;
      },
    },
    {
      title: 'Mã KH',
      dataIndex: 'customerCode',
      width: 100,
      render: (v, record) => {
        if (record.kind === 'sectionHeader') return <Text strong>{v}</Text>;
        return v as React.ReactNode;
      },
    },
    {
      title: 'Tên KH',
      dataIndex: 'customerName',
      width: 180,
      render: (v, record) => {
        if (record.kind === 'sectionHeader') return <Text strong>{v}</Text>;
        return v as React.ReactNode;
      },
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      width: 200,
      render: (v, record) => {
        if (record.kind === 'sectionHeader') return <Text strong>{v}</Text>;
        return v as React.ReactNode;
      },
    },
    {
      title: 'Nhóm KH',
      dataIndex: 'customerType',
      width: 120,
      render: (v, record) => {
        if (record.kind === 'sectionHeader') return <Text strong>{v}</Text>;
        return v as React.ReactNode;
      },
    },
    {
      title: 'Nhóm SP',
      dataIndex: 'categoryName',
      width: 140,
    },
    {
      title: 'Doanh số trước CK',
      dataIndex: 'revenueBeforeDiscount',
      align: 'right',
      width: 160,
      render: (v, r) =>
        typeof v === 'number'
          ? fmtMoney(v)
          : r.kind === 'sectionHeader'
            ? ''
            : '',
    },
    {
      title: 'Chiết khấu',
      dataIndex: 'totalDiscount',
      align: 'right',
      width: 140,
      render: (v, r) =>
        typeof v === 'number'
          ? fmtMoney(v)
          : r.kind === 'sectionHeader'
            ? ''
            : '',
    },
    {
      title: 'Doanh số sau CK',
      dataIndex: 'revenueAfterDiscount',
      align: 'right',
      width: 160,
      render: (v, r) =>
        typeof v === 'number'
          ? fmtMoney(v)
          : r.kind === 'sectionHeader'
            ? ''
            : '',
    },
  ];

  const rowClassName = (record: ITableRow) => {
    switch (record.kind) {
      case 'sectionHeader':
        return 'row-section';
      case 'subtotal':
        return 'row-subtotal';
      case 'grandtotal':
        return 'row-grandtotal';
      default:
        return '';
    }
  };

  const onFinish = (values: any) => {
    const [from, to] = values.dateRange || [];
    setQueryParams({
      fromDate: from ? dayjs(from).format('YYYY-MM-DD') : undefined,
      toDate: to ? dayjs(to).format('YYYY-MM-DD') : undefined,
      customerId: values.customerId,
    });
  };

  return (
    <StyledWrapper>
      <Card
        style={{ marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}
        bordered
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            dateRange: [dayjs(), dayjs()],
          }}
        >
          <Row gutter={[12, 12]} align="bottom">
            <Col xs={24} md={10}>
              <Form.Item
                label="Từ ngày - Đến ngày"
                name="dateRange"
                rules={[{ required: true, message: 'Chọn khoảng ngày' }]}
              >
                <RangePicker
                  style={{ width: '100%' }}
                  allowClear={false}
                  format="DD/MM/YYYY"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Khách hàng" name="customerId">
                <Select
                  showSearch
                  placeholder="Tất cả khách hàng"
                  options={customerOptions}
                  filterOption={false}
                  onSearch={setSearch}
                  notFoundContent={
                    isCustomerLoading ? (
                      <Spin size="small" />
                    ) : (
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="Không có dữ liệu"
                      />
                    )
                  }
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Space>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Lấy báo cáo
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Button
                    onClick={() => {
                      form.resetFields();
                      setSearch('');
                      setQueryParams({
                        fromDate: dayjs().format('YYYY-MM-DD'),
                        toDate: dayjs().format('YYYY-MM-DD'),
                        customerId: undefined,
                      });
                    }}
                  >
                    Làm mới
                  </Button>
                </Form.Item>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }} bordered>
        <Row
          align="middle"
          justify="space-between"
          style={{ marginBottom: 12 }}
        >
          <Col>
            <Title level={5} style={{ margin: 0 }}>
              DOANH SỐ BÁN HÀNG THEO KHÁCH HÀNG
            </Title>
            <Text type="secondary">
              Từ ngày:{' '}
              {reportData?.fromDate ? fmtDate(reportData.fromDate) : '—'} — Đến
              ngày: {reportData?.toDate ? fmtDate(reportData.toDate) : '—'}
            </Text>
          </Col>
          <Col>{isReportLoading && <Spin />}</Col>
        </Row>

        <Table<ITableRow>
          bordered
          size="middle"
          loading={isReportLoading}
          columns={columns}
          dataSource={tableRows}
          pagination={false}
          rowClassName={rowClassName}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Không có dữ liệu"
              />
            ),
          }}
          scroll={{ x: 1400 }}
        />

        {reportData && (
          <div style={{ marginTop: 24, fontSize: 12 }}>
            <Divider />
            <Row gutter={[16, 8]}>
              <Col xs={24} md={16}>
                <div>- Thông tin bán hàng theo khách hàng và nhóm sản phẩm.</div>
                <div>
                  - Chiết khấu: bao gồm khuyến mãi/chiết khấu của hóa đơn và sản
                  phẩm.
                </div>
                <div>
                  - Doanh số trước chiết khấu: tổng tiền chưa trừ chiết khấu.
                </div>
                <div>
                  - Doanh số sau chiết khấu: tổng tiền đã trừ chiết khấu.
                </div>
              </Col>
              <Col xs={24} md={8}>
                <Tag>
                  {' '}
                  Tổng chiết khấu: {fmtMoney(reportData.grandTotalDiscount)}
                </Tag>
              </Col>
            </Row>
          </div>
        )}
      </Card>
    </StyledWrapper>
  );
};

export { ReportCustomerSaleContainer };
