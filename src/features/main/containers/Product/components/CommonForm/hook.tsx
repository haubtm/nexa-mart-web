import type { IProductCreateRequest, IProductCreateResponse } from '@/dtos';
import {
  productImageKeys,
  useBrandList,
  useCategoryRootList,
  useProductImageById,
  useProductImageCreate,
} from '@/features/main/react-query';
import { Form, useNotification } from '@/lib';
import { queryClient } from '@/providers/ReactQuery';
import { message, Upload, UploadFile, UploadProps } from 'antd';
import { createSchemaFieldRule } from 'antd-zod';
import { useEffect, useMemo, useRef, useState } from 'react';
import { z } from 'zod';

export const useHook = (
  handleSubmit?: (
    values: IProductCreateRequest,
  ) => Promise<IProductCreateResponse | undefined>,
  productId?: number,
  isUpdate: boolean = false, // ✅ THÊM THAM SỐ
) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [modalForm] = Form.useForm<IProductCreateRequest>();
  const { mutateAsync: uploadImages } = useProductImageCreate();
  const { notify } = useNotification();

  const { data: imageData, isSuccess } = useProductImageById({
    productId: productId!,
  });

  const preloadedOnceRef = useRef<number | null>(null);

  useEffect(() => {
    if (!productId) return;
    if (!isSuccess) return;
    if (preloadedOnceRef.current === productId) return;

    const images = imageData?.data ?? [];
    if (Array.isArray(images) && images.length > 0) {
      const mapped: UploadFile[] = images.slice(0, 4).map((img) => ({
        uid: String(img.imageId),
        name: img.imageAlt ?? `image-${img.imageId}`,
        status: 'done',
        url: img.imageUrl,
      }));
      setFileList((curr) => (curr.length === 0 ? mapped : curr));
    }
    preloadedOnceRef.current = productId;
  }, [productId, imageData, isSuccess]);

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
      setPreviewImage(file.url || (file.preview as string) || '');
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
      name: z.string().nonempty('Tên không được để trống').trim(),
      categoryId: z.number().min(1, 'Vui lòng chọn danh mục'),
      brandId: z.number().min(1, 'Vui lòng chọn thương hiệu'),
      description: z.string().trim().optional(),
      code: z.string().trim().optional(),
      units: z
        .array(
          z.object({
            id: z.number().optional(),
            unitName: z
              .string()
              .nonempty('Tên đơn vị không được để trống')
              .trim(),
            conversionValue: z.number().min(1, 'Hệ số quy đổi phải lớn hơn 0'),
            isBaseUnit: z.boolean().optional(),
            barcode: z.string().trim().nonempty('Mã vạch không được để trống'),
          }),
        )
        .min(1, 'Vui lòng thêm ít nhất một đơn vị')
        .refine((units) => units.filter((u) => u?.isBaseUnit).length === 1, {
          message: 'Phải có đúng 1 đơn vị cơ bản',
          path: ['units'],
        })
        .refine(
          (units) =>
            units.every(
              (u) => !u?.isBaseUnit || Number(u.conversionValue) === 1,
            ),
          {
            message: 'Đơn vị cơ bản phải có hệ số quy đổi = 1',
            path: ['units'],
          },
        ),
    });

    return [createSchemaFieldRule(Schema), Schema] as const;
  }, []);

  const onFinish = async (values: IProductCreateRequest) => {
    try {
      const parsedValues = Schema.parse(values);
      const res = await handleSubmit?.(parsedValues as IProductCreateRequest);

      const targetProductId = res?.data?.id ?? productId;

      // chỉ upload file mới (có originFileObj)
      const newFiles = fileList
        .map((f) => f.originFileObj as File | undefined)
        .filter((f): f is File => !!f);

      if (targetProductId && newFiles.length > 0) {
        await uploadImages(
          { productId: targetProductId, imageFiles: newFiles },
          {
            onSuccess: () => {
              notify('success', {
                message: 'Thành công',
                description: 'Tải ảnh lên thành công',
              });
              queryClient.invalidateQueries({
                queryKey: productImageKeys.detail(targetProductId),
              });
            },
            onError: (error: any) => {
              notify('error', {
                message: 'Thất bại',
                description: error?.message || 'Có lỗi xảy ra khi tải ảnh',
              });
            },
          },
        );
      }

      // ✅ Chỉ reset khi KHÔNG phải update (tạo mới)
      if (!isUpdate) {
        // (giữ behavior cũ: nếu tạo mới thì reset)
        if (!productId) {
          modalForm?.resetFields();
          setFileList([]);
        }
      }
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
