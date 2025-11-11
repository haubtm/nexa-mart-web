import type { FormInstance } from 'antd';
import { Card, Col, DatePicker, Form, Input, Radio, Row, Select } from 'antd';
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
        lineName: 'string',
        promotionType: EPromotionType.BUY_X_GET_Y,
        description: '',
        startDate: hdrStart ?? dayjs(),
        endDate: hdrEnd ?? dayjs(),
        status: 'ACTIVE',
      }}
      onFinish={onFinish}
    >
      <>
        {/* 1) Chương trình khuyến mãi (Line) */}
        <Card title="Chương trình khuyến mãi" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item label="Tên khuyến mãi" name="lineName" rules={[rules]}>
                <Input placeholder="VD: Khuyến mãi 11/11" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Trạng thái" name="status" rules={[rules]}>
                <Select
                  allowClear
                  options={[
                    { label: 'Hoạt động', value: 'ACTIVE' },
                    { label: 'Tạm dừng', value: 'PAUSED' },
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
                  { required: true, message: 'Chọn ngày bắt đầu' },
                ]}
              >
                <DatePicker
                  format="DD/MM/YYYY"
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
                  { required: true, message: 'Chọn ngày kết thúc' },
                ]}
              >
                <DatePicker
                  format="DD/MM/YYYY"
                  style={{ width: '100%' }}
                  disabledDate={disabledDate}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </>
    </Form>
  );
}
