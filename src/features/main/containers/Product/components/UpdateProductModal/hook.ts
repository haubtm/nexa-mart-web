import type {
  IProductAddUnitsRequest,
  IProductCreateRequest,
  IProductListResponse,
} from '@/dtos';
import {
  productKeys,
  useProductAddUnits,
  useProductUnitDelete,
  useProductUnitUpdate,
  useProductUpdate,
} from '@/features/main/react-query';
import { Form, type IModalRef, useNotification } from '@/lib';
import { queryClient } from '@/providers/ReactQuery';
import { type MouseEvent, useMemo, useRef, useCallback } from 'react';

type UnitForm = NonNullable<IProductCreateRequest['units']>[number];

export const useHook = (
  record?: IProductListResponse['data']['products'][number] | null,
) => {
  const ref = useRef<IModalRef>(null);
  const [form] = Form.useForm<IProductCreateRequest>();
  const { mutateAsync: updateProduct, isPending: isLoadingUpdateProduct } =
    useProductUpdate();
  const { mutateAsync: addUnit } = useProductAddUnits();
  const { mutateAsync: updateUnit } = useProductUnitUpdate();
  const { mutateAsync: deleteUnit } = useProductUnitDelete();

  const { notify } = useNotification();

  // ===== Helpers =====
  const normalizeBaseUnit = (units: UnitForm[] = []): UnitForm[] => {
    if (!units.length)
      return [{ unitName: '', conversionValue: 1, isBaseUnit: true }];
    let baseIdx = units.findIndex((u) => u.isBaseUnit);
    if (baseIdx < 0) baseIdx = 0;
    return units.map((u, i) => ({
      ...u,
      isBaseUnit: i === baseIdx,
      conversionValue: i === baseIdx ? 1 : Number(u.conversionValue || 1),
    }));
  };

  const isChanged = (a: UnitForm, b: UnitForm) =>
    (a.unitName ?? '') !== (b.unitName ?? '') ||
    (a.barcode ?? '') !== (b.barcode ?? '') ||
    Number(a.conversionValue ?? 1) !== Number(b.conversionValue ?? 1) ||
    Boolean(a.isBaseUnit) !== Boolean(b.isBaseUnit);

  const oldUnits: UnitForm[] = useMemo(() => {
    if (!record?.units) return [];
    return record.units.map((u) => ({
      id: u.id,
      unitName: u.unitName ?? '',
      barcode: u.barcode ?? '',
      conversionValue: Number(u.conversionValue ?? 1),
      isBaseUnit: !!u.isBaseUnit,
    }));
  }, [record]);

  const handleCancel = (e?: MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();
    ref?.current?.hide();
  };

  const handleSubmit = async (values: IProductCreateRequest) => {
    if (!record) return;

    // 1) Chuẩn hoá base-unit
    const nextUnits = normalizeBaseUnit(values.units ?? []);

    // 2) Xây map để diff
    const oldMap = new Map<number, UnitForm>();
    oldUnits.forEach((u) => u.id && oldMap.set(u.id, u));

    const seen = new Set<number>();
    const toCreate: Omit<UnitForm, 'id'>[] = [];
    const toUpdate: UnitForm[] = [];
    const toDeleteIds: number[] = [];

    for (const u of nextUnits) {
      if (!u.id) {
        toCreate.push({
          unitName: u.unitName,
          barcode: u.barcode,
          conversionValue: Number(u.conversionValue ?? 1),
          isBaseUnit: !!u.isBaseUnit,
        });
      } else {
        const prev = oldMap.get(u.id);
        if (prev) {
          seen.add(u.id);
          if (isChanged(prev, u)) toUpdate.push(u);
        } else {
          // có id lạ: cứ xem là update full
          toUpdate.push(u);
        }
      }
    }
    for (const ou of oldUnits) {
      if (ou.id && !seen.has(ou.id)) toDeleteIds.push(ou.id);
    }

    // 3) Chạy các request song song và chờ đủ
    const jobs: Promise<any>[] = [];

    // tạo mới
    for (const u of toCreate) {
      jobs.push(
        addUnit({ productId: record.id, unit: u } as IProductAddUnitsRequest),
      );
    }

    // cập nhật CHỈ những unit đã đổi
    for (const u of toUpdate) {
      jobs.push(
        updateUnit({
          productId: record.id,
          unitId: u.id!, // chắc chắn có
          unitName: u.unitName,
          barcode: u.barcode,
          conversionValue: Number(u.conversionValue ?? 1),
          isBaseUnit: !!u.isBaseUnit,
        }),
      );
    }

    // xoá
    for (const id of toDeleteIds) {
      jobs.push(deleteUnit({ productId: record.id, unitId: id }));
    }

    const results = await Promise.allSettled(jobs);
    const failed = results.filter((r) => r.status === 'rejected');
    const ok = results.length - failed.length;

    if (ok) {
      notify('success', {
        message: 'Đã lưu đơn vị',
        description: `Thành công: ${ok}${failed.length ? ` • Thất bại: ${failed.length}` : ''}`,
      });
    }
    if (failed.length) {
      notify('error', {
        message: 'Một số đơn vị cập nhật thất bại',
        description: 'Vui lòng kiểm tra lại và thử lại.',
      });
    }

    // 4) Cập nhật thông tin chung sản phẩm
    const updateProductPromise = await updateProduct(
      {
        id: record.id,
        name: values.name,
        categoryId: values.categoryId,
        brandId: values.brandId,
        description: values.description,
        code: values.code,
      },
      {
        onSuccess: () => {
          notify('success', {
            message: 'Đã cập nhật sản phẩm',
            description: 'Thông tin chung đã được lưu.',
          });
        },
      },
    );

    // 5) Invalidate & đóng modal
    await queryClient.invalidateQueries({ queryKey: productKeys.all });
    handleCancel();
    return updateProductPromise;
  };

  const mapRecordToForm = useCallback(() => {
    if (!record) return {};
    return {
      name: record?.name ?? '',
      categoryId: record?.categoryId ?? undefined,
      brandId: record?.brandId ?? undefined,
      description: record?.description ?? '',
      units: oldUnits,
    } as Partial<IProductCreateRequest>;
  }, [record, oldUnits]);

  const handleOpen = () => {
    if (!record) return;
    ref?.current?.open();
    form.resetFields();
    const values = mapRecordToForm();
    form.setFieldsValue(values);
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
