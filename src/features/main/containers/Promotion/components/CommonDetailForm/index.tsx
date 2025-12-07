import { useMemo } from 'react';
import type { FormInstance } from 'antd';
import {
  Card,
  Form,
  InputNumber,
  Radio,
  Row,
  Col,
  Space,
  Select,
  Spin,
  Empty,
} from 'antd';
import { useHook } from './hook';
import { EPromotionType, Input } from '@/lib';

const currencyParser = (v?: string) =>
  v ? Number(String(v).replace(/[.,\s]/g, '')) : 0;

/* —— product & category selects reused —— */
function ProductUnitSelect({
  productData,
  loading,
  value,
  onChange,
  onSearch,
  multiple,
}: any) {
  const options = useMemo(() => {
    const products = productData?.data?.products ?? [];
    return products.flatMap((p: any) =>
      (p.units ?? []).map((u: any) => {
        const tail = u.barcode
          ? ` (${u.barcode})`
          : u.code
            ? ` (${u.code})`
            : '';
        return {
          label: `${p.name} – ${u.unitName}${tail}`,
          value: u.id,
          _kw: `${p.name} ${u.unitName} ${u.barcode ?? ''} ${u.code ?? ''}`.toLowerCase(),
        };
      }),
    );
  }, [productData]);

  return (
    <Select
      showSearch
      mode={multiple ? 'multiple' : undefined}
      options={options}
      placeholder="Tìm theo tên SP / đơn vị / barcode / code…"
      value={value as any}
      onChange={onChange}
      onSearch={onSearch}
      filterOption={(input: string, opt: any) => {
        const t = opt?._kw ?? opt?.label?.toLowerCase?.();
        return t?.includes?.(input.toLowerCase());
      }}
      notFoundContent={loading ? <Spin size="small" /> : <Empty />}
      style={{ width: '100%' }}
    />
  );
}

