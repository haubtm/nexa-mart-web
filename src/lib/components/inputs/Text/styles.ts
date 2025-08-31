import { Input as AntdInput } from 'antd';
import styled from 'styled-components';

interface RootProps {}

export const Root = styled(AntdInput)<RootProps>`
  .ant-input-prefix {
    margin-inline-end: 8px;
  }
`;
