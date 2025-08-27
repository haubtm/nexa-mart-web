import { Menu as AntdMenu } from 'antd';
import styled from 'styled-components';

interface RootProps {}

export const Root = styled(AntdMenu)<RootProps>`
  .ant-menu-title-content {
    font-weight: 500;
    color: #111827;
    &,
    a {
      transition: color 0.1s;
    }
  }

  &.ant-menu-vertical > .ant-menu-submenu > .ant-menu-submenu-title {
    line-height: 46px;
  }

  &.ant-menu-inline-collapsed > .ant-menu-submenu > .ant-menu-submenu-title {
    padding-inline: calc(50% - 8px - 6px);
  }

  &.ant-menu-light.ant-menu-root.ant-menu-inline {
    border-inline-end: unset;
    overflow: auto;
  }

  &.ant-menu-light.ant-menu-root.ant-menu-vertical {
    border-inline-end: unset;
  }

  .ant-menu-submenu-arrow {
    color: #111827;
  }

  &.ant-menu-light .ant-menu-item-selected {
    background-color: #2b499e;

    .ant-menu-title-content {
      color: #ffffff;
    }
  }
`;
