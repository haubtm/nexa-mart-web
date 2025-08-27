import { Layout as AntdLayout } from 'antd';
import type { ComponentProps } from 'react';
import { Root } from './styles';

export interface ILayoutContentProps
  extends ComponentProps<typeof AntdLayout.Content> {}

const LayoutContent = (props: ILayoutContentProps) => {
  return <Root {...props} />;
};

export default LayoutContent;
