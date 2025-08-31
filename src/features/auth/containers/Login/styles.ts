import { Flex } from '@/lib';
import styled from 'styled-components';

export const Root = styled(Flex)`
  width: 100%;
  height: 100%;
  background-color: #f1f3f9;
  padding: 16px;

  .ant-form-item {
    margin-bottom: 16px;
  }
`;

export const LoginBox = styled(Flex)`
  width: 900px;
  height: 540px;
  box-shadow: 0px 4px 20px 0px #00000029;
  border-radius: 16px;
  padding: 8px;
  background: #ffffff;
`;

export const LoginIllustration = styled(Flex)`
  width: 434px;
  height: 524px;
  border-radius: 16px;
  background: #a5b4fc;
`;

export const LogoSection = styled(Flex)`
  flex: 1;
  border-radius: 16px;
`;

export const LoginFormWrapper = styled(Flex)`
  width: 100%;
  max-width: 296px;
`;
