import { Form as AntdForm, type FormProps as AntdFormProps } from 'antd';
import { Root } from './styles';

export interface IFormProps<T = any> extends AntdFormProps<T> {}

const Form = <T,>(props: IFormProps<T>) => {
  const { layout, size, ...rest } = props;

  return (
    <Root<any> layout={layout ?? 'vertical'} size={size ?? 'large'} {...rest} />
  );
};

Form.useForm = AntdForm.useForm;
Form.useFormInstance = AntdForm.useFormInstance;
Form.useWatch = AntdForm.useWatch;
Form.List = AntdForm.List;
export default Form;
