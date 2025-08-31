import type { FormItemProps as AntdFormItemProps } from 'antd';
import { Root } from './styles';

export interface IFormItemProps<T> extends AntdFormItemProps<T> {}

const FormItem = <T,>(props: IFormItemProps<T>) => {
  return <Root {...props} />;
};

export default FormItem;
