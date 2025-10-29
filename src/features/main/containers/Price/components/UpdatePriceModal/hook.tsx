import type { IPriceCreateRequest, IPriceListResponse } from '@/dtos';
import {
  priceKeys,
  usePriceActivate,
  usePriceDetailDelete,
  usePricePause,
  usePriceUpdate,
} from '@/features/main/react-query';
import { Form, type IModalRef, PriceStatus, useNotification } from '@/lib';
import { queryClient } from '@/providers/ReactQuery';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

const VN_TZ = 'Asia/Ho_Chi_Minh';
import { type MouseEvent, useRef } from 'react';

type CurrentDetail = { productUnitId: number; salePrice: number };
type OldDetail = {
  priceDetailId: number;
  productUnitId: number;
  salePrice: number;
};

const buildPriceDetailsForUpdate = (
  current: CurrentDetail[],
  oldItems: OldDetail[],
) => {
  const oldByVar = new Map(oldItems.map((o) => [o.productUnitId, o]));
  const curByVar = new Map(current.map((c) => [c.productUnitId, c]));

  // Giữ/cập nhật item còn tồn tại
  const updatedOrSame = current
    .filter((c) => oldByVar.has(c.productUnitId))
    .map((c) => {
      const old = oldByVar.get(c.productUnitId)!;
      return {
        priceDetailId: old.priceDetailId ?? undefined,
        productUnitId: c.productUnitId, // = units.id
        salePrice: Number(c.salePrice ?? 0),
        deleted: false,
      };
    });

  // Tạo mới
  const created = current
    .filter((c) => !oldByVar.has(c.productUnitId))
    .map((c) => ({
      priceDetailId: undefined, // đổi thành null nếu BE thích null
      productUnitId: c.productUnitId, // = units.id
      salePrice: Number(c.salePrice ?? 0),
      deleted: false,
    }));

  // Đánh dấu xoá
  const deleted = oldItems
    .filter((o) => !curByVar.has(o.productUnitId))
    .map((o) => ({
      priceDetailId: o.priceDetailId ?? undefined,
      productUnitId: o.productUnitId, // = units.id
      salePrice: Number(o.salePrice ?? 0), // gửi kèm (an toàn nếu BE kiểm tra)
      deleted: true,
    }));

  return [...updatedOrSame, ...created, ...deleted];
};

