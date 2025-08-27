import { Typography as AntdTypography } from 'antd';
import type { ComponentProps } from 'react';
import { Root } from './styles';

export interface ITitleProps
  extends ComponentProps<typeof AntdTypography.Title> {}

const Title = (props: ITitleProps) => {
  return <Root {...props} />;
};

export default Title;
