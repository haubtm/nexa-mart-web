import { Modal as AntdModal } from 'antd';
import {
  type ComponentProps,
  useImperativeHandle,
  useState,
  type Ref,
  type ReactNode,
} from 'react';
import Button from '../Button';
import { Text } from '../typography';

export interface IModalRef {
  visible: boolean;
  hide: () => void;
  open: () => void;
}

export interface IModalNewProps extends ComponentProps<typeof AntdModal> {
  ref?: Ref<IModalRef>;
  openButton?: ReactNode;
  openButtonIcon?: ReactNode;
  openButtonTitle?: string;
}

const ModalNew = (props: IModalNewProps) => {
  const {
    ref,
    children,
    width,
    style,
    okText,
    cancelText,
    closable,
    maskClosable,
    openButton,
    openButtonIcon,
    openButtonTitle,
    ...rest
  } = props;
  const [visible, setVisible] = useState(false);

  const hide = () => {
    setVisible(false);
  };

  const open = () => {
    setVisible(true);
  };

  useImperativeHandle(ref, () => {
    return {
      visible,
      hide,
      open,
    };
  }, [visible]);

  return (
    <>
      {openButton ? (
        openButton
      ) : (
        <Button onClick={open} icon={openButtonIcon}>
          {openButtonTitle && <Text>{openButtonTitle}</Text>}
        </Button>
      )}

      <AntdModal
        open={visible}
        width={width ?? 600}
        style={{ top: 10, ...style }}
        okText={okText ?? 'Xác nhận'}
        cancelText={cancelText ?? 'Hủy'}
        closable={closable ?? true}
        maskClosable={maskClosable ?? false}
        {...rest}
      >
        {children}
      </AntdModal>
    </>
  );
};

export default ModalNew;
