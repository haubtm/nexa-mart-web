import type { ISupplierListResponse } from '@/dtos';
import { SvgPencilIcon } from '@/assets';
import { Button, ModalNew } from '@/lib';
import SupplierForm from '../CommonForm';
import { useHook } from './hook';

interface IUpdateSupplierModalProps {
  record?: ISupplierListResponse['data']['content'][number] | null;
}

const UpdateSupplierModal = ({ record }: IUpdateSupplierModalProps) => {
  const {
    ref,
    form,
    isLoadingUpdateSupplier,
    handleOpen,
    handleSubmit,
    handleCancel,
  } = useHook(record);

  return (
    <ModalNew
      ref={ref}
      width={1000}
      title={'Cập nhật nhân viên'}
      confirmLoading={isLoadingUpdateSupplier}
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
      <SupplierForm form={form} handleSubmit={handleSubmit} />
    </ModalNew>
  );
};

export default UpdateSupplierModal;
