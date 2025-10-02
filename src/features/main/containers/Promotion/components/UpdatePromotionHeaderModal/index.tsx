import type { IPromotionListResponse } from '@/dtos';
import { SvgPencilIcon } from '@/assets';
import { Button, ModalNew } from '@/lib';
import PromotionHeaderForm from '../CommonHeaderForm';
import { useHook } from './hook';

interface IUpdatePromotionModalProps {
  record?: IPromotionListResponse['data']['content'][number] | null;
}

const UpdatePromotionHeaderModal = ({ record }: IUpdatePromotionModalProps) => {
  const {
    ref,
    form,
    isLoadingUpdatePromotionHeader,
    handleOpen,
    handleSubmit,
    handleCancel,
  } = useHook(record);

  return (
    <ModalNew
      ref={ref}
      width={1000}
      title={'Cập nhật chương trình khuyến mãi'}
      confirmLoading={isLoadingUpdatePromotionHeader}
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
      <PromotionHeaderForm form={form} handleSubmit={handleSubmit} />
    </ModalNew>
  );
};

export default UpdatePromotionHeaderModal;
