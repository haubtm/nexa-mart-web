import { useMemo } from 'react';
import type { FormInstance } from 'antd';
import {
  Card,
  Col,
  DatePicker,
  Empty,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Space,
  Spin,
  TreeSelect,
} from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { EPromotionType } from '@/lib';
import { useHook } from './hook';

const currencyParser = (v?: string) =>
  v ? Number(String(v).replace(/[.,\s]/g, '')) : 0;

const range = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, i) => i + start);

// build disabledTime cho 1 ngày cụ thể theo khung [start,end]
const buildDisabledTime = (start: Dayjs, end: Dayjs) => (current?: Dayjs) => {
  if (!current) return {};
  const sameStartDay = current.isSame(start, 'day');
  const sameEndDay = current.isSame(end, 'day');

  const disabledHours = () => {
    const hours: number[] = [];
    if (sameStartDay) hours.push(...range(0, start.hour() - 1));
    if (sameEndDay) hours.push(...range(end.hour() + 1, 23));
    // unique
    return Array.from(new Set(hours)).filter((h) => h >= 0 && h <= 23);
  };

  const disabledMinutes = (hour: number) => {
    const mins: number[] = [];
    if (sameStartDay && hour === start.hour())
      mins.push(...range(0, start.minute() - 1));
    if (sameEndDay && hour === end.hour())
      mins.push(...range(end.minute() + 1, 59));
    return Array.from(new Set(mins)).filter((m) => m >= 0 && m <= 59);
  };

  const disabledSeconds = (hour: number, minute: number) => {
    const secs: number[] = [];
    if (sameStartDay && hour === start.hour() && minute === start.minute())
      secs.push(...range(0, start.second() - 1));
    if (sameEndDay && hour === end.hour() && minute === end.minute())
      secs.push(...range(end.second() + 1, 59));
    return Array.from(new Set(secs)).filter((s) => s >= 0 && s <= 59);
  };

  return { disabledHours, disabledMinutes, disabledSeconds };
};

