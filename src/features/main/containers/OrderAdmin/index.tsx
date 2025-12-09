import React, { useMemo, useState, useEffect } from 'react';
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  EDeliveryType,
  EOrderStatus,
  useNotification,
} from '@/lib';
import {
  NumberParam,
  StringParam,
  useQueryParams,
  withDefault,
} from 'use-query-params';
import {
  useOrderAdminById,
  useOrderAdminCancel,
  useOrderAdminList,
  useOrderAdminUpdateStatus,
} from '../../react-query';
import type { IAdminOrderListRequest } from '@/dtos';
import {
  Tabs,
  Table,
  Tag,
  Space,
  Select,
  Button,
  Modal,
  Descriptions,
  App,
  Typography,
  Flex,
  Spin,
} from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { SvgPencilIcon, SvgReloadIcon } from '@/assets';

/** ===== Utils / Labels ===== */
const { Text } = Typography;

const formatCurrency = (n?: number) =>
  typeof n === 'number'
    ? n.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
    : '-';

const formatDateTime = (iso?: string) =>
  iso ? new Date(iso).toLocaleString('vi-VN') : '-';

const STATUS_COLORS: Record<EOrderStatus, string> = {
  [EOrderStatus.UNPAID]: 'gold',
  [EOrderStatus.PENDING]: 'blue',
  [EOrderStatus.PREPARED]: 'purple',
  [EOrderStatus.SHIPPING]: 'geekblue',
  [EOrderStatus.DELIVERED]: 'green',
  [EOrderStatus.COMPLETED]: 'success',
  [EOrderStatus.CANCELLED]: 'error',
};

const STATUS_VI: Record<EOrderStatus, string> = {
  [EOrderStatus.UNPAID]: 'Chưa thanh toán',
  [EOrderStatus.PENDING]: 'Chờ xử lý',
  [EOrderStatus.PREPARED]: 'Đã chuẩn bị',
  [EOrderStatus.SHIPPING]: 'Đang giao hàng',
  [EOrderStatus.DELIVERED]: 'Đã giao hàng',
  [EOrderStatus.COMPLETED]: 'Đã hoàn thành',
  [EOrderStatus.CANCELLED]: 'Đã hủy',
};

const DELIVERY_VI: Record<EDeliveryType, string> = {
  [EDeliveryType.HOME_DELIVERY]: 'Giao tận nơi',
  [EDeliveryType.PICKUP_AT_STORE]: 'Lấy tại cửa hàng',
};

const FLOW_BY_TYPE: Record<EDeliveryType, EOrderStatus[]> = {
  [EDeliveryType.PICKUP_AT_STORE]: [
    EOrderStatus.PENDING,
    EOrderStatus.PREPARED,
    EOrderStatus.DELIVERED,
    EOrderStatus.COMPLETED,
  ],
  [EDeliveryType.HOME_DELIVERY]: [
    EOrderStatus.PENDING,
    EOrderStatus.PREPARED,
    EOrderStatus.SHIPPING,
    EOrderStatus.DELIVERED,
    EOrderStatus.COMPLETED,
  ],
};

const ALL_STATUS: EOrderStatus[] = [
  EOrderStatus.PENDING,
  EOrderStatus.PREPARED,
  EOrderStatus.SHIPPING,
  EOrderStatus.DELIVERED,
  EOrderStatus.COMPLETED,
  EOrderStatus.CANCELLED,
];

const statusOptionsByType = (type: EDeliveryType) =>
  (type === EDeliveryType.PICKUP_AT_STORE
    ? ALL_STATUS.filter((s) => s !== EOrderStatus.SHIPPING)
    : ALL_STATUS
  ).map((s) => ({
    label: STATUS_VI[s], // hiển thị tiếng Việt
    value: s,
  }));

const nextStatuses = (type: EDeliveryType, current: EOrderStatus) => {
  const flow = FLOW_BY_TYPE[type];
  const idx = flow.indexOf(current);
  const next = flow[idx + 1];
  return next ? [next] : [];
};

/** ===== Types (rút gọn từ response) ===== */
type OrderItem = {
  productUnitId: number;
  productName: string;
  unitName: string;
  barcode: string;
  quantity: number;
  originalPrice: number;
  discountedPrice: number;
  discountAmount: number;
  lineTotal: number;
  promotionInfo: string | null;
};

