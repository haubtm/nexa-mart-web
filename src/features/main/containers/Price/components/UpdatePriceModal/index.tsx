import type { IPriceListResponse } from '@/dtos';
import { SvgPencilIcon } from '@/assets';
import { Button, ModalNew } from '@/lib';
import PriceForm from '../CommonForm';
import { useHook } from './hook';

interface IUpdatePriceModalProps {
  record?: IPriceListResponse['data']['content'][number] | null;
}

const UpdatePriceModal = ({ record }: IUpdatePriceModalProps) => {
  const {
    ref,
    form,
    isLoadingUpdatePrice,
    handleOpen,
    handleSubmit,
    handleCancel,
  } = useHook(record);

  return (
    <ModalNew
      ref={ref}
      width={1000}
      title={'Cập nhật bảng giá'}
      confirmLoading={isLoadingUpdatePrice}
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
      <PriceForm form={form} handleSubmit={handleSubmit} />
    </ModalNew>
  );
};

export default UpdatePriceModal;
