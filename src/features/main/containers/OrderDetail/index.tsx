import React, { useMemo } from 'react';
import {
  Card,
  Descriptions,
  Table,
  Tag,
  Typography,
  Space,
  Button,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrderByInvoiceId } from '@/features/sale';
import { EInvoiceStatus } from '@/lib';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Title } = Typography;

const currency = (v?: number) =>
  (v ?? 0).toLocaleString('vi-VN', { maximumFractionDigits: 0 });
const statusTag = (s?: EInvoiceStatus) => {
  const map: Record<string, { color: string; text: string }> = {
    CANCELLED: { color: 'default', text: 'Đã hủy' },
    DRAFT: { color: 'processing', text: 'Nháp' },
    ISSUED: { color: 'warning', text: 'Đã xuất' },
    PAID: { color: 'success', text: 'Đã thanh toán' },
    'PARTIALLY-PAID': { color: 'purple', text: 'Thanh toán một phần' },
    PARTIALLY_PAID: { color: 'purple', text: 'Thanh toán một phần' },
    REFUNDED: { color: 'magenta', text: 'Đã hoàn' },
  };
  const v = s
    ? (map[s] ?? { color: 'default', text: s })
    : { color: 'default', text: '-' };
  return <Tag color={v.color}>{v.text}</Tag>;
};

type Item = {
  invoiceDetailId: number;
  productUnitId: number;
  productName: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  lineTotal: number;
  appliedPromotions?: Array<{
    promotionId: string;
    promotionName: string;
    promotionDetailId: number;
    promotionSummary: string;
    discountType: string;
    discountValue: number;
    sourceLineItemId?: number | null;
  }>;
};

const OrderDetailContainer: React.FC = () => {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const navigate = useNavigate();

  const { data, isPending } = useOrderByInvoiceId({
    invoiceId: Number(invoiceId),
  });
  const inv = data?.data;

  const itemColumns: ColumnsType<Item> = useMemo(
    () => [
      { title: 'Sản phẩm', dataIndex: 'productName', key: 'productName' },
      { title: 'ĐVT', dataIndex: 'unit', key: 'unit', width: 90 },
      {
        title: 'Số lượng',
        dataIndex: 'quantity',
        key: 'quantity',
        align: 'right',
        width: 100,
      },
      {
        title: 'Đơn giá',
        dataIndex: 'unitPrice',
        key: 'unitPrice',
        align: 'right',
        width: 130,
        render: (v) => currency(v),
      },
      {
        title: 'Giảm',
        dataIndex: 'discountAmount',
        key: 'discountAmount',
        align: 'right',
        width: 130,
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
      {
        title: 'Khuyến mãi áp dụng',
        key: 'appliedPromotions',
        render: (_, r) =>
          (r.appliedPromotions ?? []).length ? (
            <Space direction="vertical" size={4}>
              {(r.appliedPromotions ?? []).map((p) => (
                <Tag key={`${p.promotionId}-${p.promotionDetailId}`}>
                  {p.promotionSummary}
                </Tag>
              ))}
            </Space>
          ) : (
            <span>-</span>
          ),
      },
    ],
    [],
  );

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Space
        align="center"
        style={{ width: '100%', justifyContent: 'space-between' }}
      >
        <Title level={4} style={{ margin: 0 }}>
          Chi tiết Hóa đơn
        </Title>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
          Quay lại
        </Button>
      </Space>

      <Card loading={isPending}>
        <Descriptions bordered size="middle" column={3}>
          <Descriptions.Item label="Số hóa đơn">
            <Tag>{inv?.invoiceNumber}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Ngày bán">
            {inv?.invoiceDate
              ? dayjs(inv.invoiceDate).format('DD/MM/YYYY HH:mm')
              : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            {statusTag(inv?.status as EInvoiceStatus)}
          </Descriptions.Item>

          <Descriptions.Item label="Khách hàng">
            {inv?.customerName ?? '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Nhân viên">
            {inv?.employeeName ?? '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Thanh toán bằng">
            {inv?.paymentMethod === 'CASH' ? 'Tiền mặt' : 'Chuyển khoản'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Chi tiết sản phẩm">
        <Table<Item>
          rowKey="invoiceDetailId"
          loading={isPending}
          columns={itemColumns}
          dataSource={inv?.items ?? []}
          pagination={false}
          scroll={{ x: 1000 }}
        />
      </Card>

      <Card>
        <Descriptions bordered column={4}>
          <Descriptions.Item label="Tạm tính">
            {currency(inv?.subtotal)}
          </Descriptions.Item>
          <Descriptions.Item label="Giảm giá">
            {currency(inv?.totalDiscount)}
          </Descriptions.Item>
          <Descriptions.Item label="Thuế">
            {currency(inv?.totalTax)}
          </Descriptions.Item>
          <Descriptions.Item label="Thành tiền">
            <b>{currency(inv?.totalAmount)}</b>
          </Descriptions.Item>
          <Descriptions.Item label="Đã thanh toán" span={4}>
            {currency(inv?.paidAmount)}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </Space>
  );
};

export { OrderDetailContainer };
