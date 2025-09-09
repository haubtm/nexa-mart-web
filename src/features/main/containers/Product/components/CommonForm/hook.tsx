import type { IProductCreateRequest } from '@/dtos';
import { message, UploadFile, UploadProps } from 'antd';
import { createSchemaFieldRule } from 'antd-zod';
import { useMemo, useState } from 'react';
import { z } from 'zod';

export const useHook = (
  handleSubmit: (values: IProductCreateRequest) => void,
) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [additionalUnits, setAdditionalUnits] = useState<
    IProductCreateRequest['additionalUnits'][]
  >([]);

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: true,
    listType: 'picture-card',
    fileList,
    beforeUpload: (file) => {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Ảnh phải nhỏ hơn 2MB!');
        return false;
      }

      const isJpgOrPng =
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'image/webp';
      if (!isJpgOrPng) {
        message.error('Chỉ hỗ trợ file JPG/PNG/WEBP!');
        return false;
      }

      if (fileList.length >= 4) {
        message.error('Chỉ được tải lên tối đa 4 ảnh!');
        return false;
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

  const [rules, Schema] = useMemo(() => {
    const Schema = z.object({
      name: z
        .string('Tên phải là chuỗi')
        .nonempty('Tên không được để trống')
        .trim(),
      categoryId: z
        .number('Id danh mục phải là số')
        .min(1, 'Vui lòng chọn danh mục'),
      productType: z
        .number('Loại sản phẩm phải là số')
        .min(1, 'Vui lòng chọn loại'),
      baseUnit: z.object({
        unit: z
          .string('Đơn vị tính phải là chuỗi')
          .nonempty('Đơn vị tính không được để trống')
          .trim(),
        basePrice: z
          .number('Giá bán lẻ phải là số')
          .min(0, 'Giá bán lẻ không được nhỏ hơn 0'),
        cost: z
          .number('Giá vốn phải là số')
          .min(0, 'Giá vốn không được nhỏ hơn 0'),
        barcode: z.string('Mã vạch phải là chuỗi'),
      }),
      additionalUnits: z
        .array(
          z.object({
            unit: z
              .string('Đơn vị tính phải là chuỗi')
              .nonempty('Đơn vị tính không được để trống')
              .trim(),
            basePrice: z
              .number('Giá bán lẻ phải là số')
              .min(0, 'Giá bán lẻ không được nhỏ hơn 0'),
            cost: z
              .number('Giá vốn phải là số')
              .min(0, 'Giá vốn không được nhỏ hơn 0'),
            barcode: z.string('Mã vạch phải là chuỗi').optional(),
          }),
        )
        .optional(),
      attributes: z
        .array(
          z.object({
            attributeId: z
              .number('Id thuộc tính phải là số')
              .min(1, 'Vui lòng chọn thuộc tính'),
          }),
        )
        .optional(),
      inventory: z
        .object({
          minQuantity: z
            .number('Số lượng tối thiểu phải là số')
            .min(0, 'Số lượng tối thiểu không được nhỏ hơn 0'),
        })
        .optional(),
      allowsSale: z.boolean('Cho phép bán phải là boolean'),
      description: z.string('Mô tả phải là chuỗi').trim().optional(),
    });

    return [createSchemaFieldRule(Schema), Schema];
  }, []);

  const onFinish = (values: IProductCreateRequest) => {
    try {
      const parsedValues = Schema.parse(values);

      handleSubmit?.(parsedValues as IProductCreateRequest);
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
  };
};
