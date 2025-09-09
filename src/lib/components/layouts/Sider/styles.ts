import { Layout as AntdLayout } from 'antd';
import styled from 'styled-components';

interface RootProps {}

export const Root = styled(AntdLayout.Sider)<RootProps>`
  background: #ffffff;
  z-index: 2;

  & .ant-layout-sider-trigger {
    height: auto;
    background: #ffffff;
    padding: 16px 40px;
  }
`;
