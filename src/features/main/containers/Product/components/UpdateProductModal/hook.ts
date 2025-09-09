import type { IProductCreateRequest, IProductListResponse } from '@/dtos';
import { productKeys, useProductUpdate } from '@/features/main/react-query';
import { Form, type IModalRef, useNotification } from '@/lib';
import { queryClient } from '@/providers/ReactQuery';
import { type MouseEvent, useRef } from 'react';

export const useHook = (
  record?: IProductListResponse['data'][number] | null,
) => {
  const ref = useRef<IModalRef>(null);
  const [form] = Form.useForm<IProductCreateRequest>();
  const { mutateAsync: updateProduct, isPending: isLoadingUpdateProduct } =
    useProductUpdate();
  const { notify } = useNotification();
  const handleCancel = (e?: MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();
    ref?.current?.hide();
  };

  const handleSubmit = async (values: IProductCreateRequest) => {
    if (!record) {
      return;
    }

    await updateProduct(
      {
        id: record.id,
        name: values.name,
        additionalUnits: values.additionalUnits,
        attributes: values.attributes,
        baseUnit: values.baseUnit,
        categoryId: values.categoryId,
        inventory: values.inventory,
        productType: values.productType,
        allowsSale: values.allowsSale,
        description: values.description,
      },
      {
        onSuccess: () => {
          notify('success', {
            message: 'Thành công',
            description: 'Cập nhật thông tin sản phẩm thành công',
          });

          queryClient.invalidateQueries({
            queryKey: productKeys.all,
          });
        },
      },
    );

    handleCancel();
  };

  const handleOpen = () => {
    ref?.current?.open();
    form.setFieldsValue({
      ...record,
    });
  };

  return {
    ref,
    form,
    isLoadingUpdateProduct,
    handleOpen,
    handleSubmit,
    handleCancel,
  };
};
