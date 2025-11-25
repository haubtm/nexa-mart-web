import React, { useEffect, useMemo, useState } from 'react';
import {
  App,
  Space,
  Statistic,
  Tag,
  Tabs,
  Popconfirm,
  Modal,
  Radio,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  useProductList,
  usePromotionCheck,
  useOrderCreate,
  useOrderStatus,
  useCustomerList,
} from '@/features/sale';
import {
  Button,
  Divider,
  Flex,
  InputNumber,
  Select,
  Table,
  Text,
  useDebounce,
} from '@/lib';
import { useAppSelector } from '@/redux/hooks';

export type ProductUnit = {
  id: number; // productUnitId
  code: string;
  barcode: string | null;
  conversionValue: number;
  isBaseUnit: boolean;
  isActive: boolean;
  unitName: string;
  unitId: number;
};

export type Product = {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  isRewardPoint: boolean;
  createdDate: string;
  updatedAt: string;
  brandName: string | null;
  categoryName: string | null;
  unitCount: number;
  imageCount: number;
  mainImageUrl: string | null;
  units: ProductUnit[];
};

export type ProductListResponse = {
  success: boolean;
  message: string;
  data: {
    products: Product[];
    pageInfo: {
      currentPage: number;
      pageSize: number;
      totalElements: number;
      totalPages: number;
      isFirst: boolean;
      isLast: boolean;
      hasPrevious: boolean;
      hasNext: boolean;
    };
  };
  timestamp: string;
};

export type PromotionLineItem = {
  lineItemId: number;
  productUnitId: number;
  unit: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  hasPromotion: boolean | null;
  promotionApplied: null | {
    promotionId: string;
    promotionName: string;
    promotionDetailId: number;
    promotionSummary: string;
    discountType: 'fixed' | 'percentage';
    discountValue: number;
    sourceLineItemId: number | null;
  };
};

export type PromotionSummary = {
  subTotal: number;
  orderDiscount: number;
  lineItemDiscount: number;
  totalPayable: number;
};

export type PromotionResponse = {
  success: boolean;
  message: string;
  data: {
    items: PromotionLineItem[];
    summary: PromotionSummary;
    appliedOrderPromotions: {
      promotionId: string;
      promotionName: string;
      promotionDetailId: number;
      promotionSummary: string;
      discountType: 'fixed' | 'percentage';
      discountValue: number;
    }[];
  } | null;
  timestamp: string;
};

export type CartItem = {
  key: string; // dùng productUnitId làm key
  productId: number;
  productUnitId: number;
  productName: string;
  unitName: string;
  unitPrice: number;
  quantity: number;
};

export type CartState = {
  id: string;
  name: string;
  items: CartItem[];
};

export type CartSummary = {
  subTotal: number;
  lineItemDiscount: number;
  orderDiscount: number;
  totalPayable: number;
};

/**
 * ---------- CartTab (mỗi tab 1 hook usePromotionCheck riêng) ----------
 */
