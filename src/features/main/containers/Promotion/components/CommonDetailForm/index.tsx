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
  TreeSelect,
} from 'antd';
import { useHook } from './hook';
import { EPromotionType } from '@/lib';

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
function CategoryTreeSelect({
  categoriesData,
  loading,
  value,
  onChange,
  placeholder = 'Chọn danh mục…',
}: any) {
  const treeData = useMemo(() => {
    const roots = categoriesData?.data ?? [];
    return roots.map((r: any) => ({
      title: r.name,
      value: r.id,
      children: (r.children ?? [])?.map((c: any) => ({
        title: c.name,
        value: c.id,
      })),
    }));
  }, [categoriesData]);

  return (
    <TreeSelect
      treeData={treeData}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{ width: '100%' }}
      dropdownRender={(menu) =>
        loading ? <Spin style={{ margin: 8 }} /> : menu
      }
    />
  );
}

export default function PromotionDetailCreateForm({
  handleSubmit,
  form,
  promotionType,
}: {
  handleSubmit?: (v: any) => Promise<void>;
  form: FormInstance;
  promotionType: EPromotionType;
}) {
  const {
    rules,
    onFinish,
    productData,
    isLoadingProduct,
    categoriesData,
    isCategoriesLoading,
    setSearch,
  } = useHook(handleSubmit);

  const buyConditionType = Form.useWatch(['detail', '_buyConditionType'], form);
  const applyToType = Form.useWatch(['detail', 'applyToType'], form);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        detail: {
          buyProductId: 0,
          buyCategoryId: 0,
          buyMinQuantity: 1,
          buyMinValue: 0.01,
          giftProductId: 0,
          giftDiscountType: 'PERCENTAGE',
          giftDiscountValue: 0,
          giftMaxQuantity: 1,
          orderDiscountType: 'PERCENTAGE',
          orderDiscountValue: 0.01,
          orderDiscountMaxValue: 0.01,
          orderMinTotalValue: 0.01,
          orderMinTotalQuantity: 1,
          productDiscountType: 'PERCENTAGE',
          productDiscountValue: 0.01,
          applyToType: 'ALL',
          applyToProductId: 0,
          applyToCategoryId: 0,
          productMinOrderValue: 0.01,
          productMinPromotionValue: 0.01,
          productMinPromotionQuantity: 1,
          _buyConditionType: 'PRODUCT_QTY',
          _orderConditionType: 'NONE',
          _productConditionType: 'NONE',
        },
      }}
    >
      {/* BUY_X_GET_Y */}
      {promotionType === EPromotionType.BUY_X_GET_Y && (
        <Card title="Mua X tặng Y" style={{ marginBottom: 16 }}>
          <Form.Item
            label="Loại điều kiện mua"
            name={['detail', '_buyConditionType']}
            rules={[rules, { required: true, message: 'Chọn loại điều kiện' }]}
          >
            <Radio.Group>
              <Space direction="vertical">
                <Radio value="PRODUCT_QTY">Theo sản phẩm & số lượng</Radio>
                <Radio value="CATEGORY_VALUE">Theo danh mục & giá trị</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>

          {buyConditionType === 'PRODUCT_QTY' && (
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
              <Col xs={24} md={12}>
                <Form.Item
                  label="Số lượng mua tối thiểu"
                  name={['detail', 'buyMinQuantity']}
                  rules={[
                    rules,
                    { required: true, message: 'Nhập số lượng' },
                    {
                      validator: (_: any, v: number) =>
                        v && v >= 1
                          ? Promise.resolve()
                          : Promise.reject('Số lượng phải ≥ 1'),
                    },
                  ]}
                >
                  <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
          )}
          {buyConditionType === 'CATEGORY_VALUE' && (
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Danh mục mua"
                  name={['detail', 'buyCategoryId']}
                  rules={[rules, { required: true, message: 'Chọn danh mục' }]}
                >
                  <CategoryTreeSelect
                    categoriesData={categoriesData}
                    loading={isCategoriesLoading}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Giá trị mua tối thiểu"
                  name={['detail', 'buyMinValue']}
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
                    parser={currencyParser}
                    addonAfter="đ"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>
          )}
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
            <Col xs={24} md={12}>
              <Form.Item
                label="Số lượng tặng tối đa"
                name={['detail', 'giftMaxQuantity']}
                rules={[
                  rules,
                  { required: true, message: 'Nhập số lượng' },
                  {
                    validator: (_: any, v: number) =>
                      v && v >= 1
                        ? Promise.resolve()
                        : Promise.reject('Số lượng phải ≥ 1'),
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
            rules={[rules, { required: true, message: 'Chọn hình thức' }]}
          >
            <Radio.Group>
              <Space direction="vertical">
                <Radio value="FREE">Miễn phí (FREE)</Radio>
                <Radio value="PERCENTAGE">%</Radio>
                <Radio value="FIXED_AMOUNT">Số tiền</Radio>
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
                <Radio value="FIXED_AMOUNT">Số tiền</Radio>
                <Radio value="PERCENTAGE">%</Radio>
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
                    ({ getFieldValue }) => ({
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
                          <Radio value="FIXED_AMOUNT">Số tiền</Radio>
                          <Radio value="PERCENTAGE">%</Radio>
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
                              ({ getFieldValue }) => ({
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
                      style={{ marginBottom: 12 }}
                    >
                      <Radio.Group>
                        <Space direction="vertical" size="small">
                          <Radio value="ALL">Tất cả sản phẩm</Radio>
                          <Radio value="PRODUCT">Sản phẩm cụ thể</Radio>
                          <Radio value="CATEGORY">Danh mục cụ thể</Radio>
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
                              style={{ marginBottom: 12 }}
                            >
                              <ProductUnitSelect
                                productData={productData}
                                loading={isLoadingProduct}
                                onSearch={setSearch}
                              />
                            </Form.Item>
                          );
                        }
                        if (a === 'CATEGORY') {
                          return (
                            <Form.Item
                              label="Danh mục (applyToCategoryId)"
                              name={['detail', 'applyToCategoryId']}
                              rules={[
                                rules,
                                {
                                  required: true,
                                  message: 'Chọn danh mục áp dụng',
                                },
                              ]}
                              style={{ marginBottom: 12 }}
                            >
                              <CategoryTreeSelect
                                categoriesData={categoriesData}
                                loading={isCategoriesLoading}
                              />
                            </Form.Item>
                          );
                        }
                        return (
                          <div style={{ minHeight: 36 }} /> // giữ chiều cao để hai cột cân hàng
                        );
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
