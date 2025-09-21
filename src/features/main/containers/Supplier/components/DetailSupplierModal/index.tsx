import type { ISupplierListResponse } from '@/dtos';
import { type IModalRef, ModalNew } from '@/lib';
import { useHook } from './hook';
import SupplierForm from '../CommonForm';

interface IDetailSupplierModalProps {
  record?: ISupplierListResponse['data']['content'][number];
  ref?: React.RefObject<IModalRef | null>;
}

const DetailSupplierModal = (props: IDetailSupplierModalProps) => {
  const { ref, record } = props;
  const { form, handleCancel } = useHook(record, ref);
  return (
    <ModalNew
      ref={ref}
      title={'Xem nhà cung cấp'}
      onOk={form.submit}
      onCancel={handleCancel}
      footer={null}
      openButton={<></>}
    >
      <SupplierForm handleSubmit={form.submit} form={form} readonly={true} />
    </ModalNew>
  );
};

export default DetailSupplierModal;
