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

    return await updateProduct(
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
          handleCancel();
        },
      },
    );
  };

  const handleOpen = () => {
    if (!record) return;

    ref?.current?.open();

    form.setFieldsValue({
      name: record.name,
      categoryId: record.category?.id,
      productType: record.productType,
      baseUnit: {
        unit: record?.unit,
        basePrice: record?.basePrice,
        cost: record?.cost,
        barcode: record?.barcode,
      },
      additionalUnits: record?.productUnits
        ?.filter((unit) => unit.conversionValue !== 1)
        .map((unit) => ({
          unit: unit.unit,
          basePrice: unit.basePrice,
          conversionValue: unit.conversionValue,
          barcode: unit.barcode,
        })),
      attributes: record?.attributes?.reduce((acc: any[], cur) => {
        const existing = acc.find((a) => a.attributeId === cur.id);
        if (existing) {
          existing.value.push(cur.value);
        } else {
          acc.push({ attributeId: cur.id, value: [cur.value] });
        }
        return acc;
      }, []),
      inventory: {
        minQuantity: record.minQuantity,
        maxQuantity: record.maxQuantity,
        onHand: record.onHand,
      },
      description: record.description,
      allowsSale: record.allowsSale,
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