/* ---------- Select theo đơn vị (value=productId) ---------- */
function ProductUnitSelect({
  productData,
  loading,
  value,
  onChange,
  onSearch,
  multiple,
}: {
  productData?: any;
  loading?: boolean;
  value?: number | number[];
  onChange?: (v: any) => void;
  onSearch?: (kw: string) => void;
  multiple?: boolean;
}) {
  const options = useMemo(() => {
    const products = productData?.data?.products ?? [];
    return products.flatMap((p: any) =>
      (p.units ?? []).map((u: any) => {
        // label hiển thị rõ: Tên SP – Tên đơn vị (barcode|code)
        const tail = u.barcode
          ? ` (${u.barcode})`
          : u.code
            ? ` (${u.code})`
            : '';
        return {
          label: `${p.name} – ${u.unitName}${tail}`,
          value: u.id, // ⬅️ dùng unit.id
          // giúp tìm kiếm chính xác hơn:
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
      filterOption={(input, opt) => {
        const t = (opt as any)?._kw ?? (opt?.label as string)?.toLowerCase?.();
        return t?.includes?.(input.toLowerCase());
      }}
      notFoundContent={loading ? <Spin size="small" /> : <Empty />}
      style={{ width: '100%' }}
    />
  );
}

/* ---------- TreeSelect danh mục 2 cấp ---------- */
function CategoryTreeSelect({
  categoriesData,
  loading,
  value,
  onChange,
  placeholder = 'Chọn danh mục…',
}: {
  categoriesData?: any;
  loading?: boolean;
  value?: number;
  onChange?: (v: number) => void;
  placeholder?: string;
}) {
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

/* ---------- ORDER: điều kiện áp dụng ---------- */
function OrderCondition({ form }: { form: FormInstance }) {
  const type = Form.useWatch(['detail', '_orderConditionType'], form);
  return (
    <Card title="Điều kiện áp dụng" size="small" style={{ marginTop: 8 }}>
      <Form.Item name={['detail', '_orderConditionType']} initialValue="NONE">
        <Radio.Group>
          <Space direction="vertical">
            <Radio value="NONE">Không có</Radio>
            <Radio value="MIN_ORDER_VALUE">
              Tổng giá trị đơn hàng tối thiểu
            </Radio>
            <Radio value="MIN_DISCOUNTED_QTY">
              Tổng số lượng sản phẩm được khuyến mại tối thiểu
            </Radio>
          </Space>
        </Radio.Group>
      </Form.Item>

      {type === 'MIN_ORDER_VALUE' && (
        <Form.Item
          name={['detail', 'orderMinTotalValue']}
          rules={[
            { required: true, message: 'Nhập giá trị tối thiểu' },
            {
              validator: (_, v) =>
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
            style={{ width: 240 }}
          />
        </Form.Item>
      )}

      {type === 'MIN_DISCOUNTED_QTY' && (
        <Form.Item
          name={['detail', 'orderMinTotalQuantity']}
          rules={[
            { required: true, message: 'Nhập số lượng tối thiểu' },
            {
              validator: (_, v) =>
                v && v >= 1
                  ? Promise.resolve()
                  : Promise.reject('Số lượng phải ≥ 1'),
            },
          ]}
        >
          <InputNumber min={1} style={{ width: 240 }} />
        </Form.Item>
      )}
    </Card>
  );
}

/* ---------- PRODUCT: điều kiện áp dụng ---------- */
function ProductCondition({ form }: { form: FormInstance }) {
  const type = Form.useWatch(['detail', '_productConditionType'], form);
  return (
    <Card title="Điều kiện áp dụng" size="small" style={{ marginTop: 8 }}>
      <Form.Item name={['detail', '_productConditionType']} initialValue="NONE">
        <Radio.Group>
          <Space direction="vertical">
            <Radio value="NONE">Không có</Radio>
            <Radio value="MIN_ORDER_VALUE">
              Tổng giá trị đơn hàng tối thiểu
            </Radio>
            <Radio value="MIN_DISCOUNTED_VALUE">
              Tổng giá trị sản phẩm được khuyến mại tối thiểu
            </Radio>
            <Radio value="MIN_DISCOUNTED_QTY">
              Tổng số lượng sản phẩm được khuyến mại tối thiểu
            </Radio>
          </Space>
        </Radio.Group>
      </Form.Item>

      {type === 'MIN_ORDER_VALUE' && (
        <Form.Item
          name={['detail', 'productMinOrderValue']}
          rules={[
            { required: true, message: 'Nhập giá trị tối thiểu' },
            {
              validator: (_, v) =>
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
            style={{ width: 240 }}
          />
        </Form.Item>
      )}

      {type === 'MIN_DISCOUNTED_VALUE' && (
        <Form.Item
          name={['detail', 'productMinPromotionValue']}
          rules={[
            { required: true, message: 'Nhập giá trị tối thiểu' },
            {
              validator: (_, v) =>
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
            style={{ width: 240 }}
          />
        </Form.Item>
      )}

      {type === 'MIN_DISCOUNTED_QTY' && (
        <Form.Item
          name={['detail', 'productMinPromotionQuantity']}
          rules={[
            { required: true, message: 'Nhập số lượng tối thiểu' },
            {
              validator: (_, v) =>
                v && v >= 1
                  ? Promise.resolve()
                  : Promise.reject('Số lượng phải ≥ 1'),
            },
          ]}
        >
          <InputNumber min={1} style={{ width: 240 }} />
        </Form.Item>
      )}
    </Card>
  );
}

/* ---------- ORDER fields ---------- */
function OrderDiscountFields({ form }: { form: FormInstance }) {
  const dType = Form.useWatch(['detail', 'orderDiscountType'], form);
  const isPercent = dType === 'PERCENTAGE';

  return (
    <>
      <Form.Item
        label="Hình thức giảm (đơn hàng)"
        name={['detail', 'orderDiscountType']}
        rules={[{ required: true, message: 'Chọn hình thức giảm' }]}
        initialValue="PERCENTAGE"
      >
        <Radio.Group>
          <Space direction="vertical">
            <Radio value="FIXED_AMOUNT">Số tiền</Radio>
            <Radio value="PERCENTAGE">%</Radio>
          </Space>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        label="Giá trị giảm"
        name={['detail', 'orderDiscountValue']}
        rules={[{ required: true, message: 'Nhập giá trị giảm' }]}
      >
        <InputNumber
          min={0}
          style={{ width: 260 }}
          parser={currencyParser}
          addonAfter={isPercent ? '%' : 'đ'}
        />
      </Form.Item>

      {isPercent && (
        <Form.Item
          label="Mức giảm tối đa"
          name={['detail', 'orderDiscountMaxValue']}
        >
          <InputNumber
            min={0}
            style={{ width: 260 }}
            parser={currencyParser}
            addonAfter="đ"
          />
        </Form.Item>
      )}

      <OrderCondition form={form} />
    </>
  );
}

/* ---------- PRODUCT fields ---------- */
function ProductDiscountFields({
  form,
  productData,
  isLoadingProduct,
  categoriesData,
  isCategoriesLoading,
  setSearch,
}: any) {
  const dType = Form.useWatch(['detail', 'productDiscountType'], form);
  const isPercent = dType === 'PERCENTAGE';
  const applyToType = Form.useWatch(['detail', 'applyToType'], form);

  return (
    <>
      <Form.Item
        label="Hình thức giảm (sản phẩm)"
        name={['detail', 'productDiscountType']}
        rules={[{ required: true, message: 'Chọn hình thức giảm' }]}
        initialValue="PERCENTAGE"
      >
        <Radio.Group>
          <Space direction="vertical">
            <Radio value="FIXED_AMOUNT">Số tiền</Radio>
            <Radio value="PERCENTAGE">%</Radio>
          </Space>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        label="Giá trị giảm"
        name={['detail', 'productDiscountValue']}
        rules={[{ required: true, message: 'Nhập giá trị giảm' }]}
      >
        <InputNumber
          min={0}
          style={{ width: 260 }}
          parser={currencyParser}
          addonAfter={isPercent ? '%' : 'đ'}
        />
      </Form.Item>

      <Form.Item
        label="Áp dụng cho (applyToType)"
        name={['detail', 'applyToType']}
        initialValue="ALL"
        rules={[{ required: true, message: 'Chọn đối tượng áp dụng' }]}
      >
        <Radio.Group>
          <Space direction="vertical">
            <Radio value="ALL">Tất cả sản phẩm</Radio>
            <Radio value="PRODUCT">Sản phẩm cụ thể</Radio>
            <Radio value="CATEGORY">Danh mục cụ thể</Radio>
          </Space>
        </Radio.Group>
      </Form.Item>

      {applyToType === 'PRODUCT' && (
        <Form.Item
          label="Sản phẩm (applyToProductId)"
          name={['detail', 'applyToProductId']}
          rules={[{ required: true, message: 'Chọn sản phẩm' }]}
        >
          <ProductUnitSelect
            productData={productData}
            loading={isLoadingProduct}
            onSearch={setSearch}
          />
        </Form.Item>
      )}

      {applyToType === 'CATEGORY' && (
        <Form.Item
          label="Danh mục (applyToCategoryId)"
          name={['detail', 'applyToCategoryId']}
          rules={[{ required: true, message: 'Chọn danh mục' }]}
        >
          <CategoryTreeSelect
            categoriesData={categoriesData}
            loading={isCategoriesLoading}
          />
        </Form.Item>
      )}

      <ProductCondition form={form} />
    </>
  );
}

/* ---------- Main form ---------- */
export default function PromotionCreateForm({
  handleSubmit,
  form,
  headerStartDate,
  headerEndDate,
}: {
  handleSubmit?: (v: any) => Promise<void>;
  form: FormInstance;
  headerStartDate: string;
  headerEndDate: string;
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

  const type: EPromotionType | undefined = Form.useWatch('promotionType', form);
  const buyConditionType = Form.useWatch(['detail', '_buyConditionType'], form);

  const hdrStart = headerStartDate ? dayjs(headerStartDate) : null;
  const hdrEnd = headerEndDate ? dayjs(headerEndDate) : null;

  const disabledDate = (current: Dayjs) => {
    if (!hdrStart || !hdrEnd) return false;
    return (
      current.isBefore(hdrStart.startOf('day')) ||
      current.isAfter(hdrEnd.endOf('day'))
    );
  };

  const disabledTime =
    hdrStart && hdrEnd ? buildDisabledTime(hdrStart, hdrEnd) : undefined;
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        promotionType: EPromotionType.ORDER_DISCOUNT,
        startDate: hdrStart ?? dayjs(),
        endDate: hdrEnd ?? dayjs().add(1, 'day'),
        detail: {},
      }}
    >
      {/* 1) Chương trình khuyến mãi */}
      <Card title="Chương trình khuyến mãi" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Mã chương trình"
              name="promotionCode"
              rules={[
                { required: true, message: 'Nhập mã chương trình' },
                {
                  pattern: /^[A-Za-z0-9_-]+$/,
                  message: 'Mã chương trình không hợp lệ',
                },
              ]}
            >
              <Input placeholder="VD: FLASH10" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Trạng thái" name="status">
              <Select
                allowClear
                options={[
                  { label: 'UPCOMING', value: 'UPCOMING' },
                  { label: 'ACTIVE', value: 'ACTIVE' },
                  { label: 'PAUSED', value: 'PAUSED' },
                  { label: 'EXPIRED', value: 'EXPIRED' },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Mô tả" name="description" rules={[rules]}>
          <Input placeholder="Mô tả ngắn" />
        </Form.Item>

        <Form.Item
          label="Loại khuyến mãi"
          name="promotionType"
          rules={[{ required: true, message: 'Vui lòng chọn loại khuyến mãi' }]}
        >
          <Radio.Group>
            <Space direction="vertical">
              <Radio value={EPromotionType.ORDER_DISCOUNT}>
                Giảm giá đơn hàng
              </Radio>
              <Radio value={EPromotionType.PRODUCT_DISCOUNT}>
                Giảm giá sản phẩm
              </Radio>
              <Radio value={EPromotionType.BUY_X_GET_Y}>Mua X tặng Y</Radio>
            </Space>
          </Radio.Group>
        </Form.Item>
      </Card>

      {/* 2) Thời gian */}
      <Card title="Thời gian" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Ngày bắt đầu"
              name="startDate"
              rules={[
                rules,
                { required: true, message: 'Vui lòng chọn ngày bắt đầu' },
              ]}
            >
              <DatePicker
                showTime
                format="DD/MM/YYYY HH:mm"
                style={{ width: '100%' }}
                disabledDate={disabledDate}
                disabledTime={disabledTime}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Ngày kết thúc"
              name="endDate"
              rules={[
                rules,
                { required: true, message: 'Vui lòng chọn ngày kết thúc' },
              ]}
            >
              <DatePicker
                showTime
                format="DD/MM/YYYY HH:mm"
                style={{ width: '100%' }}
                disabledDate={disabledDate}
                disabledTime={disabledTime}
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* 3) Giới hạn sử dụng */}
      <Card title="Giới hạn sử dụng" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item label="Tối đa mỗi khách" name="maxUsagePerCustomer">
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Tổng số lượt" name="maxUsageTotal">
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* 4) Nhánh theo loại */}
      {type === EPromotionType.ORDER_DISCOUNT && (
        <Card title="Giảm giá đơn hàng" style={{ marginBottom: 16 }}>
          <OrderDiscountFields form={form} />
        </Card>
      )}

      {type === EPromotionType.PRODUCT_DISCOUNT && (
        <Card title="Giảm giá sản phẩm" style={{ marginBottom: 16 }}>
          <ProductDiscountFields
            form={form}
            productData={productData}
            isLoadingProduct={isLoadingProduct}
            categoriesData={categoriesData}
            isCategoriesLoading={isCategoriesLoading}
            setSearch={setSearch}
          />
        </Card>
      )}

      {type === EPromotionType.BUY_X_GET_Y && (
        <Card title="Mua X tặng Y" style={{ marginBottom: 16 }}>
          <Form.Item
            label="Loại điều kiện mua"
            name={['detail', '_buyConditionType']}
            initialValue="PRODUCT_QTY"
            rules={[{ required: true, message: 'Chọn loại điều kiện' }]}
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
                  rules={[{ required: true, message: 'Chọn sản phẩm mua' }]}
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
                    { required: true, message: 'Nhập số lượng' },
                    {
                      validator: (_, v) =>
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
                  rules={[{ required: true, message: 'Chọn danh mục' }]}
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
                    { required: true, message: 'Nhập giá trị' },
                    {
                      validator: (_, v) =>
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
                rules={[{ required: true, message: 'Chọn sản phẩm tặng' }]}
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
                  { required: true, message: 'Nhập số lượng' },
                  {
                    validator: (_, v) =>
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
            initialValue="FREE"
            rules={[{ required: true, message: 'Chọn hình thức' }]}
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
                    { required: true, message: 'Nhập giá trị' },
                    {
                      validator: (_, v) =>
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

      {/* Không có nút – parent gọi form.submit() */}
    </Form>
  );
}
