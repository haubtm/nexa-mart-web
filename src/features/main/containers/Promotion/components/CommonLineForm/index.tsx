import type { FormInstance } from 'antd';
import {
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
} from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { EPromotionType } from '@/lib';
import { useHook } from './hook';

export default function PromotionLineCreateForm({
  handleSubmit,
  form,
  headerStartDate,
  headerEndDate,
  update = false,
}: {
  handleSubmit?: (v: any) => Promise<void>;
  form: FormInstance;
  headerStartDate: string;
  headerEndDate: string;
  update?: boolean;
}) {
  const { rules, onFinish } = useHook(handleSubmit);

  const hdrStart = headerStartDate ? dayjs(headerStartDate) : null;
  const hdrEnd = headerEndDate ? dayjs(headerEndDate) : null;

  const disabledDate = (current: Dayjs) => {
    if (!hdrStart || !hdrEnd) return false;
    return (
      current.isBefore(hdrStart.startOf('day')) ||
      current.isAfter(hdrEnd.endOf('day'))
    );
  };
  return (
    <Form
      form={form}
      initialValues={{
        promotionCode: '',
        promotionType: EPromotionType.BUY_X_GET_Y,
        description: '',
        startDate: hdrStart ?? dayjs(),
        endDate: hdrEnd ?? dayjs().add(1, 'day'),
        status: 'ACTIVE',
        maxUsagePerCustomer: 1,
        maxUsageTotal: 1,
      }}
      onFinish={onFinish}
    >
      <>
        {/* 1) Chương trình khuyến mãi (Line) */}
        <Card
          title="Chương trình khuyến mãi (Line)"
          style={{ marginBottom: 16 }}
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Mã chương trình"
                name="promotionCode"
                rules={[
                  rules,
                  { required: true, message: 'Nhập mã chương trình' },
                  {
                    pattern: /^[A-Za-z0-9_-]+$/,
                    message: 'Mã chương trình không hợp lệ',
                  },
                ]}
              >
                <Input placeholder="VD: 8aC" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Trạng thái" name="status" rules={[rules]}>
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
          <Form.Item
            label="Mô tả"
            name="description"
            rules={[rules, { required: true, message: 'Vui lòng nhập mô tả' }]}
          >
            <Input placeholder="Mô tả ngắn" />
          </Form.Item>

          <Form.Item
            label="Loại khuyến mãi"
            name="promotionType"
            rules={[
              rules,
              { required: true, message: 'Vui lòng chọn loại khuyến mãi' },
            ]}
            hidden={update}
          >
            <Radio.Group>
              <Radio value={EPromotionType.ORDER_DISCOUNT}>
                Giảm giá đơn hàng
              </Radio>
              <Radio value={EPromotionType.PRODUCT_DISCOUNT}>
                Giảm giá sản phẩm
              </Radio>
              <Radio value={EPromotionType.BUY_X_GET_Y}>Mua X tặng Y</Radio>
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
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>
        {/* 3) Giới hạn sử dụng */}
        <Card title="Giới hạn sử dụng" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[rules]}
                label="Tối đa mỗi khách"
                name="maxUsagePerCustomer"
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[rules]}
                label="Tổng số lượt"
                name="maxUsageTotal"
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </>
    </Form>
  );
}
