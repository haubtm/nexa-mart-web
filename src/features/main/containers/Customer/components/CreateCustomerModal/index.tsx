import { SvgPlusIcon } from '@/assets';
import { Button, ModalNew } from '@/lib';
import CustomerForm from '../CommonForm';
import { useHook } from './hook';

const CreateCustomerModal = () => {
  const { ref, form, isLoadingCreateRoom, handleSubmit, handleCancel } =
    useHook();

  return (
    <ModalNew
      ref={ref}
      width={1000}
      title={'Thêm khách hàng'}
      confirmLoading={isLoadingCreateRoom}
      onOk={form.submit}
      onCancel={handleCancel}
      openButton={
        <Button
          type="primary"
          icon={<SvgPlusIcon width={12} height={12} />}
          onClick={() => ref?.current?.open()}
        >
          Thêm khách hàng
        </Button>
      }
    >
      <CustomerForm form={form} handleSubmit={handleSubmit} />
    </ModalNew>
  );
};

export default CreateCustomerModal;
