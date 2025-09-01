import { SvgPlusIcon } from '@/assets';
import { Button, ModalNew } from '@/lib';
import EmployeeForm from '../CommonForm';
import { useHook } from './hook';

const CreateEmployeeModal = () => {
  const { ref, form, isLoadingCreateRoom, handleSubmit, handleCancel } =
    useHook();

  return (
    <ModalNew
      ref={ref}
      width={1000}
      title={'Thêm nhân viên'}
      confirmLoading={isLoadingCreateRoom}
      onOk={form.submit}
      onCancel={handleCancel}
      openButton={
        <Button
          type="primary"
          icon={<SvgPlusIcon width={12} height={12} />}
          onClick={() => ref?.current?.open()}
        >
          Thêm nhân viên
        </Button>
      }
    >
      <EmployeeForm form={form} handleSubmit={handleSubmit} />
    </ModalNew>
  );
};

export default CreateEmployeeModal;
