import type { IPromotionListResponse } from '@/dtos';
import { SvgPencilIcon } from '@/assets';
import { Button, EPromotionType, ModalNew } from '@/lib';
import { useHook } from './hook';
import PromotionDetailCreateForm from '../CommonDetailForm';

interface IUpdatePromotionDetailModalProps {
  record?:
    | IPromotionListResponse['data']['content'][number]['promotionLines'][number]['details'][number]
    | null;
  promotionType: EPromotionType;
}

const UpdatePromotionDetailModal = ({
  record,
  promotionType,
}: IUpdatePromotionDetailModalProps) => {
  const {
    ref,
    form,
    isLoadingUpdatePromotionDetail,
    handleOpen,
    handleSubmit,
    handleCancel,
  } = useHook(record, promotionType);

  return (
    <ModalNew
      ref={ref}
      width={1000}
      title={'Cập nhật chi tiết chương trình khuyến mãi'}
      confirmLoading={isLoadingUpdatePromotionDetail}
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
      <PromotionDetailCreateForm
        form={form}
        handleSubmit={handleSubmit}
        promotionType={promotionType}
        isUpdate={true}
      />
    </ModalNew>
  );
};

export default UpdatePromotionDetailModal;
