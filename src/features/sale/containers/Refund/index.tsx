import { useState, useMemo } from 'react';
import {
  Button,
  DatePicker,
  Input,
  List,
  Modal,
  Spin,
  Tag,
  Typography,
  Empty,
  Table,
  Space,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

import { useOrderList, useRefundById, useRefundList } from '@/features/sale';
import { ROUTE_PATH } from '@/common';

const { RangePicker } = DatePicker;
const { Text } = Typography;

// ===== Types (aligning with the given responses) =====
type RefundListItem = {
  returnId: number;
  returnCode: string;
  returnDate: string;
  invoiceNumber: string;
  customerName: string | null;
  customerPhone: string | null;
  employeeName: string;
  totalRefundAmount: number;
  reclaimedDiscountAmount: number;
  finalRefundAmount: number;
  reasonNote: string | null;
};

type InvoiceListItem = {
  invoiceId: number;
  invoiceNumber: string;
  invoiceDate: string;
  orderId: number;
  customerName: string;
  employeeName: string;
  paymentMethod: 'CASH' | 'ONLINE';
  status: 'PAID' | 'ISSUED' | string;
  subtotal: number;
  totalDiscount: number;
  totalTax: number;
  totalAmount: number;
  paidAmount: number;
};

// ===== Helpers =====
const money = (n: number | undefined | null) =>
  typeof n === 'number' ? n.toLocaleString('vi-VN') + 'đ' : '--';

// ===== Component =====
const RefundContainer = () => {
  // Sidebar: list of refund tickets
  const { data: refundListResp, isLoading: isLoadingRefundList } =
    useRefundList({});
  const refundItems: RefundListItem[] = refundListResp?.data?.content ?? [];

  // Selected refund ticket
  const [selectedRefundId, setSelectedRefundId] = useState<number | undefined>(
    refundItems?.[0]?.returnId,
  );
  const { data: refundResp, isLoading: isLoadingRefund } = useRefundById({
    returnId: selectedRefundId,
  });
  const refundData = refundResp?.data;

  // Create refund: modal with list of invoices
  const [openInvoiceModal, setOpenInvoiceModal] = useState(false);
  const { data: orderListResp, isLoading: isLoadingOrderList } = useOrderList(
    {},
  );

  const invoices: InvoiceListItem[] = orderListResp?.data?.invoices ?? [];

  // Simple local filters for sidebar (search by code/invoice/phone + date range)
  const [keyword, setKeyword] = useState<string>('');
  const [dateRange, setDateRange] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  >(null);

  const filteredRefunds = useMemo(() => {
    const [from, to] = dateRange ?? [null, null];
    return (refundItems ?? []).filter((r) => {
      const matchKeyword =
        !keyword ||
        r.returnCode?.toLowerCase().includes(keyword.toLowerCase()) ||
        r.invoiceNumber?.toLowerCase().includes(keyword.toLowerCase()) ||
        (r.customerPhone ?? '').includes(keyword);
      const d = dayjs(r.returnDate);
      const inRange =
        !from ||
        !to ||
        (d.isAfter(from.startOf('day')) && d.isBefore(to.endOf('day')));
      return matchKeyword && inRange;
    });
  }, [refundItems, keyword, dateRange]);

  const navigate = useNavigate();

  // ===== Table columns for invoice modal =====
  const columns: ColumnsType<InvoiceListItem> = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
      render: (v) => <Text code>{v}</Text>,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'invoiceDate',
      key: 'invoiceDate',
      render: (v) => dayjs(v).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
      ellipsis: true,
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      align: 'right' as const,
      render: (n: number) => money(n),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => {
            setOpenInvoiceModal(false);
            navigate(ROUTE_PATH.SALE.CREATE_REFUND_ORDER.LINK(record.orderId));
          }}
        >
          Trả hàng
        </Button>
      ),
    },
  ];

  return (
    <div
      className="p-4"
      style={{
        display: 'grid',
        gridTemplateColumns: '360px 1fr',
        gap: 16,
        height: '100%',
      }}
    >
      {/* Left panel: search + list */}
      <div
        style={{
          background: '#fff',
          padding: 12,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Input.Search
            placeholder="Tìm kiếm mã đơn trả hàng, SDT, mã hoá đơn..."
            allowClear
            onSearch={setKeyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <RangePicker
            style={{ width: '100%' }}
            placeholder={['Từ ngày', 'Đến ngày']}
            onChange={(vals) => setDateRange(vals as any)}
            format="DD/MM/YYYY"
          />
          <Button type="primary" onClick={() => setOpenInvoiceModal(true)}>
            Tạo đơn trả hàng
          </Button>
        </Space>

        <div style={{ marginTop: 12, flex: 1, overflow: 'auto' }}>
          {isLoadingRefundList ? (
            <div style={{ paddingTop: 48, textAlign: 'center' }}>
              <Spin />
            </div>
          ) : filteredRefunds.length === 0 ? (
            <Empty description="Không có đơn trả hàng" />
          ) : (
            <List
              dataSource={filteredRefunds}
              renderItem={(item) => {
                const isActive = item.returnId === selectedRefundId;
                return (
                  <List.Item
                    onClick={() => setSelectedRefundId(item.returnId)}
                    style={{
                      cursor: 'pointer',
                      background: isActive ? '#e6f4ff' : undefined,
                      borderRadius: 8,
                      marginBottom: 6,
                      padding: '10px 12px',
                    }}
                  >
                    <div style={{ width: '100%' }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Space>
                          <Text strong>#{item.returnId}</Text>
                          <Text type="secondary">
                            {dayjs(item.returnDate).format('DD/MM/YYYY HH:mm')}
                          </Text>
                        </Space>
                        <Space size={6}>
                          <Tag>Đã nhận hàng</Tag>
                          <Tag color="green">Đã hoàn trả</Tag>
                        </Space>
                      </div>
                      <div style={{ marginTop: 4 }}>
                        <Text type="secondary">Hoá đơn gốc:</Text>{' '}
                        <Text code>{item.invoiceNumber}</Text>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginTop: 4,
                        }}
                      >
                        <Text type="secondary">
                          Nhân viên: {item.employeeName}
                        </Text>
                        <Text strong>{money(item.finalRefundAmount)}</Text>
                      </div>
                    </div>
                  </List.Item>
                );
              }}
            />
          )}
        </div>
      </div>

      {/* Right panel: details */}
      <div style={{ paddingLeft: 8, minHeight: 400 }}>
        {!selectedRefundId ? (
          <div style={{ paddingTop: 48, textAlign: 'center' }}>
            <Empty description="Đơn trả hàng được chọn sẽ hiển thị tại đây!" />
          </div>
        ) : isLoadingRefund ? (
          <div style={{ paddingTop: 48, textAlign: 'center' }}>
            <Spin />
          </div>
        ) : !refundData ? (
          <Empty description="Không tìm thấy chi tiết đơn trả" />
        ) : (
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div>
                <Text style={{ marginBottom: 0, fontSize: 20 }} strong>
                  #{refundData.returnId} · Đơn hàng gốc:{' '}
                  <Text code>{refundData.invoiceNumber}</Text>
                </Text>
                <Text type="secondary">
                  Tạo lúc{' '}
                  {dayjs(refundData.returnDate).format('DD/MM/YYYY HH:mm')} ·
                  Nhân viên: <Text strong>{refundData.employee.name}</Text>
                </Text>
              </div>

              <div
                style={{
                  background: '#fff',
                  borderRadius: 8,
                  border: '1px solid #f0f0f0',
                }}
              >
                <div
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid #f0f0f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Space>
                    <Tag color="blue">Đã nhận hàng</Tag>
                    <Text type="secondary">
                      {refundData.returnDetails.length} dòng
                    </Text>
                  </Space>
                  <Text type="secondary">Trả hàng tại Cửa hàng chính</Text>
                </div>
                <div style={{ padding: '12px 16px' }}>
                  <List
                    dataSource={refundData.returnDetails}
                    renderItem={(d) => (
                      <List.Item>
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <Space
                            align="center"
                            style={{
                              justifyContent: 'space-between',
                              width: '100%',
                            }}
                          >
                            <Space>
                              <Text strong>{d.productName}</Text>
                              <Tag>Phiên bản gốc</Tag>
                            </Space>
                            <Space>
                              <Text>x{d.quantity}</Text>
                              <Text>{money(d.returnAmount)}</Text>
                            </Space>
                          </Space>
                          <ul style={{ margin: 0, paddingLeft: 18 }}>
                            <li>Đã hoàn trả</li>
                            <li>Đã nhận lại hàng</li>
                          </ul>
                        </Space>
                      </List.Item>
                    )}
                  />
                </div>
                <div
                  style={{
                    padding: '12px 16px',
                    borderTop: '1px solid #f0f0f0',
                  }}
                >
                  <Space
                    style={{ width: '100%', justifyContent: 'space-between' }}
                  >
                    <Text type="secondary">Tiền khách nhận</Text>
                    <Text strong>{money(refundData.finalRefundAmount)}</Text>
                  </Space>
                  {refundData.reclaimedDiscountAmount ? (
                    <Space
                      style={{ width: '100%', justifyContent: 'space-between' }}
                    >
                      <Text type="secondary">Khuyến mãi thu hồi</Text>
                      <Text>{money(refundData.reclaimedDiscountAmount)}</Text>
                    </Space>
                  ) : null}
                </div>
              </div>

              <Space>
                <Tag color="green">Đã hoàn trả</Tag>
                {refundData.reasonNote ? (
                  <Text type="secondary">Ghi chú: {refundData.reasonNote}</Text>
                ) : null}
              </Space>
            </Space>
          </div>
        )}
      </div>

      {/* Modal chọn hoá đơn để tạo đơn trả */}
      <Modal
        title="Chọn đơn hàng để trả"
        open={openInvoiceModal}
        onCancel={() => setOpenInvoiceModal(false)}
        footer={null}
        width={940}
        style={{ top: 20 }}
      >
        <div>
          {isLoadingOrderList ? (
            <div style={{ padding: '24px 0', textAlign: 'center' }}>
              <Spin />
            </div>
          ) : (
            <Table
              rowKey="invoiceId"
              dataSource={invoices}
              columns={columns}
              pagination={{ pageSize: 8 }}
              scroll={{ y: 420 }}
            />
          )}
        </div>
      </Modal>
    </div>
  );
};

export { RefundContainer };