const CartTab: React.FC<{
  cart: CartState;
  onCartChange: (next: CartState) => void;
  onSummaryChange?: (sum: CartSummary) => void;
  onCloseCurrent: () => void;
  // map productId -> units (để render Select đổi đơn vị)
  unitsByProductId: Record<number, ProductUnit[]>;
}> = ({
  cart,
  onCartChange,
  onSummaryChange,
  onCloseCurrent,
  unitsByProductId,
}) => {
  const user = useAppSelector((state) => state.user).profile;
  const employeeId = user?.employeeId || 0;

  /** ---- Tìm kiếm & chọn khách hàng ---- */
  const [customerSearch, setCustomerSearch] = useState<string>('');
  const searchCustomerDebounced = useDebounce(customerSearch);
  const { data: customerData } = useCustomerList({
    search: searchCustomerDebounced,
  }) as unknown as {
    data?: {
      data?: {
        content?: Array<{
          customerId: number;
          name: string;
          phone: string | null;
          customerCode: string | null;
        }>;
      };
    };
  };
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(
    null,
  );
  const selectedCustomerLabel = useMemo(() => {
    const list = customerData?.data?.content ?? [];
    const c = list.find((x) => x.customerId === selectedCustomerId);
    if (!c) return null;
    const phone = c.phone ? ` – ${c.phone}` : '';
    return `${c.name}${phone}`;
  }, [customerData, selectedCustomerId]);

  const customerOptions = useMemo(() => {
    const list = customerData?.data?.content ?? [];
    return list.map((c) => ({
      value: c.customerId,
      label: `${c.name}${c.phone ? ' – ' + c.phone : ''}`,
    }));
  }, [customerData]);

  const { message } = App.useApp();

  // payload khuyến mãi
  const promoPayload = useMemo(
    () =>
      cart.items.map((i) => ({
        productUnitId: i.productUnitId,
        quantity: i.quantity,
      })),
    [cart.items],
  );

  const { data: promotionData, isLoading: isLoadingPromotion } =
    usePromotionCheck({
      items: promoPayload as any,
    }) as unknown as { data?: PromotionResponse; isLoading: boolean };

  // Map đơn giá net theo productUnit
  const netUnitPriceByPU: Record<number, number> = useMemo(() => {
    const map: Record<number, number> = {};
    const lines = promotionData?.data?.items ?? [];
    lines.forEach((li) => {
      if (li.quantity > 0 && li.lineTotal > 0) {
        const unit = Math.round(li.lineTotal / li.quantity);
        if (unit > 0) map[li.productUnitId] = unit;
      }
    });
    return map;
  }, [promotionData]);

  // Summary
  const computed: CartSummary = useMemo(() => {
    const summary = promotionData?.data?.summary;
    if (summary) {
      return {
        subTotal: summary.subTotal,
        lineItemDiscount: summary.lineItemDiscount,
        orderDiscount: summary.orderDiscount,
        totalPayable: summary.totalPayable,
      };
    }
    const subLocal = cart.items.reduce(
      (s, i) =>
        s + (netUnitPriceByPU[i.productUnitId] ?? i.unitPrice) * i.quantity,
      0,
    );
    return {
      subTotal: subLocal,
      lineItemDiscount: 0,
      orderDiscount: 0,
      totalPayable: subLocal,
    };
  }, [cart.items, netUnitPriceByPU, promotionData]);

  useEffect(() => {
    onSummaryChange?.(computed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    computed.subTotal,
    computed.lineItemDiscount,
    computed.orderDiscount,
    computed.totalPayable,
  ]);

  // ---- Tạo đơn & thanh toán ----
  const { mutate: createOrder, isPending: isCreatingOrder } = useOrderCreate();
  const [payOpen, setPayOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'ONLINE'>('CASH');
  const [amountPaid, setAmountPaid] = useState<number>(0);

  // QR ONLINE
  const [qrVisible, setQrVisible] = useState(false);
  const [qrCodeValue, setQrCodeValue] = useState<string | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [orderIdToTrack, setOrderIdToTrack] = useState<number | null>(null);
  const { data: orderStatusData, refetch: refetchOrderStatus } = useOrderStatus(
    {
      orderId: orderIdToTrack ?? 0,
    },
  );

  useEffect(() => {
    if (payOpen) setAmountPaid(computed.totalPayable ?? 0);
  }, [payOpen, computed.totalPayable]);

  const handleCreateOrder = () => {
    if (!promotionData?.data) {
      message?.warning('Chưa có dữ liệu khuyến mãi để tạo hoá đơn.');
      return;
    }

    const payload: any = {
      amountPaid: paymentMethod === 'CASH' ? amountPaid : 0,
      employeeId,
      paymentMethod,
      items: promotionData.data.items,
      appliedOrderPromotions: promotionData.data.appliedOrderPromotions,
    };

    if (selectedCustomerId) payload.customerId = selectedCustomerId;

    createOrder(payload, {
      onSuccess: (res: any) => {
        const data = res?.data;
        if (!data) return;
        if (paymentMethod === 'CASH') {
          message?.success(
            `Đã tạo hoá đơn ${data.invoiceNumber}. Thối lại ${Number(
              data.changeAmount || 0,
            ).toLocaleString('vi-VN')}đ`,
          );
          setPayOpen(false);
          onCloseCurrent();
        } else {
          setQrCodeValue(data.qrCode || null);
          setPaymentUrl(data.paymentUrl || null);
          // Cắt 2 số cuối từ orderCode (ví dụ: 2000000041 -> 41)
          const orderCode = data.orderCode;
          const invoiceId = orderCode ? Number(String(orderCode).slice(-2)) : null;
          setOrderIdToTrack(invoiceId);
          setPayOpen(false);
          setQrVisible(true);
        }
      },
      onError: () => message?.error('Tạo hoá đơn thất bại'),
    });
  };

  // Polling ONLINE - kiểm tra trạng thái thanh toán
  useEffect(() => {
    if (!qrVisible || !orderIdToTrack) return;
    const id = setInterval(async () => {
      try {
        const r = await (refetchOrderStatus?.() as unknown as Promise<any>);
        const invoiceStatus = r?.data?.data?.invoiceStatus || orderStatusData?.data?.invoiceStatus;
        // Dừng polling khi trạng thái là PAID hoặc COMPLETED
        if (invoiceStatus === 'PAID' || invoiceStatus === 'COMPLETED') {
          message?.success('Thanh toán hoàn tất');
          setQrVisible(false);
          setQrCodeValue(null);
          setOrderIdToTrack(null);
          onCloseCurrent();
        }
      } catch {
        throw new Error('Lỗi khi kiểm tra trạng thái đơn hàng');
      }
    }, 2000);
    return () => clearInterval(id);
  }, [qrVisible, orderIdToTrack]);

  // ---- Handlers số lượng / xoá ----
  const changeQty = (productUnitId: number, qty: number) => {
    const nextItems = cart.items
      .map((it) =>
        it.productUnitId === productUnitId
          ? { ...it, quantity: Math.max(0, qty) }
          : it,
      )
      .filter((it) => it.quantity > 0);
    onCartChange({ ...cart, items: nextItems });
  };
  const inc = (productUnitId: number) => {
    const row = cart.items.find((x) => x.productUnitId === productUnitId);
    changeQty(productUnitId, (row?.quantity ?? 0) + 1);
  };
  const dec = (productUnitId: number) => {
    const row = cart.items.find((x) => x.productUnitId === productUnitId);
    changeQty(productUnitId, Math.max(0, (row?.quantity ?? 0) - 1));
  };
  const removeItem = (productUnitId: number) => {
    onCartChange({
      ...cart,
      items: cart.items.filter((i) => i.productUnitId !== productUnitId),
    });
  };

  // ---- Đổi đơn vị cho 1 dòng ----
  const changeUnitForItem = (
    productUnitIdCurrent: number,
    _productId: number,
    newUnitId: number,
    newUnitName: string,
  ) => {
    const existsIdx = cart.items.findIndex(
      (i) => i.productUnitId === newUnitId,
    );
    const currIdx = cart.items.findIndex(
      (i) => i.productUnitId === productUnitIdCurrent,
    );
    if (currIdx < 0) return;

    const curr = cart.items[currIdx];

    // eslint-disable-next-line prefer-const
    let nextItems = [...cart.items];
    if (existsIdx >= 0 && existsIdx !== currIdx) {
      // gộp vào dòng đã tồn tại cùng đơn vị mới
      nextItems[existsIdx] = {
        ...nextItems[existsIdx],
        quantity: nextItems[existsIdx].quantity + curr.quantity,
      };
      nextItems.splice(currIdx, 1);
    } else {
      // cập nhật đơn vị ngay trên dòng hiện tại
      nextItems[currIdx] = {
        ...curr,
        key: String(newUnitId),
        productUnitId: newUnitId,
        unitName: newUnitName,
      };
    }

    onCartChange({ ...cart, items: nextItems });
  };

  const columns: ColumnsType<CartItem> = [
    {
      title: 'Sản phẩm',
      dataIndex: 'productName',
      key: 'name',
      render: (_: any, r) => {
        const unitOptions =
          (unitsByProductId[r.productId] ?? []).map((u) => ({
            value: u.id,
            label: u.unitName,
          })) || [];

        return (
          <Space direction="vertical" size={0}>
            <Text strong>{r.productName}</Text>
            {/* Select đổi đơn vị */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Đơn vị:
              </Text>
              <Select
                size="small"
                style={{ minWidth: 120 }}
                value={r.productUnitId}
                onChange={(val, option: any) =>
                  changeUnitForItem(
                    r.productUnitId,
                    r.productId,
                    Number(val),
                    option?.label ?? '',
                  )
                }
                options={unitOptions}
              />
            </div>
          </Space>
        );
      },
    },
    {
      title: 'Đơn giá',
      dataIndex: 'unitPrice',
      key: 'price',
      align: 'right' as const,
      render: (_: any, r) => {
        const price = netUnitPriceByPU[r.productUnitId] ?? r.unitPrice ?? 0;
        return (
          <Text>
            {price.toLocaleString('vi-VN', {
              style: 'currency',
              currency: 'VND',
            })}
          </Text>
        );
      },
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'qty',
      align: 'center' as const,
      width: 160,
      render: (_: any, r) => (
        <Flex gap={8} align="center" justify="center">
          <Button size="small" onClick={() => dec(r.productUnitId)}>
            -
          </Button>
          <InputNumber
            value={r.quantity}
            min={0}
            onChange={(v) => changeQty(r.productUnitId, Number(v ?? 0))}
          />
          <Button size="small" onClick={() => inc(r.productUnitId)}>
            +
          </Button>
        </Flex>
      ),
    },
    {
      title: 'Thành tiền',
      key: 'amount',
      align: 'right' as const,
      render: (_: any, r) => {
        const unit = netUnitPriceByPU[r.productUnitId] ?? r.unitPrice ?? 0;
        const amount = unit * r.quantity;
        return (
          <Text strong>
            {amount.toLocaleString('vi-VN', {
              style: 'currency',
              currency: 'VND',
            })}
          </Text>
        );
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 100,
      render: (_: any, r) => (
        <Popconfirm
          title="Xoá sản phẩm khỏi giỏ?"
          onConfirm={() => removeItem(r.productUnitId)}
        >
          <Button danger size="small">
            Xoá
          </Button>
        </Popconfirm>
      ),
    },
  ];

  // --- Helpers hiển thị tiền ---
  const payable = computed.totalPayable || 0;
  const cash = Number.isFinite(amountPaid) ? Number(amountPaid) : 0;
  const shortage = Math.max(0, payable - cash);
  const change = cash > payable ? cash - payable : 0;

  return (
    <>
      <Flex gap={16} align="start" wrap="wrap">
        {/* Bảng giỏ hàng */}
        <div style={{ flex: 1, minWidth: 520 }}>
          <Table
            rowKey={(r) => r.key}
            columns={columns}
            dataSource={cart.items}
            size="small"
            pagination={false}
            locale={{ emptyText: 'Chưa có sản phẩm' }}
          />

          {/* Khuyến mãi áp dụng */}
          {isLoadingPromotion ? (
            <div style={{ padding: 12, opacity: 0.7 }}>
              Đang áp dụng khuyến mãi…
            </div>
          ) : promotionData?.data ? (
            <div
              style={{
                padding: 12,
                background: '#fafafa',
                borderTop: '1px dashed #eee',
              }}
            >
              <Divider orientation="left">Khuyến mãi áp dụng</Divider>

              {(promotionData.data.items ?? [])
                .filter((li) => li.promotionApplied !== null)
                .map((li) => (
                  <Flex
                    key={li.lineItemId}
                    justify="space-between"
                    style={{ marginBottom: 6 }}
                  >
                    <div>
                      <Text>
                        {li.productName} ({li.unit}) × {li.quantity}
                      </Text>
                      <div style={{ fontSize: 12, color: '#1677ff' }}>
                        {li.promotionApplied?.promotionSummary}
                      </div>
                    </div>

                    <Text strong>
                      {Number(li.lineTotal ?? 0).toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      })}
                    </Text>
                  </Flex>
                ))}

              {(promotionData.data.appliedOrderPromotions ?? []).length > 0 && (
                <>
                  <Divider style={{ margin: '8px 0' }} />
                  <div style={{ fontSize: 12 }}>
                    {promotionData.data.appliedOrderPromotions.map((p) => (
                      <Tag key={p.promotionDetailId} color="green">
                        {p.promotionSummary}
                      </Tag>
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : null}
        </div>

        {/* Panel tổng tiền + khách hàng */}
        <div style={{ width: 320, maxWidth: '100%' }}>
          <div
            style={{
              padding: 12,
              border: '1px solid #eee',
              borderRadius: 8,
              background: '#fff',
            }}
          >
            {/* Chọn khách hàng */}
            <Divider orientation="left">
              <Text strong style={{ fontSize: 16 }}>
                Khách hàng
              </Text>
            </Divider>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Select
                showSearch
                allowClear
                placeholder="Tìm khách hàng (tên / SĐT / mã)"
                value={selectedCustomerId ?? undefined}
                filterOption={false}
                onSearch={setCustomerSearch}
                onChange={(val) => setSelectedCustomerId(val ?? (null as any))}
                options={customerOptions}
                notFoundContent={
                  customerSearch ? 'Không có kết quả' : 'Nhập để tìm kiếm'
                }
              />
              {selectedCustomerLabel ? (
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Đang chọn: {selectedCustomerLabel}
                </Text>
              ) : (
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Chưa chọn khách hàng
                </Text>
              )}
            </Space>

            <Divider orientation="left">
              <Text strong style={{ fontSize: 20 }}>
                Tổng tiền hàng ({cart.items.length} sản phẩm)
              </Text>
            </Divider>

            <Space direction="vertical" style={{ width: '100%' }}>
              <Flex justify="space-between">
                <Text style={{ fontSize: 18 }}>Tạm tính</Text>
                <Text strong style={{ fontSize: 18 }}>
                  {computed.subTotal.toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  })}
                </Text>
              </Flex>

              <Flex justify="space-between">
                <Text style={{ fontSize: 18 }}>Giảm giá</Text>
                <Text style={{ fontSize: 18 }}>
                  -
                  {(
                    computed.lineItemDiscount + (computed?.orderDiscount ?? 0)
                  ).toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  })}
                </Text>
              </Flex>

              <Divider style={{ margin: '8px 0' }} />

              <Statistic
                title={<Text strong>Khách phải trả</Text>}
                value={computed.totalPayable}
                precision={0}
                formatter={(v) =>
                  Number(v).toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  })
                }
              />

              <Button
                type="primary"
                size="large"
                block
                disabled={cart.items.length === 0}
                onClick={() => setPayOpen(true)}
              >
                Thanh toán
              </Button>
            </Space>
          </div>
        </div>
      </Flex>

      {/* Modal chọn phương thức thanh toán */}
      <Modal
        title="Thanh toán"
        open={payOpen}
        cancelText="Huỷ"
        onCancel={() => setPayOpen(false)}
        onOk={handleCreateOrder}
        confirmLoading={isCreatingOrder}
        okText="Hoàn tất"
        okButtonProps={{
          disabled: paymentMethod === 'CASH' && cash < payable,
        }}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Radio.Group
            size="large"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <Radio.Button value="CASH">Tiền mặt</Radio.Button>
            <Radio.Button value="ONLINE">Chuyển khoản</Radio.Button>
          </Radio.Group>

          {paymentMethod === 'CASH' && (
            <>
              <Flex align="center" justify="space-between">
                <Text style={{ fontSize: 20 }}>Tiền khách đưa</Text>
                <InputNumber
                  style={{ width: 200 }}
                  min={0}
                  value={amountPaid}
                  formatter={(v) =>
                    v === undefined ? '0' : Number(v).toLocaleString('vi-VN')
                  }
                  parser={(v) =>
                    Number((v || '0').toString().replace(/[^0-9.-]+/g, ''))
                  }
                  onChange={(v) => setAmountPaid(Number(v ?? 0))}
                />
              </Flex>

              {cash < payable && (
                <Flex
                  justify="space-between"
                  style={{ width: '100%', marginTop: 30 }}
                >
                  <Text type="danger" style={{ fontSize: 20 }}>
                    Khách phải đưa thêm
                  </Text>
                  <Text strong style={{ fontSize: 20 }}>
                    {shortage.toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    })}
                  </Text>
                </Flex>
              )}

              {cash > payable && (
                <Flex
                  justify="space-between"
                  style={{ width: '100%', marginTop: 30 }}
                >
                  <Text type="success" style={{ fontSize: 20 }}>
                    Thối lại khách
                  </Text>
                  <Text strong style={{ fontSize: 20 }}>
                    {change.toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    })}
                  </Text>
                </Flex>
              )}
            </>
          )}

          <Divider />
          <Flex justify="space-between">
            <Text style={{ fontSize: 20 }}>Khách phải trả</Text>
            <Text style={{ fontSize: 20 }} strong>
              {payable.toLocaleString('vi-VN', {
                style: 'currency',
                currency: 'VND',
              })}
            </Text>
          </Flex>

          <div style={{ marginTop: 8 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {selectedCustomerLabel
                ? `Khách hàng: ${selectedCustomerLabel}`
                : 'Chưa chọn khách hàng'}
            </Text>
          </div>
        </Space>
      </Modal>

      {/* Modal QR */}
      <Modal
        title="Quét QR để thanh toán"
        open={qrVisible}
        cancelText="Hủy"
        onCancel={() => setQrVisible(false)}
        footer={null}
        destroyOnClose
      >
        {qrCodeValue ? (
          <div style={{ textAlign: 'center' }}>
            <img
              alt="qr"
              style={{ width: 260, height: 260 }}
              src={`https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
                qrCodeValue,
              )}`}
            />
            {paymentUrl && (
              <div style={{ marginTop: 8 }}>
                <a href={paymentUrl} target="_blank" rel="noreferrer">
                  Mở cổng thanh toán
                </a>
              </div>
            )}
            <div style={{ marginTop: 8, fontSize: 12, color: '#888' }}>
              Đang chờ thanh toán... Hệ thống sẽ tự động xác nhận.
            </div>
          </div>
        ) : (
          <Text>Không có mã QR</Text>
        )}
      </Modal>
    </>
  );
};

