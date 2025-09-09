import { Layout as AntdLayout } from 'antd';
import type { ComponentProps } from 'react';
import { Root } from './styles';

export interface ILayoutSiderProps
  extends ComponentProps<typeof AntdLayout.Sider> {}

const LayoutSider = (props: ILayoutSiderProps) => {
  return <Root {...props} />;
};

export default LayoutSider;
