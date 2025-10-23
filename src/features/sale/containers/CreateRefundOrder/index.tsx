import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  refundKeys,
  // useOrderByInvoiceId,  // ⛔️ replaced
  useRefundCalculate,
  useRefundCreate,
  useRefundCheckQuantity, // ✅ new
} from '@/features/sale';
import { Alert, Card, Empty, List, Skeleton, Space, Tag } from 'antd';
import {
  MinusOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import {
  Button,
  Divider,
  InputNumber,
  Text,
  TextArea,
  Title,
  useDebounce,
  useNotification,
} from '@/lib';
import { queryClient } from '@/providers/ReactQuery';
import { ROUTE_PATH } from '@/common';

type TRefundCheckLine = {
  lineItemId: number;
  productName: string;
  unitName: string;
  originalQuantity: number;
  returnedQuantity: number;
  availableQuantity: number;
  unitPrice: number;
  priceAfterDiscount: number;
  isFullyReturned: boolean;
};

type TRefundCheckData = {
  invoiceId: number;
  invoiceNumber: string;
  invoiceDate: string;
  customerName: string | null;
  customerPhone: string | null;
  lineItems: TRefundCheckLine[];
  totalOriginalQuantity: number;
  totalReturnedQuantity: number;
  totalAvailableQuantity: number;
};

// ===== Calculate API types (existing) =====

type TRefundLineItem = { lineItemId: number; quantity: number };

type TRefundCalcLine = {
  lineItemId: number;
  quantity: number;
  price: number;
  subtotal: number;
  originalPrice: number;
  discountedPrice: number;
  discountedSubtotal: number;
  maximumRefundableQuantity: number;
  totalCartDiscountAmount: number;
};

type TRefundCalcData = {
  maximumRefundable: number;
  refundLineItems: TRefundCalcLine[];
  transaction: { invoiceId: number; amount: number; maximumRefundable: number };
};

const currency = (v?: number) =>
  (v ?? 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

type TLocalRow = {
  invoiceDetailId: number; // alias of lineItemId for compatibility with existing code paths
  productName: string;
  unit: string;
  refundQty: number;
  maxQty: number; // availableQuantity
  unitPrice?: number;
  priceAfterDiscount?: number;
};

const CreateRefundOrderContainer: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  // -------- Fetch refundable quantities by invoice
  const { data: refundCheckResp, isLoading: isLoadingRefundCheck } =
    useRefundCheckQuantity({
      invoiceId: Number(orderId),
    });

  const invoice: TRefundCheckData | undefined = refundCheckResp?.data;

  // -------- Local rows derived from refundable line items
  const [rows, setRows] = useState<TLocalRow[]>([]);
  const [reasonNote, setReasonNote] = useState<string>('');
  const reasonDebounce = useDebounce(reasonNote);
  const { notify } = useNotification();

  useEffect(() => {
    if (!invoice?.lineItems) return;
    setRows(
      invoice.lineItems.map((it) => ({
        invoiceDetailId: it.lineItemId,
        productName: it.productName,
        unit: it.unitName,
        refundQty: 0,
        maxQty: it.availableQuantity,
        unitPrice: it.unitPrice,
        priceAfterDiscount: it.priceAfterDiscount,
      })),
    );
  }, [invoice?.lineItems]);

  // Flag: all items fully returned (availableQuantity = 0 for all)
  const allFullyReturned =
    invoice?.lineItems?.every((li) => li.availableQuantity === 0) || false;

  // -------- Build payload for calculate API from editable rows
  const refundLineItems: TRefundLineItem[] = useMemo(
    () =>
      rows
        .filter((r) => r.refundQty > 0)
        .map((r) => ({ lineItemId: r.invoiceDetailId, quantity: r.refundQty })),
    [rows],
  );

  // -------- Call calculate API every time refundLineItems change
  const {
    data: refundCalcResp,
    isPending: isCalculating,
    error: calcError,
  } = useRefundCalculate({
    invoiceId: Number(orderId),
    reasonNote: reasonDebounce || '',
    refundLineItems,
  });

  const refundCalc: TRefundCalcData | undefined = refundCalcResp?.data;

  // Map for quick lookup in UI
  const calcMap = useMemo(() => {
    const map = new Map<number, TRefundCalcLine>();
    refundCalc?.refundLineItems?.forEach((li) => map.set(li.lineItemId, li));
    return map;
  }, [refundCalc]);

  // -------- Handlers
  const updateQty = (id: number, qty: number) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.invoiceDetailId !== id) return r;
        const next = Math.max(0, Math.min(r.maxQty, Math.trunc(qty || 0)));
        return { ...r, refundQty: next };
      }),
    );
  };

  const changeStep = (id: number, delta: number) => {
    const row = rows.find((r) => r.invoiceDetailId === id);
    if (!row) return;
    updateQty(id, row.refundQty + delta);
  };

  const totalSelectedQty = useMemo(
    () => rows.reduce((s, r) => s + r.refundQty, 0),
    [rows],
  );

  const canSubmit = totalSelectedQty > 0 && !isCalculating && !allFullyReturned;

  // -------- Create refund
  const { mutate: createRefund, isPending: isCreating } = useRefundCreate();

  const onCreateRefund = () => {
    if (!canSubmit || !invoice) return;
    const payload = {
      invoiceId: invoice.invoiceId,
      refundLineItems,
      reasonNote: reasonNote?.trim() || undefined,
    };
    createRefund(payload as any, {
      onSuccess: () => {
        notify('success', {
          message: 'Thành công',
          description: 'Tạo đơn trả hàng thành công',
        });

        queryClient.invalidateQueries({
          queryKey: refundKeys.all,
        });

        navigate(ROUTE_PATH.SALE.REFUND.PATH());
      },
      onError: (e: any) => {
        notify('error', {
          message: 'Thất bại',
          description: e?.message || 'Tạo đơn hoàn trả thất bại',
        });
      },
    });
  };

  // -------- UI
  return (
    <div className="p-4">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 360px',
          gap: 16,
        }}
      >
        <Card>
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Title level={4} style={{ margin: 0 }}>
              Chọn sản phẩm trả hàng
            </Title>

            {isLoadingRefundCheck ? (
              <Skeleton active />
            ) : !invoice?.lineItems?.length ? (
              <Empty description="Không tìm thấy sản phẩm trong hoá đơn" />
            ) : allFullyReturned ? (
              <Alert
                type="info"
                showIcon
                message="Tất cả sản phẩm trong đơn hàng đã được hoàn trả"
              />
            ) : (
              <List
                dataSource={rows}
                renderItem={(item) => {
                  const calc = calcMap.get(item.invoiceDetailId);
                  return (
                    <List.Item key={item.invoiceDetailId}>
                      <Space
                        style={{ width: '100%', alignItems: 'flex-start' }}
                        size="large"
                      >
                        <div style={{ flex: 1, minWidth: 260 }}>
                          <Space direction="vertical" size={2}>
                            <Text strong>{item.productName}</Text>
                            <Space size="small">
                              <Tag>{item.unit}</Tag>
                              <Text type="secondary">
                                SL có thể hoàn: {item.maxQty}
                              </Text>
                            </Space>
                          </Space>
                        </div>

                        <Space align="center">
                          <Button
                            size="small"
                            icon={<MinusOutlined />}
                            onClick={() => changeStep(item.invoiceDetailId, -1)}
                            disabled={item.refundQty <= 0}
                          />
                          <InputNumber
                            size="middle"
                            min={0}
                            max={item.maxQty}
                            value={item.refundQty}
                            onChange={(v) =>
                              updateQty(item.invoiceDetailId, Number(v))
                            }
                          />
                          <Button
                            size="small"
                            icon={<PlusOutlined />}
                            onClick={() => changeStep(item.invoiceDetailId, 1)}
                            disabled={item.refundQty >= item.maxQty}
                          />
                          <Text type="secondary">/ {item.maxQty}</Text>
                        </Space>

                        <div style={{ minWidth: 160, textAlign: 'right' }}>
                          <Space direction="vertical" align="end" size={0}>
                            <Text>Hoàn: {currency(calc?.subtotal)}</Text>
                            {typeof calc?.maximumRefundableQuantity ===
                              'number' && (
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                Tối đa: {calc?.maximumRefundableQuantity}
                              </Text>
                            )}
                          </Space>
                        </div>
                      </Space>
                    </List.Item>
                  );
                }}
              />
            )}

            <div>
              <Text strong>Ghi chú</Text>
              <TextArea
                placeholder="Lý do/ghi chú hoàn hàng..."
                autoSize={{ minRows: 3, maxRows: 6 }}
                value={reasonNote}
                onChange={(e) => setReasonNote(e.target.value)}
              />
              <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
                <ExclamationCircleOutlined /> Chỉ bạn và nhân viên trong cửa
                hàng có thể nhìn thấy lý do này
              </Text>
            </div>
          </Space>
        </Card>

        <Card title="Hoàn tiền">
          {/* Nếu cần cảnh báo trạng thái thanh toán, thêm lại khi API cung cấp */}
          {!!refundCalc?.maximumRefundable && (
            <Text type="secondary">
              Có thể hoàn trả tối đa {currency(refundCalc?.maximumRefundable)}
            </Text>
          )}

          <Divider />

          <Space
            direction="vertical"
            size="middle"
            style={{ width: '100%', marginBottom: 8 }}
          >
            <div>
              <Text type="secondary">Số tiền sẽ hoàn</Text>
              <Title level={2} style={{ margin: 0 }}>
                {currency(refundCalc?.transaction?.amount)}
              </Title>
            </div>

            {calcError && (
              <Alert
                type="error"
                showIcon
                message={(calcError as any)?.message || 'Lỗi tính toán'}
              />
            )}
          </Space>

          <Button
            type="primary"
            block
            size="large"
            disabled={!canSubmit}
            loading={isCreating}
            onClick={onCreateRefund}
          >
            Tạo đơn hoàn trả
          </Button>
        </Card>
      </div>
    </div>
  );
};

export { CreateRefundOrderContainer };
