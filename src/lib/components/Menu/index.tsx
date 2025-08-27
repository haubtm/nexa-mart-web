import { Menu as AntdMenu } from 'antd';
import type { ComponentProps } from 'react';
import { Root } from './styles';

export interface IMenuProps extends ComponentProps<typeof AntdMenu> {}

const Menu = (props: IMenuProps) => {
  return <Root {...props} />;
};

export default Menu;
