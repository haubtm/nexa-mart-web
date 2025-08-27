import { Typography as AntdTypography } from 'antd';
import type { ComponentProps } from 'react';
import { Root } from './styles';

export interface ITextProps
  extends ComponentProps<typeof AntdTypography.Text> {}

const Text = (props: ITextProps) => {
  return <Root {...props} />;
};

export default Text;
