import type { ICustomerListResponse } from '@/dtos';
import { SvgPencilIcon } from '@/assets';
import { Button, ModalNew } from '@/lib';
import CustomerForm from '../CommonForm';
import { useHook } from './hook';

interface IUpdateCustomerModalProps {
  record?: ICustomerListResponse['data']['content'][number] | null;
}

const UpdateCustomerModal = ({ record }: IUpdateCustomerModalProps) => {
  const {
    ref,
    form,
    isLoadingUpdateCustomer,
    handleOpen,
    handleSubmit,
    handleCancel,
  } = useHook(record);

  return (
    <ModalNew
      ref={ref}
      width={1000}
      title={'Cập nhật khách hàng'}
      confirmLoading={isLoadingUpdateCustomer}
      onOk={form.submit}
      onCancel={handleCancel}
      openButton={
        <Button
          type="text"
          icon={<SvgPencilIcon width={18} height={18} />}
          onClick={handleOpen}
        />
      }
    >
      <CustomerForm form={form} handleSubmit={handleSubmit} />
    </ModalNew>
  );
};

export default UpdateCustomerModal;
