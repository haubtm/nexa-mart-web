import { Input as AntdInput } from 'antd';
import type { ComponentProps } from 'react';
import { Root } from './styles';

export interface IInputPasswordProps
  extends ComponentProps<typeof AntdInput.Password> {}

const InputPassword = (props: IInputPasswordProps) => {
  const { size, ...rest } = props;

  return <Root size={size ?? 'large'} {...rest} />;
};

export default InputPassword;
