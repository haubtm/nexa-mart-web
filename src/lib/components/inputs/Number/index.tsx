import { InputNumber as AntdInputNumber } from 'antd';
import type { ComponentProps } from 'react';
import { Root } from './styles';

export interface IInputNumberProps
  extends ComponentProps<typeof AntdInputNumber> {}

const InputNumber = (props: IInputNumberProps) => {
  const { size, ...rest } = props;

  return <Root size={size ?? 'large'} {...rest} />;
};

export default InputNumber;
