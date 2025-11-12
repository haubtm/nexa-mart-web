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
import { useRefundById } from '../../react-query';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Title } = Typography;

const currency = (v?: number) =>
  (v ?? 0).toLocaleString('vi-VN', { maximumFractionDigits: 0 });

type RefundDetail = {
  returnDetailId: number;
  quantity: number;
  productName: string;
  productUnit: string;
  priceAtReturn: number;
  refundAmount: number;
};

const RefundDetailContainer: React.FC = () => {
  const { refundId } = useParams<{ refundId: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useRefundById({
    returnId: Number(refundId),
  });
  const refund = data?.data;

  const detailColumns: ColumnsType<RefundDetail> = useMemo(
    () => [
      {
        title: 'Sản phẩm',
        dataIndex: 'productName',
        key: 'productName',
      },
      {
        title: 'ĐVT',
        dataIndex: 'productUnit',
        key: 'productUnit',
        width: 90,
      },
      {
        title: 'Số lượng trả',
        dataIndex: 'quantity',
        key: 'quantity',
        align: 'right',
        width: 100,
      },
      {
        title: 'Đơn giá',
        dataIndex: 'priceAtReturn',
        key: 'priceAtReturn',
        align: 'right',
        width: 130,
        render: (v) => currency(v),
      },
      {
        title: 'Thành tiền',
        dataIndex: 'refundAmount',
        key: 'refundAmount',
        align: 'right',
        width: 140,
        render: (v) => <b>{currency(v)}</b>,
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
          Chi tiết Phiếu trả hàng
        </Title>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
          Quay lại
        </Button>
      </Space>

      <Card loading={isLoading}>
        <Descriptions bordered size="middle" column={3}>
          <Descriptions.Item label="Mã phiếu trả">
            <Tag>{refund?.returnCode}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Ngày trả">
            {refund?.returnDate
              ? dayjs(refund.returnDate).format('DD/MM/YYYY HH:mm')
              : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Số hóa đơn">
            <Tag>{refund?.invoiceNumber}</Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Khách hàng">
            <Space direction="vertical" size={0}>
              <span>{(refund?.customer as any)?.name ?? '-'}</span>
              {(refund?.customer as any)?.phone ? (
                <small>{(refund?.customer as any)?.phone}</small>
              ) : null}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Nhân viên">
            {refund?.employee?.name ?? '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Ghi chú">
            {refund?.reasonNote ?? '-'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Chi tiết sản phẩm trả">
        <Table<RefundDetail>
          rowKey="returnDetailId"
          loading={isLoading}
          columns={detailColumns}
          dataSource={
            (refund?.returnDetails ?? []).map((d: any) => ({
              returnDetailId: d.returnDetailId,
              quantity: d.quantity,
              productName: d.productName,
              productUnit: d.productUnit,
              priceAtReturn: d.priceAtReturn,
              refundAmount: d.refundAmount,
            })) as RefundDetail[]
          }
          pagination={false}
          scroll={{ x: 800 }}
        />
      </Card>

      <Card>
        <Descriptions bordered column={4}>
          <Descriptions.Item label="Tiền hoàn">
            {currency(refund?.totalRefundAmount)}
          </Descriptions.Item>
          <Descriptions.Item label="Thu hồi KM">
            {currency(refund?.reclaimedDiscountAmount)}
          </Descriptions.Item>
          <Descriptions.Item label="Thành tiền">
            <b>{currency(refund?.finalRefundAmount)}</b>
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo" span={4}>
            {refund?.createdAt
              ? dayjs(refund.createdAt).format('DD/MM/YYYY HH:mm')
              : '-'}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </Space>
  );
};

export default RefundDetailContainer;
export { RefundDetailContainer };
