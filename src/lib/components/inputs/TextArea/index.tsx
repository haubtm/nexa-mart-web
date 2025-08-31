import { Input as AntdInput } from 'antd';
import type { ComponentProps } from 'react';
import { Root } from './styles';

export interface ITextAreaProps
  extends ComponentProps<typeof AntdInput.TextArea> {}

const TextArea = (props: ITextAreaProps) => {
  const { autoSize, size, ...rest } = props;

  return (
    <Root
      autoSize={
        autoSize ?? {
          minRows: 4,
          maxRows: 10,
        }
      }
      size={size ?? 'large'}
      {...rest}
    />
  );
};

export default TextArea;
