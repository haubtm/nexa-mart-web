import {
  ERole,
  Form,
  FormItem,
  type IFormProps,
  Input,
  InputPassword,
  Select,
} from '@/lib';
import { useHook } from './hook';
import type { IEmployeeCreateRequest } from '@/dtos';

interface IEmployeeFormProps {
  form: IFormProps<IEmployeeCreateRequest>['form'];
  handleSubmit: (values: IEmployeeCreateRequest) => void;
  readonly?: boolean;
}

const EmployeeForm = ({
  form,
  handleSubmit,
  readonly = false,
}: IEmployeeFormProps) => {
  const { rules, onFinish } = useHook(handleSubmit);

  return (
    <Form form={form} onFinish={(values) => onFinish(values)}>
      <FormItem<IEmployeeCreateRequest>
        label={'Thêm nhân viên'}
        name="name"
        required
        rules={[rules]}
      >
        <Input readOnly={readonly} placeholder={'Tên nhân viên'} />
      </FormItem>

      <FormItem<IEmployeeCreateRequest>
        label="Email"
        name="email"
        required
        rules={[rules]}
      >
        <Input readOnly={readonly} placeholder="Email" />
      </FormItem>

      <FormItem<IEmployeeCreateRequest>
        label="Mật khẩu"
        name="passwordHash"
        required
        rules={[rules]}
      >
        <InputPassword readOnly={readonly} placeholder="Mật khẩu" />
      </FormItem>

      <FormItem<IEmployeeCreateRequest>
        label="Vai trò"
        name="role"
        required
        rules={[rules]}
      >
        <Select
          options={[
            { label: 'Quản trị viên', value: ERole.ADMIN },
            { label: 'Nhân viên', value: ERole.STAFF },
          ]}
          placeholder="Chọn vai trò"
          disabled={readonly}
        />
      </FormItem>
    </Form>
  );
};

export default EmployeeForm;
