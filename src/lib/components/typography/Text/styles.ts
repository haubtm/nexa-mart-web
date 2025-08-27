import { Typography as AntdTypography } from 'antd';
import styled from 'styled-components';

interface RootProps {}

export const Root = styled(AntdTypography.Text)<RootProps>`
  font-family: 'Inter', sans-serif;
`;
