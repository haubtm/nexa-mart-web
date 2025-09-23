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
    const UnitSchema = z.object({
      unit: z
        .string('Đơn vị tính phải là chuỗi')
        .nonempty('Đơn vị tính không được để trống')
        .trim(),
      conversionValue: z
        .preprocess(
          (v) => Number(v),
          z.number().int('Giá trị quy đổi phải là số nguyên').min(1),
        )
        .optional(),
      barcode: z.string().trim().optional(),
      variantCode: z.string().trim().optional(),
      isBaseUnit: z.boolean().optional(),
    });

    const Schema = z.object({
      name: z.string().nonempty('Tên không được để trống').trim(),
      categoryId: z.number().min(1, 'Vui lòng chọn danh mục').optional(),
      brandId: z.number().min(1, 'Vui lòng chọn thương hiệu').optional(),
      productType: z.number().min(1).optional().default(1),
      variants: z
        .array(
          z.object({
            attributes: z
              .array(
                z.object({
                  attributeId: z.number().min(1),
                  value: z.string().nonempty().trim(),
                }),
              )
              .optional(),
            units: z.array(UnitSchema),
          }),
        )
        .min(1, 'Vui lòng thêm ít nhất một biến thể')
        .optional(),
      description: z.string().trim().optional(),
    });

    return [createSchemaFieldRule(Schema), Schema] as const;
  }, []);

  const onFinish = async (values: IProductCreateRequest) => {
    try {
      const hasVariants =
        Array.isArray(values.variants) && values.variants.length > 0;
      if (!hasVariants) {
        const base = values.baseUnit as any;
        if (!base?.unit) {
          notify('error', {
            message: 'Thất bại',
            description: 'Vui lòng nhập đơn vị cơ bản',
          });
        }

        values.variants = [
          {
            attributes: [],
            units: [
              {
                unit: String(base.unit),
                conversionValue: 1,
                isBaseUnit: true,
              },
            ],
          } as any,
        ];
      }
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
