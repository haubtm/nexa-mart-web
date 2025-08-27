import { Layout as AntdLayout } from 'antd';
import type { ComponentProps } from 'react';
import { Root } from './styles';

export interface ILayoutHeaderProps
  extends ComponentProps<typeof AntdLayout.Header> {}

const LayoutHeader = (props: ILayoutHeaderProps) => {
  return <Root {...props} />;
};

export default LayoutHeader;
