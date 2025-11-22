import { Form, FormItem, type IFormProps, Input, Select } from '@/lib';
import { useHook } from './hook';
import type { ISupplierCreateRequest } from '@/dtos';
import { Col, Row } from 'antd';

interface ISupplierFormValues extends ISupplierCreateRequest {
  addressDetail?: string;
  wardCode?: string | number;
  provinceCode?: string | number;
}

interface ISupplierFormProps {
  form: IFormProps<ISupplierFormValues>['form'];
  handleSubmit: (values: ISupplierCreateRequest) => void;
  readonly?: boolean;
}

const SupplierForm = ({
  form,
  handleSubmit,
  readonly = false,
}: ISupplierFormProps) => {
  const { rules, onFinish, provinceOptions, wardOptions, setSelectedProvince } = useHook(handleSubmit);

  return (
    <Form form={form} onFinish={(values) => onFinish(values)}>
      <FormItem<ISupplierCreateRequest>
        label={'Mã nhà cung cấp'}
        name="code"
        required
        rules={[rules]}
      >
        <Input readOnly={readonly} placeholder={'Mã nhà cung cấp'} />
      </FormItem>

      <FormItem<ISupplierCreateRequest>
        label={'Tên nhà cung cấp'}
        name="name"
        required
        rules={[rules]}
      >
        <Input readOnly={readonly} placeholder={'Tên nhà cung cấp'} />
      </FormItem>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <FormItem<ISupplierFormValues>
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
          <FormItem<ISupplierFormValues>
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
          <FormItem<ISupplierFormValues>
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

      <FormItem<ISupplierCreateRequest>
        label="Email"
        name="email"
        required
        rules={[rules]}
      >
        <Input readOnly={readonly} placeholder="Email" />
      </FormItem>

      <FormItem<ISupplierCreateRequest>
        label="Số điện thoại"
        name="phone"
        required
        rules={[rules]}
      >
        <Input readOnly={readonly} placeholder="Số điện thoại" />
      </FormItem>
    </Form>
  );
};

export default SupplierForm;