type OrderRow = {
  orderId: number;
  orderCode: string;
  orderStatus: EOrderStatus;
  deliveryType: EDeliveryType;
  paymentMethod: 'CASH' | 'ONLINE';
  customerInfo: {
    customerId: number;
    customerName: string;
    phoneNumber: string;
    email: string;
    currentLoyaltyPoints: number;
  };
  deliveryInfo: null | {
    recipientName: string | null;
    deliveryPhone: string | null;
    deliveryAddress: string | null;
    deliveryNote: string | null;
  };
  orderItems?: OrderItem[];
  subtotal: number;
  totalDiscount: number;
  shippingFee: number;
  totalAmount: number;
  amountPaid: number;
  createdAt: string;
};

const OrderAdminContainer: React.FC = () => {
  const { modal } = App.useApp();

  // ===== Query params =====
  const [queryParams, setQueryParams] = useQueryParams({
    page: withDefault(NumberParam, DEFAULT_PAGE),
    size: withDefault(NumberParam, DEFAULT_PAGE_SIZE),
    sortBy: withDefault(StringParam, 'createdAt'),
    sortDirection: withDefault(StringParam, 'desc'),
    status: StringParam,
    deliveryType: withDefault(StringParam, EDeliveryType.HOME_DELIVERY),
  });
  const { notify } = useNotification();
  const currentType =
    (queryParams.deliveryType as EDeliveryType) ?? EDeliveryType.HOME_DELIVERY;

  // ===== Data =====
  const {
    data: orderAdminListData,
    isFetching: isOrderAdminListLoading,
    refetch: refetchList,
  } = useOrderAdminList(queryParams as unknown as IAdminOrderListRequest);

  const [detailOrderId, setDetailOrderId] = useState<number | null>(null);
  const detailEnabled = detailOrderId != null;

  const {
    data: detailData,
    isFetching: isOrderAdminDetailLoading,
    refetch: refetchDetail,
  } = useOrderAdminById(
    detailEnabled ? { orderId: Number(detailOrderId) } : ({} as any),
  );

  const {
    mutateAsync: updateOrderStatus,
    isPending: isUpdateOrderStatusLoading,
  } = useOrderAdminUpdateStatus();
  const { mutateAsync: cancelOrder, isPending: isCancelOrderLoading } =
    useOrderAdminCancel();

  // ===== Local modal status (để không hiển thị lại trạng thái vừa chuyển) =====
  const [localStatus, setLocalStatus] = useState<EOrderStatus | null>(null);

  // ===== Confirmation modal state =====
  const [statusUpdateConfirm, setStatusUpdateConfirm] = useState<{
    orderId: number;
    status: EOrderStatus;
  } | null>(null);

  // Đồng bộ localStatus khi mở modal hoặc khi detailData thay đổi
  useEffect(() => {
    const s = (detailData as any)?.data?.orderStatus as
      | EOrderStatus
      | undefined;
    if (detailEnabled && s) {
      setLocalStatus(s);
    }
    if (!detailEnabled) {
      setLocalStatus(null);
    }
  }, [detailEnabled, (detailData as any)?.data?.orderStatus]);

  // ===== Table config =====
  const pagination: TablePaginationConfig = {
    total: orderAdminListData?.data?.totalElements ?? 0,
    current: (queryParams.page ?? 0) + 1,
    pageSize: queryParams.size ?? DEFAULT_PAGE_SIZE,
    showSizeChanger: true,
    pageSizeOptions: [10, 20, 50, 100],
  };

  const onChangePagination = (p: TablePaginationConfig) => {
    setQueryParams({
      page: (p.current ?? 1) - 1,
      size: p.pageSize ?? DEFAULT_PAGE_SIZE,
    });
  };

  const columns: ColumnsType<OrderRow> = useMemo(
    () => [
      {
        title: 'Mã đơn',
        dataIndex: 'orderCode',
        key: 'orderCode',
        render: (code, row) => (
          <Space direction="vertical" size={0}>
            <Text strong>{code}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {formatDateTime(row.createdAt)}
            </Text>
          </Space>
        ),
        width: 180,
        fixed: 'left',
      },
      {
        title: 'Khách hàng',
        key: 'customer',
        render: (_, r) => (
          <Space direction="vertical" size={0}>
            <Text>{r.customerInfo.customerName}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {r.customerInfo.phoneNumber}
            </Text>
          </Space>
        ),
        width: 180,
      },
      {
        title: 'Hình thức',
        dataIndex: 'deliveryType',
        key: 'deliveryType',
        render: (t: EDeliveryType) => (
          <Tag color={t === EDeliveryType.HOME_DELIVERY ? 'blue' : 'green'}>
            {DELIVERY_VI[t]}
          </Tag>
        ),
        width: 140,
      },
      {
        title: 'Trạng thái',
        dataIndex: 'orderStatus',
        key: 'orderStatus',
        render: (s: EOrderStatus) => (
          <Tag color={STATUS_COLORS[s]}>{STATUS_VI[s]}</Tag>
        ),
        width: 160,
      },
      ...(currentType === EDeliveryType.HOME_DELIVERY
        ? [
            {
              title: 'Địa chỉ giao',
              key: 'addr',
              render: (_: any, r: OrderRow) =>
                r.deliveryInfo?.deliveryAddress ?? '-',
              ellipsis: true,
              width: 240,
            },
          ]
        : []),
      {
        title: 'Tổng tiền',
        dataIndex: 'totalAmount',
        key: 'totalAmount',
        align: 'right' as const,
        render: (v: number) => <Text strong>{formatCurrency(v)}</Text>,
        width: 140,
      },
      {
        title: 'Đã thanh toán',
        dataIndex: 'amountPaid',
        key: 'amountPaid',
        align: 'right' as const,
        render: (v: number) => formatCurrency(v),
        width: 140,
      },
      {
        title: 'Thao tác',
        key: 'actions',
        fixed: 'right' as const,
        width: 90,
        render: (_: any, row: OrderRow) => (
          <Button
            size="large"
            type="text"
            onClick={() => setDetailOrderId(row.orderId)}
            icon={<SvgPencilIcon height={16} width={16} />}
          />
        ),
      },
    ],
    [currentType, isCancelOrderLoading],
  );

  const dataSource: OrderRow[] =
    orderAdminListData?.data?.content?.map((x: any) => x) ?? [];

  // ===== Handlers =====
  const handleCancelOrder = (row: OrderRow) => {
    modal.confirm({
      title: `Hủy đơn ${row.orderCode}?`,
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn muốn hủy đơn hàng này?',
      okText: 'Hủy đơn',
      okButtonProps: { danger: true },
      cancelText: 'Đóng',
      onOk: async () => {
        await cancelOrder(
          { orderId: row.orderId, reason: 'Admin cancelled' },
          {
            onSuccess: async () => {
              notify('success', {
                message: 'Thành công',
                description: 'Hủy đơn hàng thành công',
              });
              // Cập nhật trạng thái trong modal
              setLocalStatus(EOrderStatus.CANCELLED);
              // Refresh dữ liệu bảng danh sách
              await refetchList();
              // Refresh dữ liệu chi tiết modal
              await refetchDetail();
              // Đóng modal sau khi hủy thành công
              setDetailOrderId(null);
            },
            onError: (error) => {
              notify('error', {
                message: 'Thất bại',
                description: error.message || 'Có lỗi xảy ra',
              });
            },
          },
        );
      },
    });
  };

  const handleUpdateStatus = async (
    orderId: number,
    next: EOrderStatus,
    note?: string,
  ) => {
    await updateOrderStatus(
      { newStatus: next, orderId, note },
      {
        onSuccess: () => {
          notify('success', {
            message: 'Thành công',
            description: 'Cập nhật trạng thái đơn hàng thành công',
          });
          setLocalStatus(next);
        },
        onError: (error) => {
          notify('error', {
            message: 'Thất bại',
            description: error.message || 'Có lỗi xảy ra',
          });
        },
      },
    );
    setLocalStatus(next); // giữ trạng thái mới trong modal để không hiện lại trạng thái vừa chuyển
    await refetchList();
    await refetchDetail(); // Refetch detail data để cập nhật trạng thái hiện tại
    // Không đóng modal để có thể cập nhật tiếp
  };

  // Show confirmation modal before updating status
  const handleQuickUpdate = () => {
    if (!detailOrder) return;

    const nextStatus = possibleNext[0];
    if (!nextStatus) return;

    setStatusUpdateConfirm({
      orderId: detailOrder.orderId,
      status: nextStatus,
    });
  };

  // Confirm and execute status update
  const handleConfirmStatusUpdate = async () => {
    if (!statusUpdateConfirm || !detailOrder) return;

    const { status: nextStatus } = statusUpdateConfirm;

    await handleUpdateStatus(
      statusUpdateConfirm.orderId,
      nextStatus,
      'Admin update',
    );

    setStatusUpdateConfirm(null);
  };

  // ===== Toolbar (Filter + Reload) =====
  const StatusFilter = (
    <Space wrap>
      <Text strong>Trạng thái:</Text>
      <Select
        allowClear
        placeholder="Tất cả"
        style={{ width: 220 }}
        options={statusOptionsByType(currentType)}
        value={queryParams.status ?? undefined}
        onChange={(v) =>
          setQueryParams({
            status: (v as EOrderStatus) ?? undefined,
            page: 0,
          })
        }
      />
    </Space>
  );

  // ===== Detail Modal =====
  const detailOrder = detailData?.data as OrderRow | undefined;

  // Trạng thái hiệu lực trong modal: ưu tiên localStatus nếu có
  const effectiveStatus: EOrderStatus | undefined =
    (localStatus as EOrderStatus) ?? detailOrder?.orderStatus;

  const possibleNext =
    detailOrder && effectiveStatus
      ? nextStatuses(detailOrder.deliveryType, effectiveStatus)
      : [];

  // table sản phẩm trong modal
  const itemCols: ColumnsType<OrderItem> = [
    {
      title: 'Sản phẩm',
      dataIndex: 'productName',
      key: 'productName',
      width: 220,
    },
    { title: 'ĐVT', dataIndex: 'unitName', key: 'unitName', width: 90 },
    {
      title: 'SL',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 80,
      align: 'right' as const,
    },
    {
      title: 'Đơn giá',
      dataIndex: 'discountedPrice',
      key: 'discountedPrice',
      width: 130,
      align: 'right' as const,
      render: (v: number) => formatCurrency(v),
    },
    {
      title: 'Giảm',
      dataIndex: 'discountAmount',
      key: 'discountAmount',
      width: 110,
      align: 'right' as const,
      render: (v: number) => formatCurrency(v),
    },
    {
      title: 'Thành tiền',
      dataIndex: 'lineTotal',
      key: 'lineTotal',
      width: 140,
      align: 'right' as const,
      render: (v: number) => <Text strong>{formatCurrency(v)}</Text>,
    },
  ];

  return (
    <div
      style={{
        background: '#fff',
        padding: 16,
        borderRadius: 8,
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
      }}
    >
      {/* Tabs */}
      <Tabs
        activeKey={currentType}
        onChange={(k) =>
          setQueryParams({
            deliveryType: k,
            page: 0,
            status:
              k === EDeliveryType.PICKUP_AT_STORE &&
              queryParams.status === EOrderStatus.SHIPPING
                ? undefined
                : queryParams.status,
          })
        }
        items={[
          {
            key: EDeliveryType.HOME_DELIVERY,
            label: 'Giao hàng tận nơi',
            children: (
              <>
                <Flex
                  align="center"
                  justify="space-between"
                  style={{ marginBottom: 12 }}
                >
                  {StatusFilter}
                  <Button
                    size="large"
                    icon={<SvgReloadIcon />}
                    onClick={() => refetchList()}
                  />
                </Flex>
                <Table<OrderRow>
                  size="small"
                  rowKey="orderId"
                  loading={isOrderAdminListLoading}
                  columns={columns}
                  dataSource={dataSource.filter(
                    (x) => x.deliveryType === EDeliveryType.HOME_DELIVERY,
                  )}
                  pagination={pagination}
                  onChange={onChangePagination}
                  scroll={{ x: 1200 }}
                />
              </>
            ),
          },
          {
            key: EDeliveryType.PICKUP_AT_STORE,
            label: 'Lấy tại cửa hàng',
            children: (
              <>
                <Flex
                  align="center"
                  justify="space-between"
                  style={{ marginBottom: 12 }}
                >
                  {StatusFilter}
                  <Button
                    size="large"
                    icon={<SvgReloadIcon />}
                    onClick={() => refetchList()}
                  />
                </Flex>
                <Table<OrderRow>
                  rowKey="orderId"
                  loading={isOrderAdminListLoading}
                  columns={columns}
                  size="small"
                  dataSource={dataSource.filter(
                    (x) => x.deliveryType === EDeliveryType.PICKUP_AT_STORE,
                  )}
                  pagination={pagination}
                  onChange={onChangePagination}
                  scroll={{ x: 1200 }}
                />
              </>
            ),
          },
        ]}
      />

      {/* Modal chi tiết + cập nhật */}
      <Modal
        width={1600}
        style={{ top: 20 }}
        title={
          detailOrder
            ? `Đơn ${detailOrder.orderCode} • ${DELIVERY_VI[detailOrder.deliveryType]}`
            : 'Chi tiết đơn hàng'
        }
        open={detailEnabled}
        onCancel={() => setDetailOrderId(null)}
        footer={
          detailOrder ? (
            <Space>
              <Button onClick={() => setDetailOrderId(null)}>Đóng</Button>
              <Button
                danger
                disabled={
                  effectiveStatus === EOrderStatus.CANCELLED ||
                  effectiveStatus === EOrderStatus.COMPLETED
                }
                loading={isCancelOrderLoading}
                onClick={() =>
                  handleCancelOrder(detailOrder as unknown as OrderRow)
                }
              >
                Hủy đơn
              </Button>
              <Button
                type="primary"
                disabled={
                  possibleNext.length === 0 ||
                  effectiveStatus === EOrderStatus.CANCELLED
                }
                onClick={() => handleQuickUpdate()}
                loading={isUpdateOrderStatusLoading}
              >
                Cập nhật
              </Button>
            </Space>
          ) : (
            <Button onClick={() => setDetailOrderId(null)}>Đóng</Button>
          )
        }
        destroyOnClose
      >
        <div style={{ display: 'flex', gap: 16 }}>
          {isOrderAdminDetailLoading ? (
            <Spin />
          ) : (
            <div>
              <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="Mã đơn" span={1}>
                  {detailOrder?.orderCode}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày tạo" span={1}>
                  {formatDateTime(detailOrder?.createdAt)}
                </Descriptions.Item>

                <Descriptions.Item label="Khách hàng" span={1}>
                  {detailOrder?.customerInfo.customerName}
                </Descriptions.Item>
                <Descriptions.Item label="SĐT" span={1}>
                  {detailOrder?.customerInfo.phoneNumber}
                </Descriptions.Item>

                <Descriptions.Item label="Hình thức" span={1}>
                  {detailOrder && DELIVERY_VI[detailOrder.deliveryType]}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái" span={1}>
                  {detailOrder && effectiveStatus && (
                    <Tag color={STATUS_COLORS[effectiveStatus]}>
                      {STATUS_VI[effectiveStatus]}
                    </Tag>
                  )}
                </Descriptions.Item>

                {detailOrder?.deliveryType === EDeliveryType.HOME_DELIVERY && (
                  <Descriptions.Item label="Địa chỉ giao" span={2}>
                    {detailOrder?.deliveryInfo?.deliveryAddress ?? '-'}
                  </Descriptions.Item>
                )}

                <Descriptions.Item label="Tạm tính" span={1}>
                  {formatCurrency(detailOrder?.subtotal)}
                </Descriptions.Item>
                <Descriptions.Item label="Giảm giá" span={1}>
                  {formatCurrency(detailOrder?.totalDiscount)}
                </Descriptions.Item>
                <Descriptions.Item label="Phí vận chuyển" span={1}>
                  {formatCurrency(detailOrder?.shippingFee)}
                </Descriptions.Item>
                <Descriptions.Item label="Tổng thanh toán" span={1}>
                  <Text strong>{formatCurrency(detailOrder?.totalAmount)}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Đã thanh toán" span={1}>
                  {formatCurrency(detailOrder?.amountPaid)}
                </Descriptions.Item>
                <Descriptions.Item label=" " span={1}>
                  <></>
                </Descriptions.Item>
              </Descriptions>
            </div>
          )}

          {/* RIGHT: Products (scroll) */}
          <div
            style={{
              flex: 1,
              minWidth: 420,
              maxHeight: '60vh',
              overflow: 'auto',
              border: '1px solid #f0f0f0',
              borderRadius: 8,
              padding: 12,
              background: '#fff',
            }}
          >
            <Text strong style={{ display: 'block', marginBottom: 8 }}>
              Sản phẩm trong đơn
            </Text>
            <Table<OrderItem>
              size="small"
              rowKey={(r) => `${r.productUnitId}-${r.barcode}-${r.lineTotal}`}
              columns={itemCols}
              dataSource={detailOrder?.orderItems ?? []}
              pagination={false}
              scroll={{ x: 900 }}
              loading={isOrderAdminDetailLoading}
            />
          </div>
        </div>
      </Modal>

      {/* Confirmation Modal for Status Update */}
      <Modal
        title="Xác nhận cập nhật trạng thái"
        open={!!statusUpdateConfirm}
        onCancel={() => setStatusUpdateConfirm(null)}
        okText="Cập nhật"
        cancelText="Hủy"
        onOk={() => handleConfirmStatusUpdate()}
        confirmLoading={isUpdateOrderStatusLoading}
        zIndex={1001}
      >
        <p>
          Bạn chắc chắn muốn cập nhật trạng thái đơn hàng thành{' '}
          <strong>
            {statusUpdateConfirm ? STATUS_VI[statusUpdateConfirm.status] : ''}
          </strong>
          ?
        </p>
      </Modal>
    </div>
  );
};

export { OrderAdminContainer };
