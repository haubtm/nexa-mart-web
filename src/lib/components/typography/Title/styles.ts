import { Typography as AntdTypography } from 'antd';
import styled from 'styled-components';

interface RootProps {}

export const Root = styled(AntdTypography.Title)<RootProps>`
  font-family: 'Inter', sans-serif;
`;
