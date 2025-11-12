import React, { useMemo, useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import {
  Card,
  Col,
  DatePicker,
  Form,
  Row,
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
import { useReportReturn } from '@/features/main';

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

interface IProductRefundRow {
  categoryName: string;
  productCode: string;
  productName: string;
  unitName: string;
  quantity: number;
  priceAtReturn: number;
  refundAmount: number;
}

interface IReturnBlock {
  originalInvoiceNumber: string;
  originalInvoiceDate: string;
  returnCode: string;
  returnDate: string;
  products: IProductRefundRow[];
  totalQuantity: number;
  totalRefundAmount: number;
}

interface IReportResponseData {
  fromDate: string;
  toDate: string;
  returnItems: IReturnBlock[];
  totalQuantity: number;
  totalRefundAmount: number;
}

type RowKind = 'detail' | 'subtotal' | 'grandtotal' | 'sectionHeader';

interface ITableRow {
  key: string;
  kind: RowKind;
  stt?: number | string;
  originalInvoiceNumber?: string;
  originalInvoiceDate?: string;
  returnCode?: string;
  returnDate?: string;
  categoryName?: string;
  productCode?: string;
  productName?: string;
  unitName?: string;
  quantity?: number;
  priceAtReturn?: number;
  refundAmount?: number;
}

const fmtMoney = (v?: number) =>
  typeof v === 'number' ? v.toLocaleString('vi-VN') : '';

const fmtDate = (d?: string) => (d ? dayjs(d).format('DD/MM/YYYY') : '');

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

const ReportReturnContainer: React.FC = () => {
  const [form] = Form.useForm();
  const [queryParams, setQueryParams] = useState<{
    fromDate?: string;
    toDate?: string;
  }>(() => ({
    fromDate: dayjs().format('YYYY-MM-DD'),
    toDate: dayjs().format('YYYY-MM-DD'),
  }));

  const { data: reportResp, isLoading: isReportLoading } = useReportReturn(
    queryParams as any,
  );
  const reportData: IReportResponseData | undefined = reportResp?.data;

  const tableRows: ITableRow[] = useMemo(() => {
    if (!reportData) return [];
    const rows: ITableRow[] = [];
    (reportData.returnItems || []).forEach((block, idx) => {
      rows.push({
        key: `hdr-${idx}`,
        kind: 'sectionHeader',
        stt: idx + 1,
        originalInvoiceNumber: block.originalInvoiceNumber,
        originalInvoiceDate: fmtDate(block.originalInvoiceDate),
        returnCode: block.returnCode,
        returnDate: fmtDate(block.returnDate),
      });
      (block.products || []).forEach((p, i) => {
        rows.push({
          key: `d-${idx}-${i}`,
          kind: 'detail',
          stt: i + 1,
          categoryName: p.categoryName,
          productCode: p.productCode,
          productName: p.productName,
          unitName: p.unitName,
          quantity: p.quantity,
          priceAtReturn: p.priceAtReturn,
          refundAmount: p.refundAmount,
        });
      });
      rows.push({
        key: `sub-${idx}`,
        kind: 'subtotal',
        stt: 'Tổng cộng',
        quantity: block.totalQuantity,
        refundAmount: block.totalRefundAmount,
      });
    });
    rows.push({
      key: 'grand',
      kind: 'grandtotal',
      stt: 'Tổng cộng',
      quantity: reportData.totalQuantity,
      refundAmount: reportData.totalRefundAmount,
    });
    return rows;
  }, [reportData]);

  const columns: ColumnsType<ITableRow> = [
    {
      title: 'STT',
      dataIndex: 'stt',
      width: 60,
      render: (v, r) =>
        r.kind === 'sectionHeader' ? <Text strong>{v as number}</Text> : v,
    },
    {
      title: 'HĐ Mua',
      dataIndex: 'originalInvoiceNumber',
      width: 140,
      render: (v, r) =>
        r.kind === 'sectionHeader' ? <Text strong>{v}</Text> : v,
    },
    {
      title: 'Ngày HĐ Mua',
      dataIndex: 'originalInvoiceDate',
      width: 140,
      render: (v, r) =>
        r.kind === 'sectionHeader' ? <Text strong>{v}</Text> : v,
    },
    {
      title: 'HĐ Trả',
      dataIndex: 'returnCode',
      width: 140,
      render: (v, r) =>
        r.kind === 'sectionHeader' ? <Text strong>{v}</Text> : v,
    },
    {
      title: 'Ngày Trả',
      dataIndex: 'returnDate',
      width: 140,
      render: (v, r) =>
        r.kind === 'sectionHeader' ? <Text strong>{v}</Text> : v,
    },
    { title: 'Nhóm SP', dataIndex: 'categoryName', width: 140 },
    { title: 'Mã SP', dataIndex: 'productCode', width: 120 },
    { title: 'Tên SP', dataIndex: 'productName', width: 200 },
    { title: 'Đơn vị', dataIndex: 'unitName', width: 100 },
    {
      title: 'SL',
      dataIndex: 'quantity',
      align: 'right',
      width: 100,
      render: (v) => (typeof v === 'number' ? v : ''),
    },
    {
      title: 'Giá thời điểm trả',
      dataIndex: 'priceAtReturn',
      align: 'right',
      width: 140,
      render: (v) => (typeof v === 'number' ? fmtMoney(v) : ''),
    },
    {
      title: 'Tiền Hoàn',
      dataIndex: 'refundAmount',
      align: 'right',
      width: 140,
      render: (v) => (typeof v === 'number' ? fmtMoney(v) : ''),
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
          initialValues={{ dateRange: [dayjs(), dayjs()] }}
        >
          <Row gutter={[12, 12]}>
            <Col xs={24} md={12}>
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
            <Col xs={24} md={12}>
              <Form.Item label=" " style={{ marginBottom: 0 }}>
                <Space>
                  <Button type="primary" htmlType="submit">
                    Lấy báo cáo
                  </Button>
                  <Button
                    onClick={() => {
                      form.resetFields();
                      setQueryParams({
                        fromDate: dayjs().format('YYYY-MM-DD'),
                        toDate: dayjs().format('YYYY-MM-DD'),
                      });
                    }}
                  >
                    Làm mới
                  </Button>
                </Space>
              </Form.Item>
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
              BÁNG KÉ CHI TIẾT HÀNG HÓA ĐƠN TRẢ HÀNG
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
          scroll={{ x: 1600 }}
        />
        {reportData && (
          <div style={{ marginTop: 24, fontSize: 12 }}>
            <Divider />
            <Row gutter={[16, 8]}>
              <Col xs={24} md={16}>
                <div>
                  - Hiển thị chi tiết hàng hóa trả hàng (kèm theo thông tin của
                  hóa đơn mua hàng).
                </div>
                <div>- SL: số lượng sản phẩm trả lại.</div>
                <div>- Giá tại Trả: giá tại thời điểm trả hàng.</div>
                <div>- Tiền Hoàn: tổng tiền hoàn lại cho khách hàng.</div>
              </Col>
              <Col xs={24} md={8}>
                <Tag>Tổng SL trả: {reportData.totalQuantity}</Tag>
                <br />
                <Tag style={{ marginTop: 8 }}>
                  Tổng tiền hoàn: {fmtMoney(reportData.totalRefundAmount)}
                </Tag>
              </Col>
            </Row>
          </div>
        )}
      </Card>
    </StyledWrapper>
  );
};

export { ReportReturnContainer };
