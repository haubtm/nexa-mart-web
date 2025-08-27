import { Layout as AntdLayout } from 'antd';
import type { ComponentProps } from 'react';
import { Root } from './styles';

export interface ILayoutProps extends ComponentProps<typeof AntdLayout> {}

const Layout = (props: ILayoutProps) => {
  return <Root {...props} />;
};

export default Layout;
