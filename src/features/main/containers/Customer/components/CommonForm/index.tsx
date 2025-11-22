import {
  ECustomerType,
  EGender,
  Form,
  FormItem,
  type IFormProps,
  Input,
  Select,
} from '@/lib';
import { useHook } from './hook';
import type { ICustomerCreateRequest } from '@/dtos';
import dayjs from 'dayjs';
import { Col, DatePicker, Row } from 'antd';

interface ICustomerFormValues extends ICustomerCreateRequest {
  addressDetail?: string;
  wardCode?: string | number;
  provinceCode?: string | number;
}

interface ICustomerFormProps {
  form: IFormProps<ICustomerFormValues>['form'];
  handleSubmit: (values: ICustomerCreateRequest) => void;
  readonly?: boolean;
}

const CustomerForm = ({
  form,
  handleSubmit,
  readonly = false,
}: ICustomerFormProps) => {
  const { rules, onFinish, provinceOptions, wardOptions, setSelectedProvince } = useHook(handleSubmit);
  const defaultPickerValue = dayjs().subtract(16, 'year');

  return (
    <Form form={form} onFinish={(values) => onFinish(values)}>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <FormItem<ICustomerCreateRequest>
            label={'Tên khách hàng'}
            name="name"
            required
            rules={[rules]}
          >
            <Input readOnly={readonly} placeholder={'Tên khách hàng'} />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem<ICustomerCreateRequest>
            label="Mã khách hàng"
            name="customerCode"
            required
            rules={[rules]}
          >
            <Input readOnly={readonly} placeholder="Mã khách hàng" />
          </FormItem>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <FormItem<ICustomerCreateRequest>
            label="Số điện thoại"
            name="phone"
            required
            rules={[rules]}
          >
            <Input readOnly={readonly} placeholder="Nhập Số điện thoại" />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem<ICustomerCreateRequest>
            label="Ngày sinh"
            name="dateOfBirth"
            required
            rules={[rules]}
          >
            <DatePicker
              format="YYYY-MM-DD"
              disabledDate={(current) =>
                !!current && current > dayjs().endOf('day')
              }
              defaultPickerValue={defaultPickerValue}
              placeholder="Chọn ngày sinh"
              allowClear
              disabled={readonly}
              style={{ width: '100%' }}
            />
          </FormItem>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <FormItem<ICustomerFormValues>
            label="Địa chỉ chi tiết"
            name="addressDetail"
            required
            rules={[rules]}
          >
            <Input readOnly={readonly} placeholder="Nhập địa chỉ chi tiết (số nhà, đường, ...)" />
          </FormItem>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <FormItem<ICustomerFormValues>
            label="Tỉnh/Thành phố"
            name="provinceCode"
            required
            rules={[rules]}
          >
            <Select
              options={provinceOptions}
              placeholder="Chọn Tỉnh/Thành phố"
              disabled={readonly}
              allowClear
              onChange={(value) => {
                setSelectedProvince(value ? Number(value) : null);
                form?.setFieldValue('wardCode', undefined);
              }}
            />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem<ICustomerFormValues>
            label="Xã/Phường"
            name="wardCode"
            required
            rules={[rules]}
          >
            <Select
              options={wardOptions}
              placeholder="Chọn Xã/Phường"
              disabled={readonly || !form?.getFieldValue('provinceCode')}
              allowClear
            />
          </FormItem>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <FormItem<ICustomerFormValues>
            label="Email"
            name="email"
            required
            rules={[rules]}
          >
            <Input readOnly={readonly} placeholder="Email" />
          </FormItem>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <FormItem<ICustomerFormValues>
            label="Giới tính"
            name="gender"
            required
            rules={[
              rules,
              {
                required: true,
                message: 'Vui lòng chọn giới tính',
              },
            ]}
          >
            <Select
              options={[
                { label: 'Nam', value: EGender.MALE },
                { label: 'Nữ', value: EGender.FEMALE },
              ]}
              placeholder="Chọn giới tính"
              disabled={readonly}
              allowClear={false}
            />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem<ICustomerFormValues>
            label="Nhóm khách hàng"
            name="customerType"
            required
            rules={[
              rules,
              {
                required: true,
                message: 'Vui lòng chọn nhóm khách hàng',
              },
            ]}
          >
            <Select
              options={[
                { label: 'Khách hàng thường', value: ECustomerType.REGULAR },
                { label: 'Khách hàng VIP', value: ECustomerType.VIP },
              ]}
              placeholder="Chọn nhóm khách hàng"
              disabled={readonly}
              allowClear={false}
            />
          </FormItem>
        </Col>
      </Row>
    </Form>
  );
};

export default CustomerForm;
