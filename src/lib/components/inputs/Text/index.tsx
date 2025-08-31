import { Input as AntdInput } from 'antd';
import type { ComponentProps } from 'react';
import { Root } from './styles';

export interface IInputProps extends ComponentProps<typeof AntdInput> {}

const Input = (props: IInputProps) => {
  const { size, ...rest } = props;

  return <Root size={size ?? 'large'} {...rest} />;
};

export default Input;
