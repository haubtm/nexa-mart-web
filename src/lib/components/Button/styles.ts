import { Button as AntdButton } from 'antd';
import styled from 'styled-components';

interface IRootProps {}

export const Root = styled(AntdButton)<IRootProps>`
  gap: 14px;
  font-weight: 500;

  .ant-btn-icon {
    display: inline-flex;
  }
`;
