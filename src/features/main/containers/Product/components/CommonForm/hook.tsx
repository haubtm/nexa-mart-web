import type { IProductCreateRequest, IProductCreateResponse } from '@/dtos';
import {
  productImageKeys,
  useBrandList,
  useCategoryRootList,
  useProductImageCreate,
} from '@/features/main/react-query';
import { Form, useNotification } from '@/lib';
import { queryClient } from '@/providers/ReactQuery';
import { message, Upload, UploadFile, UploadProps } from 'antd';
import { createSchemaFieldRule } from 'antd-zod';
import { useMemo, useState } from 'react';
import { z } from 'zod';

export const useHook = (
  handleSubmit?: (
    values: IProductCreateRequest,
  ) => Promise<IProductCreateResponse | undefined>,
) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [modalForm] = Form.useForm<IProductCreateRequest>();
  const { mutateAsync: uploadImages } = useProductImageCreate();
  const { notify } = useNotification();

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: true,
    listType: 'picture-card',
    fileList,
    accept: 'image/*',
    beforeUpload: (file) => {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Ảnh phải nhỏ hơn 2MB!');
        return Upload.LIST_IGNORE;
      }

      const isJpgOrPng =
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'image/webp';
      if (!isJpgOrPng) {
        message.error('Chỉ hỗ trợ file JPG/PNG/WEBP!');
        return Upload.LIST_IGNORE;
      }

      if (fileList.length >= 4) {
        message.error('Chỉ được tải lên tối đa 4 ảnh!');
        return Upload.LIST_IGNORE;
      }

      return false;
    },
    onChange: ({ fileList: newFileList }) => {
      const limitedFileList = newFileList.slice(0, 4);
      setFileList(limitedFileList);
    },
    onPreview: async (file) => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj as File);
      }
      setPreviewImage(file.url || file.preview || '');
      setPreviewOpen(true);
    },
    onRemove: (file) => {
      const newFileList = fileList.filter((item) => item.uid !== file.uid);
      setFileList(newFileList);
    },
  };

  const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useCategoryRootList();

  const { data: brandsData, isLoading: isBrandsLoading } = useBrandList({});

  const [rules, Schema] = useMemo(() => {
    const Schema = z.object({
      name: z
        .string('Tên phải là chuỗi')
        .nonempty('Tên không được để trống')
        .trim(),
      categoryId: z
        .number('Id danh mục phải là số')
        .min(1, 'Vui lòng chọn danh mục'),
      brandId: z
        .number('Id thương hiệu phải là số')
        .min(1, 'Vui lòng chọn thương hiệu'),
      productType: z
        .number('Loại sản phẩm phải là số')
        .min(1, 'Vui lòng chọn loại')
        .optional()
        .default(1),
      variants: z
        .array(
          z.object({
            sku: z
              .string('SKU phải là chuỗi')
              .nonempty('SKU không được để trống')
              .trim(),
            attributes: z
              .array(
                z.object({
                  attributeId: z
                    .number('Id thuộc tính phải là số')
                    .min(1, 'Vui lòng chọn thuộc tính'),
                  value: z
                    .string('Giá trị thuộc tính phải là chuỗi')
                    .nonempty('Giá trị thuộc tính không được để trống')
                    .trim(),
                }),
              )
              .optional(),
            units: z.array(
              z.object({
                unit: z
                  .string('Đơn vị tính phải là chuỗi')
                  .nonempty('Đơn vị tính không được để trống')
                  .trim(),
                basePrice: z.preprocess(
                  (value) => Number(value),
                  z
                    .number('Giá bán lẻ phải là số')
                    .int('Giá bán lẻ phải là số nguyên')
                    .min(0, 'Giá bán lẻ không được nhỏ hơn 0'),
                ),
                cost: z.preprocess(
                  (value) => Number(value),
                  z
                    .number('Giá vốn phải là số')
                    .int('Giá vốn phải là số nguyên')
                    .min(0, 'Giá vốn không được nhỏ hơn 0'),
                ),
                barcode: z.string('Mã vạch phải là chuỗi').optional(),
                conversionValue: z
                  .preprocess(
                    (value) => Number(value),
                    z
                      .number('Giá trị quy đổi phải là số')
                      .int('Giá trị quy đổi phải là số nguyên')
                      .min(1, 'Giá trị quy đổi không được nhỏ hơn 1'),
                  )
                  .optional(),
                onHand: z
                  .preprocess(
                    (value) => Number(value),
                    z
                      .number('Tồn kho phải là số')
                      .min(0, 'Tồn kho không được nhỏ hơn 0'),
                  )
                  .optional(),
              }),
            ),
          }),
        )
        .min(1, 'Vui lòng thêm ít nhất một biến thể'),
      inventory: z
        .object({
          minQuantity: z.preprocess(
            (value) => Number(value),
            z
              .number('Số lượng tối thiểu phải là số')
              .min(0, 'Số lượng tối thiểu không được nhỏ hơn 0'),
          ),
          maxQuantity: z.preprocess(
            (value) => Number(value),
            z
              .number('Số lượng tối đa phải là số')
              .min(0, 'Số lượng tối đa không được nhỏ hơn 0'),
          ),
          onHand: z.preprocess(
            (value) => Number(value),
            z
              .number('Tồn kho phải là số')
              .min(0, 'Tồn kho không được nhỏ hơn 0'),
          ),
        })
        .optional(),
      allowsSale: z
        .boolean('Cho phép bán phải là boolean')
        .default(true)
        .optional(),
      description: z.string('Mô tả phải là chuỗi').trim().optional(),
    });

    return [createSchemaFieldRule(Schema), Schema];
  }, []);

  const onFinish = async (values: IProductCreateRequest) => {
    console.log('Received values of form: ', values);
    try {
      const parsedValues = Schema.parse(values);
      const res = await handleSubmit?.(parsedValues as IProductCreateRequest);
      if (res?.data?.id && fileList.length > 0) {
        const files = fileList
          .map((f) => f.originFileObj as File | undefined)
          .filter((f): f is File => !!f);
        await uploadImages(
          {
            productId: res.data.id,
            imageFiles: files,
          },
          {
            onSuccess: () => {
              notify('success', {
                message: 'Thành công',
                description: 'Thêm sản phẩm thành công',
              });

              queryClient.invalidateQueries({
                queryKey: productImageKeys.all,
              });
            },
            onError: (error) => {
              notify('error', {
                message: 'Thất bại',
                description: error.message || 'Có lỗi xảy ra',
              });
            },
          },
        );
      }
      modalForm?.resetFields();
      setFileList([]);
    } catch (error) {
      console.error(error);
    }
  };

  return {
    rules,
    onFinish,
    fileList,
    previewOpen,
    setPreviewOpen,
    previewImage,
    setPreviewImage,
    uploadProps,
    isCategoriesLoading,
    categoriesData,
    isBrandsLoading,
    brandsData,
    modalForm,
  };
};
