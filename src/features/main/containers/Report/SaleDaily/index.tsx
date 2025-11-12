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
import { useEmployeeList, useReportSaleDaily } from '@/features/main';

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

// ===== Types from API =====
interface IEmployeeItem {
  employeeId: number;
  name: string;
  email?: string | null;
  employeeCode?: string | null;
  role?: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface IDailySaleRow {
  employeeCode: string;
  employeeName: string;
  saleDate: string; // YYYY-MM-DD
  totalDiscount: number;
  revenueBeforeDiscount: number;
  revenueAfterDiscount: number;
}

interface IEmployeeSalesBlock {
  stt: number;
  employeeCode: string;
  employeeName: string;
  dailySales: IDailySaleRow[];
  totalDiscount: number;
  totalRevenueBeforeDiscount: number;
  totalRevenueAfterDiscount: number;
}

interface IReportResponseData {
  fromDate: string; // YYYY-MM-DD
  toDate: string; // YYYY-MM-DD
  employeeSalesList: IEmployeeSalesBlock[];
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
  employeeCode?: string;
  employeeName?: string;
  saleDate?: string; // formatted for UI
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
const ReportSaleDailyContainer: React.FC = () => {
  // Search employees
  const [search, setSearch] = useState('');
  const searchDebounced = useDebounce(search);
  const { data: empResp, isLoading: isEmpLoading } = useEmployeeList({
    keyword: searchDebounced,
  });

  const employeeOptions = useMemo(() => {
    const list: IEmployeeItem[] = empResp?.data?.employees ?? [];
    return list.map((e) => ({
      label: `${e.name}${e.employeeCode ? ` — ${e.employeeCode}` : ''}`,
      value: e.employeeId,
    }));
  }, [empResp]);

  // Query params
  const [form] = Form.useForm();
  const [queryParams, setQueryParams] = useState<{
    fromDate?: string;
    toDate?: string;
    employeeId?: number;
  }>(() => ({
    fromDate: dayjs().format('YYYY-MM-DD'),
    toDate: dayjs().format('YYYY-MM-DD'),
  }));

  // Fetch report
  const { data: reportResp, isLoading: isReportLoading } = useReportSaleDaily(
    queryParams as any,
  );
  const reportData: IReportResponseData | undefined = reportResp?.data;

  // Sync form defaults
  useEffect(() => {
    form.setFieldsValue({
      dateRange: [dayjs(queryParams.fromDate), dayjs(queryParams.toDate)],
      employeeId: queryParams.employeeId,
      search,
    });
  }, []);

  // Build table rows
  const tableRows: ITableRow[] = useMemo(() => {
    if (!reportData) return [];

    const rows: ITableRow[] = [];

    (reportData.employeeSalesList || []).forEach((block, idx) => {
      // Optional header per employee (visual separation)
      rows.push({
        key: `hdr-${idx}`,
        kind: 'sectionHeader',
        stt: idx + 1,
        employeeCode: block.employeeCode,
        employeeName: block.employeeName,
      });

      (block.dailySales || []).forEach((d, i) => {
        rows.push({
          key: `d-${idx}-${i}`,
          kind: 'detail',
          stt: i + 1,
          employeeCode: d.employeeCode,
          employeeName: d.employeeName,
          saleDate: fmtDate(d.saleDate),
          totalDiscount: d.totalDiscount,
          revenueBeforeDiscount: d.revenueBeforeDiscount,
          revenueAfterDiscount: d.revenueAfterDiscount,
        });
      });

      // Subtotal row per employee
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
      width: 80,
      render: (v, record) => {
        if (record.kind === 'sectionHeader')
          return <Text strong>{v as number}</Text>;
        return v as React.ReactNode;
      },
    },
    {
      title: 'NVBH',
      dataIndex: 'employeeCode',
      width: 120,
      render: (v, record) => {
        if (record.kind === 'sectionHeader') return <Text strong>{v}</Text>;
        return v as React.ReactNode;
      },
    },
    {
      title: 'Tên NVBH',
      dataIndex: 'employeeName',
      width: 220,
      render: (v, record) => {
        if (record.kind === 'sectionHeader') return <Text strong>{v}</Text>;
        return v as React.ReactNode;
      },
    },
    {
      title: 'Ngày',
      dataIndex: 'saleDate',
      width: 140,
    },
    {
      title: 'Chiết khấu',
      dataIndex: 'totalDiscount',
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
      title: 'Doanh số trước CK',
      dataIndex: 'revenueBeforeDiscount',
      align: 'right',
      width: 180,
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
      width: 180,
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
      employeeId: values.employeeId,
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
              <Form.Item label="Nhân viên bán hàng" name="employeeId">
                <Select
                  showSearch
                  placeholder="Tất cả nhân viên"
                  options={employeeOptions}
                  filterOption={false}
                  onSearch={setSearch}
                  notFoundContent={
                    isEmpLoading ? (
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
                        employeeId: undefined,
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
              DOANH SỐ BÁN HÀNG THEO NGÀY
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
          scroll={{ x: 900 }}
        />

        {reportData && (
          <div style={{ marginTop: 24, fontSize: 12 }}>
            <Divider />
            <Row gutter={[16, 8]}>
              <Col xs={24} md={16}>
                <div>- Thông tin nhân viên bán hàng theo ngày.</div>
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

export { ReportSaleDailyContainer };
