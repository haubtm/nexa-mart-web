import { Layout as AntdLayout } from 'antd';
import styled from 'styled-components';

interface RootProps {}

export const Root = styled(AntdLayout.Header)<RootProps>`
  height: 54px;
  background: #ffffff;
  box-shadow:
    rgba(0, 0, 0, 0.1) 0px 2px 4px,
    rgba(0, 0, 0, 0.1) 0px 0px 2px;
  z-index: 1;
  padding: 0 20px;
`;
