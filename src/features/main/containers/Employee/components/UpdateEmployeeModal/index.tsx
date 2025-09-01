import type { IEmployeeListResponse } from '@/dtos';
import { SvgPencilIcon } from '@/assets';
import { Button, ModalNew } from '@/lib';
import EmployeeForm from '../CommonForm';
import { useHook } from './hook';

interface IUpdateEmployeeModalProps {
  record?: IEmployeeListResponse['data'][number] | null;
}

const UpdateEmployeeModal = ({ record }: IUpdateEmployeeModalProps) => {
  const {
    ref,
    form,
    isLoadingUpdateEmployee,
    handleOpen,
    handleSubmit,
    handleCancel,
  } = useHook(record);

  return (
    <ModalNew
      ref={ref}
      width={1000}
      title={'Cập nhật nhân viên'}
      confirmLoading={isLoadingUpdateEmployee}
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
      <EmployeeForm form={form} handleSubmit={handleSubmit} />
    </ModalNew>
  );
};

export default UpdateEmployeeModal;
