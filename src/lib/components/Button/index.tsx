import { Button as AntdButton } from 'antd';
import { type ComponentProps } from 'react';
import { Root } from './styles';

export interface IButtonProps extends ComponentProps<typeof AntdButton> {}

const Button = (props: IButtonProps) => {
  const { size, ...rest } = props;

  return <Root size={size ?? 'large'} {...rest} />;
};

export default Button;
