import type { ICustomerListResponse } from '@/dtos';
import { type IModalRef, ModalNew } from '@/lib';
import { useHook } from './hook';
import CustomerForm from '../CommonForm';

interface IDetailCustomerModalProps {
  record?: ICustomerListResponse['data']['content'][number];
  ref?: React.RefObject<IModalRef | null>;
}

const DetailCustomerModal = (props: IDetailCustomerModalProps) => {
  const { ref, record } = props;
  const { form, handleCancel } = useHook(record, ref);
  return (
    <ModalNew
      ref={ref}
      width={1000}
      title={'Xem khách hàng'}
      onOk={form.submit}
      onCancel={handleCancel}
      footer={null}
      openButton={<></>}
    >
      <CustomerForm handleSubmit={form.submit} form={form} readonly={true} />
    </ModalNew>
  );
};

export default DetailCustomerModal;
