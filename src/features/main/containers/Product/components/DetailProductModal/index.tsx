import type { IProductListResponse } from '@/dtos';
import { type IModalRef, ModalNew } from '@/lib';
import { useHook } from './hook';
import ProductForm from '../CommonForm';

interface IDetailProductModalProps {
  record?: IProductListResponse['data']['products'][number];
  ref?: React.RefObject<IModalRef | null>;
}

const DetailProductModal = (props: IDetailProductModalProps) => {
  const { ref, record } = props;
  const { form, handleCancel } = useHook(record, ref);
  return (
    <ModalNew
      ref={ref}
      title={'Xem thông tin sản phẩm'}
      onOk={form.submit}
      onCancel={handleCancel}
      footer={null}
      openButton={<></>}
    >
      <ProductForm form={form} />
    </ModalNew>
  );
};

export default DetailProductModal;