export const useHook = (
  record?: IPriceListResponse['data']['content'][number] | null,
) => {
  const ref = useRef<IModalRef>(null);
  const [form] = Form.useForm<IPriceCreateRequest>();
  const { mutateAsync: updatePrice, isPending: isLoadingUpdatePrice } =
    usePriceUpdate();
  const { mutateAsync: deletePriceDetail } = usePriceDetailDelete();
  const { notify } = useNotification();
  const { mutateAsync: activatePrice } = usePriceActivate();
  const { mutateAsync: pausePrice } = usePricePause();

  const handleCancel = (e?: MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();
    ref?.current?.hide();
  };

  const handleSubmit = async (values: IPriceCreateRequest) => {
    if (!record) return;

    // ==== Chuẩn bị details diff ====
    const currentDetails: CurrentDetail[] = (values.priceDetails ?? []).map(
      (d: any) => ({
        productUnitId: Number(d.productUnitId),
        salePrice: Number(d.salePrice ?? 0),
      }),
    );

    const oldItems: OldDetail[] =
      record.priceDetails?.map((d) => ({
        priceDetailId: Number(d.priceDetailId ?? undefined),
        productUnitId: Number(d.productUnitId),
        salePrice: Number(d.salePrice ?? 0),
      })) ?? [];

    const priceDetails = buildPriceDetailsForUpdate(currentDetails, oldItems);
    const deletedDetailIds = priceDetails
      .filter((d) => d.deleted && d.priceDetailId != null)
      .map((d) => d.priceDetailId!) as number[];

    // ==== Header fields ====
    const startIso = values.startDate;
    const endIso = values.endDate;
    const endDateValid = !!endIso;

    // ==== Detect changes ====
    const statusChanged = values.status !== record.status;

    const headerChangedExceptStatus =
      values.priceName !== record.priceName ||
      values.priceCode !== record.priceCode ||
      startIso !== record.startDate ||
      endIso !== record.endDate ||
      values.description !== record.description;

    const detailsChanged = priceDetails.some(
      (d) =>
        d.deleted ||
        !oldItems.find(
          (o) =>
            o.productUnitId === d.productUnitId &&
            o.salePrice === d.salePrice &&
            !d.deleted,
        ),
    );

    // ==== 1) Xử lý trạng thái trước ====
    if (
      statusChanged &&
      values.status === PriceStatus.ACTIVE &&
      (record.status === PriceStatus.PAUSED ||
        record.status === PriceStatus.EXPIRED)
    ) {
      await activatePrice(
        { priceId: record.priceId },
        {
          onSuccess: () => {
            notify('success', {
              message: 'Thành công',
              description: 'Kích hoạt bảng giá thành công',
            });
            queryClient.invalidateQueries({ queryKey: priceKeys.all });
            if (headerChangedExceptStatus || detailsChanged) {
              handleCancel();
            }
          },
          onError: (error: any) => {
            notify('error', {
              message: 'Lỗi',
              description:
                error?.response?.data?.message ||
                error?.message ||
                'Kích hoạt bảng giá thất bại',
            });
          },
        },
      );
    }

    if (
      statusChanged &&
      record.status === PriceStatus.ACTIVE &&
      values.status === PriceStatus.PAUSED
    ) {
      await pausePrice(
        { priceId: record.priceId },
        {
          onSuccess: () => {
            notify('success', {
              message: 'Thành công',
              description: 'Tạm dừng bảng giá thành công',
            });
          },
          onError: (error: any) => {
            notify('error', {
              message: 'Lỗi',
              description:
                error?.response?.data?.message ||
                error?.message ||
                'Tạm dừng bảng giá thất bại',
            });
          },
        },
      );
    }

    // ==== 2) Nếu có thay đổi field (header/details) → updatePrice ====
    if (
      (headerChangedExceptStatus || detailsChanged) &&
      values.status !== PriceStatus.ACTIVE
    ) {
      await updatePrice(
        {
          priceId: record.priceId,
          priceName: values.priceName,
          priceCode: values.priceCode,
          startDate: startIso,
          endDate: endIso,
          description: values.description,
          priceDetails,
          endDateValid,
        } as any,
        {
          onSuccess: async () => {
            // Xoá chi tiết bị đánh dấu deleted (nếu có)
            await deletePriceDetail(
              { priceDetailIds: deletedDetailIds, priceId: record.priceId },
              {
                onSuccess: () => {
                  notify('success', {
                    message: 'Thành công',
                    description: 'Cập nhật bảng giá thành công',
                  });
                },
                onError: (error: any) => {
                  notify('error', {
                    message: 'Lỗi',
                    description:
                      error?.response?.data?.message ||
                      error?.message ||
                      'Xoá chi tiết bảng giá thất bại',
                  });
                },
              },
            );
            queryClient.invalidateQueries({ queryKey: priceKeys.all });
            handleCancel();
          },
          onError: (error: any) => {
            notify('error', {
              message: 'Lỗi',
              description:
                error?.response?.data?.message ||
                error?.message ||
                'Cập nhật bảng giá thất bại',
            });
          },
        },
      );
      return;
    }

    // ==== 3) Nếu KHÔNG có thay đổi field nhưng status có thay đổi → vẫn đóng modal ====
    if (statusChanged && !headerChangedExceptStatus && !detailsChanged) {
      queryClient.invalidateQueries({ queryKey: priceKeys.all });
      handleCancel();
      return;
    }

    handleCancel();
  };

  const handleOpen = () => {
    if (!record) return;

    ref?.current?.open();

    form.setFieldsValue({
      priceName: record.priceName,
      priceCode: record.priceCode,
      status: record.status,
      startDate: record.startDate
        ? dayjs.tz(record.startDate, VN_TZ)
        : undefined,
      endDate: record.endDate ? dayjs.tz(record.endDate, VN_TZ) : undefined,
      description: record.description,
      // gán vào form để user chỉnh: chỉ cần variantId + salePrice cho submit,
      // giữ thêm variantCode/variantName nếu UI cần hiển thị
      priceDetails:
        record.priceDetails?.map((d) => ({
          priceDetailId: d.priceDetailId, // để UI có thể hiển thị nếu cần (không bắt buộc)
          productUnitId: d.productUnitId, // đổi sang productUnitId
          salePrice: d.salePrice,
          productUnitCode: d.productUnitCode,
          productUnitName: d.productUnitName,
        })) ?? [],
    });
  };

  return {
    ref,
    form,
    isLoadingUpdatePrice,
    handleOpen,
    handleSubmit,
    handleCancel,
  };
};
