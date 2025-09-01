import type { IEmployeeListResponse } from '@/dtos';
import { type IModalRef, ModalNew } from '@/lib';
import { useHook } from './hook';
import EmployeeForm from '../CommonForm';

interface IDetailEmployeeModalProps {
  record?: IEmployeeListResponse['data'][number];
  ref?: React.RefObject<IModalRef | null>;
}

const DetailEmployeeModal = (props: IDetailEmployeeModalProps) => {
  const { ref, record } = props;
  const { form, handleCancel } = useHook(record, ref);
  return (
    <ModalNew
      ref={ref}
      title={'Xem nhân viên'}
      onOk={form.submit}
      onCancel={handleCancel}
      footer={null}
      openButton={<></>}
    >
      <EmployeeForm handleSubmit={form.submit} form={form} readonly={true} />
    </ModalNew>
  );
};

export default DetailEmployeeModal;
