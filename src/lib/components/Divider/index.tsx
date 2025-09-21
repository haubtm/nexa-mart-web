import { Divider as AntdDivider } from 'antd';
import { ComponentProps } from 'react';
import { Root } from './styles';

export interface IDividerProps extends ComponentProps<typeof AntdDivider> {}

const Divider = (props: IDividerProps) => {
  return <Root {...props} />;
};

export default Divider;