export default function PromotionDetailCreateForm({
  handleSubmit,
  form,
  promotionType,
  isUpdate = false,
}: {
  handleSubmit?: (v: any) => Promise<void>;
  form: FormInstance;
  promotionType: EPromotionType;
  isUpdate?: boolean;
}) {
  const { rules, onFinish, productData, isLoadingProduct, setSearch } =
    useHook(handleSubmit);
  const buyConditionType = Form.useWatch(['detail', '_buyMinConditionType'], form);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        detail: {
          // meta
          usageLimit: 1,

          // BUY_X_GET_Y
          buyProductId: 0,
          buyMinQuantity: 1,
          buyMinValue: 0.01,
          giftProductId: 0,
          giftQuantity: 1,
          giftDiscountType: 'PERCENTAGE',
          giftDiscountValue: 0,
          giftMaxQuantity: 1,

          // ORDER_DISCOUNT
          orderDiscountType: 'PERCENTAGE',
          orderDiscountValue: 0.01,
          orderDiscountMaxValue: 0.01,
          orderMinTotalValue: 0.01,
          orderMinTotalQuantity: 1,

          // PRODUCT_DISCOUNT (không Category)
          productDiscountType: 'PERCENTAGE',
          productDiscountValue: 0.01,
          applyToType: 'ALL',
          applyToProductId: 0,
          productMinOrderValue: 0.01,
          productMinPromotionValue: 0.01,
          productMinPromotionQuantity: 1,

          // UI-only keys
          _buyMinConditionType: 'QUANTITY',
          _orderConditionType: 'NONE',
          _productConditionType: 'NONE',
        },
      }}
    >
      {/* Thông tin mã & usage */}
      <Card title="Thông tin áp dụng" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item
              label="Mã khuyến mãi"
              name={['detail', 'promotionCode']}
              rules={[rules, { required: true, message: 'Nhập mã khuyến mãi' }]}
            >
              <Input placeholder="Nhập mã khuyến mãi" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              label="Giới hạn sử dụng"
              name={['detail', 'usageLimit']}
              rules={[rules]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* BUY_X_GET_Y */}
      {promotionType === EPromotionType.BUY_X_GET_Y && (
        <Card title="Mua X tặng Y" style={{ marginBottom: 16 }}>
          {/* Điều kiện mua (radio chọn SL hoặc Giá trị) */}
          <Form.Item
            label="Điều kiện mua"
            name={['detail', '_buyMinConditionType']}
            rules={[rules, { required: true, message: 'Chọn điều kiện mua' }]}
            style={{ marginBottom: 16 }}
          >
            <Radio.Group>
              <Space direction="vertical">
                {isUpdate ? (
                  (() => {
                    const current = form.getFieldValue([
                      'detail',
                      '_buyMinConditionType',
                    ]);
                    const map: Record<string, string> = {
                      QUANTITY: 'SL mua tối thiểu',
                      VALUE: 'Giá trị mua tối thiểu',
                    };
                    return <Radio value={current}>{map[current]}</Radio>;
                  })()
                ) : (
                  <>
                    <Radio value="QUANTITY">SL mua tối thiểu</Radio>
                    <Radio value="VALUE">Giá trị mua tối thiểu</Radio>
                  </>
                )}
              </Space>
            </Radio.Group>
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Sản phẩm mua"
                name={['detail', 'buyProductId']}
                rules={[
                  rules,
                  { required: true, message: 'Chọn sản phẩm mua' },
                ]}
              >
                <ProductUnitSelect
                  productData={productData}
                  loading={isLoadingProduct}
                  onSearch={setSearch}
                />
              </Form.Item>
            </Col>
            <Form.Item noStyle shouldUpdate>
              {() => {
                const condType = form.getFieldValue([
                  'detail',
                  '_buyMinConditionType',
                ]);
                if (condType !== 'QUANTITY') return null;
                return (
                  <Col xs={24} md={6}>
                    <Form.Item
                      label="SL mua tối thiểu"
                      name={['detail', 'buyMinQuantity']}
                      rules={[rules]}
                    >
                      <InputNumber min={1} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                );
              }}
            </Form.Item>
            <Form.Item noStyle shouldUpdate>
              {() => {
                const condType = buyConditionType;
                if (condType !== 'VALUE') return null;
                return (
                  <Col xs={24} md={6}>
                    <Form.Item
                      label="Giá trị mua tối thiểu"
                      name={['detail', 'buyMinValue']}
                      rules={[rules]}
                    >
                      <InputNumber
                        min={0}
                        style={{ width: '100%' }}
                        addonAfter="đ"
                        parser={currencyParser}
                      />
                    </Form.Item>
                  </Col>
                );
              }}
            </Form.Item>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Sản phẩm tặng"
                name={['detail', 'giftProductId']}
                rules={[
                  rules,
                  { required: true, message: 'Chọn sản phẩm tặng' },
                ]}
              >
                <ProductUnitSelect
                  productData={productData}
                  loading={isLoadingProduct}
                  onSearch={setSearch}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Số lượng tặng"
                name={['detail', 'giftQuantity']}
                rules={[rules]}
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Số lần tặng tối đa"
                name={['detail', 'giftMaxQuantity']}
                rules={[
                  rules,
                  { required: true, message: 'Nhập số lần' },
                  {
                    validator: (_: any, v: number) =>
                      v && v >= 1
                        ? Promise.resolve()
                        : Promise.reject('Số lần phải ≥ 1'),
                  },
                ]}
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label="Ưu đãi cho quà"
            name={['detail', 'giftDiscountType']}
          >
            <Radio.Group>
              <Space direction="vertical">
                {isUpdate ? (
                  (() => {
                    const current = form.getFieldValue([
                      'detail',
                      'giftDiscountType',
                    ]);
                    const map: Record<string, string> = {
                      FREE: 'Miễn phí (FREE)',
                      PERCENTAGE: '%',
                      FIXED_AMOUNT: 'Số tiền',
                    };
                    return <Radio value={current}>{map[current]}</Radio>;
                  })()
                ) : (
                  <>
                    <Radio value="FREE">Miễn phí (FREE)</Radio>
                    <Radio value="PERCENTAGE">%</Radio>
                    <Radio value="FIXED_AMOUNT">Số tiền</Radio>
                  </>
                )}
              </Space>
            </Radio.Group>
          </Form.Item>

          <Form.Item noStyle shouldUpdate>
            {() => {
              const t = form.getFieldValue(['detail', 'giftDiscountType']);
              if (t === 'FREE') return null;
              const isPercent = t === 'PERCENTAGE';
              return (
                <Form.Item
                  label="Giá trị"
                  name={['detail', 'giftDiscountValue']}
                  rules={[
                    rules,
                    { required: true, message: 'Nhập giá trị' },
                    {
                      validator: (_: any, v: number) =>
                        v && v > 0
                          ? Promise.resolve()
                          : Promise.reject('Giá trị phải > 0'),
                    },
                  ]}
                >
                  <InputNumber
                    min={1}
                    style={{ width: 260 }}
                    parser={currencyParser}
                    addonAfter={isPercent ? '%' : 'đ'}
                  />
                </Form.Item>
              );
            }}
          </Form.Item>
        </Card>
      )}
      {/* ORDER_DISCOUNT */}
      {promotionType === EPromotionType.ORDER_DISCOUNT && (
        <Card title="Giảm giá đơn hàng" style={{ marginBottom: 16 }}>
          <Form.Item
            label="Hình thức giảm (đơn hàng)"
            name={['detail', 'orderDiscountType']}
            rules={[rules, { required: true, message: 'Chọn hình thức giảm' }]}
          >
            <Radio.Group>
              <Space direction="vertical">
                {isUpdate ? (
                  (() => {
                    const current = form.getFieldValue([
                      'detail',
                      'orderDiscountType',
                    ]);
                    const map: Record<string, string> = {
                      FIXED_AMOUNT: 'Số tiền',
                      PERCENTAGE: '%',
                    };
                    return <Radio value={current}>{map[current]}</Radio>;
                  })()
                ) : (
                  <>
                    <Radio value="FIXED_AMOUNT">Số tiền</Radio>
                    <Radio value="PERCENTAGE">%</Radio>
                  </>
                )}
              </Space>
            </Radio.Group>
          </Form.Item>
          <Form.Item noStyle shouldUpdate>
            {() => {
              const t = form.getFieldValue(['detail', 'orderDiscountType']);
              const isPercent = t === 'PERCENTAGE';
              return (
                <Form.Item
                  label="Giá trị giảm"
                  name={['detail', 'orderDiscountValue']}
                  rules={[
                    { required: true, message: 'Nhập giá trị giảm' },
                    // Nếu là %, kiểm tra 0 < value <= 100 (nếu bạn muốn chặt chẽ hơn)
                    () => ({
                      validator: (_: any, v: number) => {
                        if (!isPercent) return Promise.resolve();
                        if (v === undefined || v === null)
                          return Promise.resolve();
                        return v > 0 && v <= 100
                          ? Promise.resolve()
                          : Promise.reject('Phần trăm phải trong (0, 100]');
                      },
                    }),
                  ]}
                >
                  <InputNumber
                    min={0}
                    style={{ width: '100%' }}
                    parser={(v?: string) =>
                      v ? Number(String(v).replace(/[.,\s]/g, '')) : 0
                    }
                    addonAfter={isPercent ? '%' : 'đ'}
                  />
                </Form.Item>
              );
            }}
          </Form.Item>
          <Form.Item
            label="Mức giảm tối đa"
            name={['detail', 'orderDiscountMaxValue']}
            rules={[rules]}
          >
            <InputNumber
              min={0}
              style={{ width: 260 }}
              parser={currencyParser}
              addonAfter="đ"
            />
          </Form.Item>
          <Form.Item
            label="Tổng giá trị đơn hàng tối thiểu"
            name={['detail', 'orderMinTotalValue']}
            rules={[rules]}
          >
            <InputNumber
              min={0}
              style={{ width: 260 }}
              parser={currencyParser}
              addonAfter="đ"
            />
          </Form.Item>
          <Form.Item
            label="Tổng SL SP KM tối thiểu"
            name={['detail', 'orderMinTotalQuantity']}
            rules={[rules]}
          >
            <InputNumber min={0} style={{ width: 260 }} />
          </Form.Item>
        </Card>
      )}
      {/* PRODUCT_DISCOUNT */}
      {promotionType === EPromotionType.PRODUCT_DISCOUNT && (
        <Card title="Giảm giá sản phẩm" style={{ marginBottom: 16 }}>
          {/* dùng 1 biến gutter dùng chung để dễ chỉnh */}
          {(() => {
            const GUTTER: [number, number] = [24, 16];

            return (
              <>
                {/* Hàng 1: Hình thức giảm  ↔  Giá trị giảm */}
                <Row gutter={GUTTER}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Hình thức giảm (sản phẩm)"
                      name={['detail', 'productDiscountType']}
                      rules={[
                        rules,
                        { required: true, message: 'Chọn hình thức giảm' },
                      ]}
                      style={{ marginBottom: 12 }}
                    >
                      <Radio.Group>
                        <Space direction="vertical" size="small">
                          {isUpdate ? (
                            (() => {
                              const current = form.getFieldValue([
                                'detail',
                                'productDiscountType',
                              ]);
                              const map: Record<string, string> = {
                                FIXED_AMOUNT: 'Số tiền',
                                PERCENTAGE: '%',
                              };
                              return (
                                <Radio value={current}>{map[current]}</Radio>
                              );
                            })()
                          ) : (
                            <>
                              <Radio value="FIXED_AMOUNT">Số tiền</Radio>
                              <Radio value="PERCENTAGE">%</Radio>
                            </>
                          )}
                        </Space>
                      </Radio.Group>
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item noStyle shouldUpdate>
                      {() => {
                        const t = form.getFieldValue([
                          'detail',
                          'productDiscountType',
                        ]);
                        const isPercent = t === 'PERCENTAGE';
                        return (
                          <Form.Item
                            label="Giá trị giảm"
                            name={['detail', 'productDiscountValue']}
                            rules={[
                              {
                                required: isPercent,
                                message: 'Nhập giá trị giảm',
                              },
                              () => ({
                                validator: (_: any, v: number) => {
                                  if (!isPercent) return Promise.resolve();
                                  if (v === undefined || v === null)
                                    return Promise.resolve();
                                  return v > 0 && v <= 100
                                    ? Promise.resolve()
                                    : Promise.reject(
                                        'Phần trăm phải trong (0, 100]',
                                      );
                                },
                              }),
                            ]}
                          >
                            <InputNumber
                              min={0}
                              style={{ width: '100%' }}
                              parser={(v?: string) =>
                                v ? Number(String(v).replace(/[.,\s]/g, '')) : 0
                              }
                              addonAfter={isPercent ? '%' : 'đ'}
                            />
                          </Form.Item>
                        );
                      }}
                    </Form.Item>
                  </Col>
                </Row>

                {/* Hàng 2: Áp dụng cho  ↔  Selector theo loại */}
                <Row gutter={GUTTER}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Áp dụng cho"
                      name={['detail', 'applyToType']}
                      rules={[
                        rules,
                        { required: true, message: 'Chọn đối tượng áp dụng' },
                      ]}
                    >
                      <Radio.Group>
                        <Space direction="vertical" size="small">
                          <Radio value="ALL">Tất cả sản phẩm</Radio>
                          <Radio value="PRODUCT">Sản phẩm cụ thể</Radio>
                        </Space>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item noStyle shouldUpdate>
                      {() => {
                        const a = form.getFieldValue(['detail', 'applyToType']);
                        if (a === 'PRODUCT') {
                          return (
                            <Form.Item
                              label="Sản phẩm (applyToProductId)"
                              name={['detail', 'applyToProductId']}
                              rules={[
                                rules,
                                {
                                  required: true,
                                  message: 'Chọn sản phẩm áp dụng',
                                },
                              ]}
                            >
                              <ProductUnitSelect
                                productData={productData}
                                loading={isLoadingProduct}
                                onSearch={setSearch}
                              />
                            </Form.Item>
                          );
                        }
                        return <div style={{ minHeight: 36 }} />;
                      }}
                    </Form.Item>
                  </Col>
                </Row>

                {/* Hàng 3: 3 điều kiện tối thiểu cùng hàng, có khoảng cách đều */}
                <Row gutter={GUTTER}>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Tổng giá trị đơn hàng tối thiểu"
                      name={['detail', 'productMinOrderValue']}
                      style={{ marginBottom: 0 }}
                      rules={[rules]}
                    >
                      <InputNumber
                        min={0}
                        style={{ width: '100%' }}
                        parser={(v?: string) =>
                          v ? Number(String(v).replace(/[.,\s]/g, '')) : 0
                        }
                        addonAfter="đ"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Tổng giá trị SP KM tối thiểu"
                      name={['detail', 'productMinPromotionValue']}
                      style={{ marginBottom: 0 }}
                      rules={[rules]}
                    >
                      <InputNumber
                        min={0}
                        style={{ width: '100%' }}
                        parser={(v?: string) =>
                          v ? Number(String(v).replace(/[.,\s]/g, '')) : 0
                        }
                        addonAfter="đ"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Tổng SL SP KM tối thiểu"
                      name={['detail', 'productMinPromotionQuantity']}
                      style={{ marginBottom: 0 }}
                      rules={[rules]}
                    >
                      <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                </Row>
              </>
            );
          })()}
        </Card>
      )}
    </Form>
  );
}
