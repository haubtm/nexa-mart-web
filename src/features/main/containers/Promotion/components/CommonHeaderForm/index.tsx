import type { FormInstance } from 'antd';
import {
  Card,
  Col,
  DatePicker,
  Form as AntForm,
  Input,
  Row,
  Select,
} from 'antd';
import dayjs from 'dayjs';
import { useHook } from './hook';
import { Form } from '@/lib';
import { EPromotionStatus } from '@/lib';

const PromotionHeaderCreateForm = ({
  handleSubmit,
  form,
}: {
  handleSubmit?: (v: any) => Promise<void>;
  form: FormInstance;
}) => {
  const { onFinish } = useHook(handleSubmit);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        status: EPromotionStatus.ACTIVE,
        startDate: dayjs(),
      }}
    >
      <Card title="Chương trình khuyến mãi">
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <AntForm.Item
              label="Tên chương trình"
              name="promotionName"
              rules={[
                { required: true, message: 'Vui lòng nhập tên chương trình' },
              ]}
            >
              <Input placeholder="VD: Khuyến mãi tháng 10" />
            </AntForm.Item>
          </Col>
          <Col xs={24} md={12}>
            <AntForm.Item
              label="Trạng thái"
              name="status"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
            >
              <Select
                options={[
                  { label: 'Hoạt động', value: EPromotionStatus.ACTIVE },
                  { label: 'Tạm dừng', value: EPromotionStatus.PAUSED },
                ]}
              />
            </AntForm.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <AntForm.Item
              label="Ngày bắt đầu"
              name="startDate"
              rules={[
                { required: true, message: 'Vui lòng chọn ngày bắt đầu' },
              ]}
            >
              <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
            </AntForm.Item>
          </Col>
          <Col xs={24} md={12}>
            <AntForm.Item
              label="Ngày kết thúc"
              name="endDate"
              rules={[
                { required: true, message: 'Vui lòng chọn ngày kết thúc' },
              ]}
            >
              <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
            </AntForm.Item>
          </Col>
        </Row>

        <AntForm.Item label="Mô tả" name="description">
          <Input.TextArea rows={3} placeholder="Mô tả ngắn (không bắt buộc)" />
        </AntForm.Item>
      </Card>
    </Form>
  );
};

export default PromotionHeaderCreateForm;
