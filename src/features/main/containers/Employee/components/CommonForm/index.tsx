import { DatePicker, Row, Col } from 'antd';
import {
  EGender,
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
      <Row gutter={16}>
        <Col span={12}>
          <FormItem<IEmployeeCreateRequest>
            label={'Tên nhân viên'}
            name="name"
            required
            rules={[rules]}
          >
            <Input readOnly={readonly} placeholder={'Tên nhân viên'} />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem<IEmployeeCreateRequest>
            label={'Mã nhân viên'}
            name="employeeCode"
            rules={[rules]}
          >
            <Input readOnly={readonly} placeholder={'Tự động sinh nếu để trống'} />
          </FormItem>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <FormItem<IEmployeeCreateRequest>
            label="Email"
            name="email"
            required
            rules={[rules]}
          >
            <Input readOnly={readonly} placeholder="Email" />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem<IEmployeeCreateRequest>
            label="Số điện thoại"
            name="phone"
            rules={[rules]}
          >
            <Input readOnly={readonly} placeholder="Số điện thoại" />
          </FormItem>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <FormItem<IEmployeeCreateRequest>
            label="Mật khẩu"
            name="password"
            required
            rules={[rules]}
          >
            <InputPassword readOnly={readonly} placeholder="Mật khẩu" />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem<IEmployeeCreateRequest>
            label="Ngày sinh"
            name="dateOfBirth"
            rules={[rules]}
          >
            <DatePicker
              disabled={readonly}
              placeholder="Chọn ngày sinh"
              style={{ width: '100%' }}
            />
          </FormItem>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <FormItem<IEmployeeCreateRequest>
            label="Giới tính"
            name="gender"
            required
            rules={[rules]}
          >
            <Select
              options={[
                { label: 'Nam', value: EGender.MALE },
                { label: 'Nữ', value: EGender.FEMALE },
              ]}
              placeholder="Chọn giới tính"
              disabled={readonly}
            />
          </FormItem>
        </Col>
        <Col span={12}>
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
        </Col>
      </Row>
    </Form>
  );
};

export default EmployeeForm;

