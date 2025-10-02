import type { IPromotionListResponse } from '@/dtos';
import { SvgPencilIcon } from '@/assets';
import { Button, ModalNew } from '@/lib';
import PromotionLineForm from '../CommonLineForm';
import { useHook } from './hook';

interface IUpdatePromotionModalProps {
  record?:
    | IPromotionListResponse['data']['content'][number]['promotionLines'][number]
    | null;
}

const UpdatePromotionLineModal = ({ record }: IUpdatePromotionModalProps) => {
  const {
    ref,
    form,
    isLoadingUpdatePromotionLine,
    handleOpen,
    handleSubmit,
    handleCancel,
  } = useHook(record);

  return (
    <ModalNew
      ref={ref}
      width={1000}
      title={'Cập nhật chương trình khuyến mãi'}
      confirmLoading={isLoadingUpdatePromotionLine}
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
      <PromotionLineForm form={form} handleSubmit={handleSubmit} />
    </ModalNew>
  );
};

export default UpdatePromotionLineModal;
