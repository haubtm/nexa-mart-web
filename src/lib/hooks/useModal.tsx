import type { ModalFuncProps } from 'antd';
import { App } from '../components';

export const useModal = () => {
  const { modal: modalAntd } = App.useApp();

  const modal = (type: keyof typeof modalAntd, props: ModalFuncProps) => {
    return modalAntd[type]({
      ...props,
      className: 'kng-modal',
      okText: props.okText ?? 'Xác nhận',
      cancelText: props.cancelText ?? 'Hủy',
      maskClosable: props.maskClosable ?? true,
    });
  };

  return {
    modal,
  };
};
