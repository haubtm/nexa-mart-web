import { Input as AntdInput } from 'antd';
import { type ComponentProps, useRef } from 'react';
import { Root } from './styles';

export interface IInputOtpProps extends ComponentProps<typeof AntdInput.OTP> {}

const InputOtp = (props: IInputOtpProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handlePaste = () => {
    setTimeout(() => {
      const inputs = wrapperRef.current?.querySelectorAll('input');
      inputs?.forEach((input) => input.blur());
    }, 300);
  };

  return (
    <Root ref={wrapperRef}>
      <AntdInput.OTP {...props} onPaste={handlePaste} />
    </Root>
  );
};

export default InputOtp;
