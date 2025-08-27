import { Layout as AntdLayout } from 'antd';
import styled from 'styled-components';

interface RootProps {}

export const Root = styled(AntdLayout.Content)<RootProps>`
  padding: 16px;
  background: #f5f5f5;
  overflow: auto;
`;
