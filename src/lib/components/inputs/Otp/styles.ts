import styled from 'styled-components';

interface RootProps {}

export const Root = styled.div<RootProps>`
  display: inline-block;

  .ant-input-lg {
    width: 42px;
    height: 46px;
    padding: 0;
    font-size: 24px;
  }
`;
