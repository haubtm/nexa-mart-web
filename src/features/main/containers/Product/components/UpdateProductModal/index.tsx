import type { IProductListResponse } from '@/dtos';
import { SvgPencilIcon } from '@/assets';
import { Button, ModalNew } from '@/lib';
import ProductForm from '../CommonForm';
import { useHook } from './hook';

interface IUpdateProductModalProps {
  record?: IProductListResponse['data']['products'][number] | null;
}

const UpdateProductModal = ({ record }: IUpdateProductModalProps) => {
  const {
    ref,
    form,
    isLoadingUpdateProduct,
    handleOpen,
    handleSubmit,
    handleCancel,
  } = useHook(record);

  return (
    <ModalNew
      ref={ref}
      width={1400}
      title={'Cập nhật sản phẩm'}
      confirmLoading={isLoadingUpdateProduct}
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
      <ProductForm
        form={form}
        handleSubmit={handleSubmit}
        productId={record?.id}
      />
    </ModalNew>
  );
};

export default UpdateProductModal;
