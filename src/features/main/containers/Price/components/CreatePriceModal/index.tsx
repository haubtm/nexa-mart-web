import { SvgPlusIcon } from '@/assets';
import { Button, ModalNew } from '@/lib';
import PriceForm from '../CommonForm';
import { useHook } from './hook';

const CreatePriceModal = () => {
  const { ref, form, isLoadingCreatePrice, handleSubmit, handleCancel } =
    useHook();

  return (
    <ModalNew
      ref={ref}
      width={1000}
      title={'Thêm bảng giá'}
      confirmLoading={isLoadingCreatePrice}
      onOk={form.submit}
      onCancel={handleCancel}
      openButton={
        <Button
          type="primary"
          icon={<SvgPlusIcon width={12} height={12} />}
          onClick={() => ref?.current?.open()}
        >
          Thêm bảng giá
        </Button>
      }
    >
      <PriceForm
        form={form}
        handleSubmit={handleSubmit}
        enableDetails={false}
      />
    </ModalNew>
  );
};

export default CreatePriceModal;
