import { Flex as AntdFlex } from 'antd';
import { ComponentProps } from 'react';
import { Root } from './styles';

export interface IFlexProps extends ComponentProps<typeof AntdFlex> {}

const Flex = (props: IFlexProps) => {
  return <Root {...props} />;
};

export default Flex;
