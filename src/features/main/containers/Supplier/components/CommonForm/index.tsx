import { Form, FormItem, type IFormProps, Input } from '@/lib';
import { useHook } from './hook';
import type { ISupplierCreateRequest } from '@/dtos';

interface ISupplierFormProps {
  form: IFormProps<ISupplierCreateRequest>['form'];
  handleSubmit: (values: ISupplierCreateRequest) => void;
  readonly?: boolean;
}

const SupplierForm = ({
  form,
  handleSubmit,
  readonly = false,
}: ISupplierFormProps) => {
  const { rules, onFinish } = useHook(handleSubmit);

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

      <FormItem<ISupplierCreateRequest>
        label={'Địa chỉ'}
        name="address"
        required
        rules={[rules]}
      >
        <Input readOnly={readonly} placeholder={'Địa chỉ'} />
      </FormItem>

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