/**
 * ---------- Trang chính: Tabs nhiều đơn ----------
 */
const SaleContainer: React.FC = () => {
  const { message } = App.useApp();

  // Tìm kiếm sản phẩm (chỉ hiện sản phẩm gốc)
  const [searchTerm, setSearchTerm] = useState<string>('');
  const searchDebounced = useDebounce(searchTerm);
  const { data: productData, isLoading: isLoadingProduct } = useProductList({
    searchTerm: searchDebounced,
    hasPrice: true,
    hasStock: true,
  }) as unknown as { data?: ProductListResponse; isLoading: boolean };

  // Quản lý nhiều đơn
  const [carts, setCarts] = useState<CartState[]>([
    { id: '1', name: 'Đơn 1', items: [] },
    { id: '2', name: 'Đơn 2', items: [] },
  ]);
  const [activeKey, setActiveKey] = useState<string>('1');

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [summaries, setSummaries] = useState<Record<string, CartSummary>>({});
  console.log(summaries);
  const setCart = (id: string, updater: (curr: CartState) => CartState) => {
    setCarts((prev) => prev.map((c) => (c.id === id ? updater(c) : c)));
  };

  // Map productId -> units (để render Select đổi đơn vị trong giỏ)
  const unitsByProductId = useMemo(() => {
    const products = productData?.data?.products ?? [];
    const map: Record<number, ProductUnit[]> = {};
    products.forEach((p) => {
      map[p.id] = [...(p.units ?? [])];
    });
    return map;
  }, [productData]);

  // Options sản phẩm (không liệt kê đơn vị)
  const productOptions = useMemo(() => {
    const products = productData?.data?.products ?? [];
    return products.map((p) => {
      const units = p.units ?? [];
      const base = units.find((u) => u.isBaseUnit) || units[0];
      return {
        value: p.id,
        label: p.name,
        meta: {
          productId: p.id,
          productName: p.name,
          defaultUnitId: base?.id,
          defaultUnitName: base?.unitName,
        },
      };
    });
  }, [productData]);

  // Khi chọn sản phẩm: tự động thêm với đơn vị mặc định
  const onSelectProduct = (meta: {
    productId: number;
    productName: string;
    defaultUnitId?: number;
    defaultUnitName?: string;
  }) => {
    const unitId =
      meta.defaultUnitId ?? unitsByProductId[meta.productId]?.[0]?.id;
    const unitName =
      meta.defaultUnitName ??
      unitsByProductId[meta.productId]?.[0]?.unitName ??
      '';

    if (!unitId) {
      message?.warning('Sản phẩm chưa có đơn vị bán.');
      return;
    }

    setCart(activeKey, (c) => {
      // nếu đã có dòng với đúng productUnitId => +1
      const idx = c.items.findIndex((i) => i.productUnitId === unitId);
      if (idx >= 0) {
        const next = [...c.items];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
        return { ...c, items: next };
      }
      const newItem: CartItem = {
        key: String(unitId),
        productId: meta.productId,
        productUnitId: unitId,
        productName: meta.productName,
        unitName,
        unitPrice: 0,
        quantity: 1,
      };
      return { ...c, items: [...c.items, newItem] };
    });

    setSearchTerm('');
  };

  // Tabs: thêm / xoá
  const addTab = () => {
    const maxIndex = carts.reduce((max, c) => {
      const parts = c.name.split(' ');
      const n = parseInt(parts[parts.length - 1], 10) || 0;
      return Math.max(max, n);
    }, 0);
    const nextIndex = maxIndex + 1;
    const id = String(Date.now());
    setCarts((prev) => [...prev, { id, name: `Đơn ${nextIndex}`, items: [] }]);
    setActiveKey(id);
  };

  const removeTab = (targetKey: string) => {
    if (carts.length <= 1) {
      message?.warning('Phải còn ít nhất 1 đơn.');
      return;
    }
    let newActiveKey = activeKey;
    let lastIndex = -1;
    carts.forEach((c, i) => {
      if (c.id === targetKey) lastIndex = i - 1;
    });
    const newCarts = carts.filter((c) => c.id !== targetKey);
    if (newCarts.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) newActiveKey = newCarts[lastIndex].id;
      else newActiveKey = newCarts[0].id;
    }
    setCarts(newCarts);
    setActiveKey(newActiveKey);
  };

  const renderTabLabel = (c: CartState) => {
    return <span>{c.name}</span>;
  };

  return (
    <div style={{ padding: 16 }}>
      <Space direction="vertical" style={{ width: '100%' }} size={12}>
        {/* Tìm kiếm theo sản phẩm (không liệt kê đơn vị) */}
        <Select
          showSearch
          value={undefined}
          placeholder="Tìm kiếm nhanh sản phẩm"
          style={{ width: '40%' }}
          filterOption={false}
          onSearch={setSearchTerm}
          onSelect={(_val, option: any) => onSelectProduct(option.meta)}
          options={productOptions}
          loading={isLoadingProduct}
          notFoundContent={searchTerm ? 'Không có kết quả' : 'Nhập để tìm kiếm'}
        />

        <div
          style={{
            border: '1px solid #eee',
            borderRadius: 8,
            padding: 8,
            background: '#fff',
          }}
        >
          <Tabs
            type="editable-card"
            onEdit={(targetKey, action) => {
              if (action === 'add') addTab();
              else if (action === 'remove') removeTab(String(targetKey));
            }}
            activeKey={activeKey}
            onChange={setActiveKey}
            items={carts.map((c) => ({
              key: c.id,
              label: renderTabLabel(c),
              children: (
                <CartTab
                  cart={c}
                  onCartChange={(next) => setCart(c.id, () => next)}
                  onSummaryChange={(sum) =>
                    setSummaries((prev) => ({ ...prev, [c.id]: sum }))
                  }
                  onCloseCurrent={() => removeTab(c.id)}
                  unitsByProductId={unitsByProductId}
                />
              ),
              closable: true,
            }))}
          />
        </div>
      </Space>
    </div>
  );
};

export { SaleContainer };
