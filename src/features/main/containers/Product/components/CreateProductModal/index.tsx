import { SvgPlusIcon } from '@/assets';
import { Button, ModalNew } from '@/lib';
import ProductForm from '../CommonForm';
import { useHook } from './hook';

const CreateProductModal = () => {
  const { ref, form, isLoadingCreateRoom, handleSubmit, handleCancel } =
    useHook();

  return (
    <ModalNew
      ref={ref}
      width={1000}
      title={'Thêm sản phẩm'}
      confirmLoading={isLoadingCreateRoom}
      onOk={form.submit}
      onCancel={handleCancel}
      openButton={
        <Button
          type="primary"
          icon={<SvgPlusIcon width={12} height={12} />}
          onClick={() => ref?.current?.open()}
        >
          Thêm sản phẩm
        </Button>
      }
    >
      <ProductForm form={form} handleSubmit={handleSubmit} />
    </ModalNew>
  );
};

export default CreateProductModal;
