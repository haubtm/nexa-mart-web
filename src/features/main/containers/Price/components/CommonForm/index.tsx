import { useEffect, useState } from 'react';
import { Form, DatePicker, Checkbox } from 'antd';
import type { FormInstance } from 'antd';
import type {
  IPriceCreateRequest,
  IPriceListResponse,
  IProductListResponse,
} from '@/dtos';
import { useHook } from './hook';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import {
  Input,
  InputNumber,
  PriceStatus,
  Select,
  Table,
  TextArea,
} from '@/lib';

dayjs.extend(utc);
dayjs.extend(timezone);
const VN_TZ = 'Asia/Ho_Chi_Minh';
dayjs.tz.setDefault(VN_TZ);
const nowVN = () => dayjs().tz('Asia/Ho_Chi_Minh');

type Props = {
  form: FormInstance<IPriceCreateRequest>;
  handleSubmit: (values: IPriceCreateRequest) => Promise<void>;
  enableDetails?: boolean;
};

type UnitRow = {
  id: number;
  unitName: string;
  code?: string;
  barcode?: string;
  conversionValue: number;
  isBaseUnit?: boolean;
};

type Row = {
  productId: number;
  productName: string;
  productUnitId: number;
  unitName: string;
  conversionValue?: number;
  code?: string;
  barcode?: string;
  salePrice?: number;
  checked: boolean;
};

const PriceForm = ({ form, handleSubmit, enableDetails = true }: Props) => {
  const [rows, setRows] = useState<Row[]>([]);
  const [checkAll, setCheckAll] = useState<boolean>(true);

  const disablePast = (current?: dayjs.Dayjs) =>
    !!current && current.tz(VN_TZ).isBefore(nowVN().startOf('day'));

  const disableEnd = (current?: dayjs.Dayjs) => {
    const start: dayjs.Dayjs | undefined = form.getFieldValue('startDate');
    if (!start) return false;
    const minEnd = start.tz(VN_TZ).startOf('day').add(1, 'day');
    return !!current && current.tz(VN_TZ).isBefore(minEnd);
  };

  const [tableY, setTableY] = useState<number>(420);

  useEffect(() => {
    const calc = () => {
      // chừa không gian cho form + khoảng đệm
      const h = window.innerHeight;
      // bảng cao ~55% viewport, tối thiểu 260px
      setTableY(Math.max(260, Math.round(h * 0.45)));
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);

  // Lấy chi tiết gửi lên từ state rows
  const getDetails = (): IPriceCreateRequest['priceDetails'] =>
    rows
      .filter(
        (r) =>
          r.checked && r.salePrice !== undefined && !Number.isNaN(r.salePrice),
      )
      .map((r) => ({
        productUnitId: r.productUnitId,
        salePrice: Number(r.salePrice),
      }));

  const { rules, onFinish, productData, isLoadingProduct, hasEnd, setHasEnd } =
    useHook(async (values) => {
      const payload: IPriceCreateRequest = enableDetails
        ? { ...values, priceDetails: getDetails() }
        : { ...values, priceDetails: undefined };
      await handleSubmit(payload);
    });

  // Tạo rows từ productData (toàn bộ sản phẩm)
  useEffect(() => {
    const products: IProductListResponse['data']['products'] =
      productData?.data?.products ?? [];

    // Nếu có dữ liệu cũ (edit), map trước để ưu tiên salePrice/đơn vị đã chọn
    const prevDetails = (form.getFieldValue('priceDetails') ??
      []) as IPriceListResponse['data']['content'][number]['priceDetails'];

    const detailByUnitId = new Map<number, { salePrice?: number }>();
    prevDetails?.forEach((d) => {
      if (d?.productUnitId != null) {
        detailByUnitId.set(d.productUnitId, { salePrice: d.salePrice });
      }
    });

    const isUpdate = detailByUnitId.size > 0;

    const nextRows: Row[] = products.flatMap((p) => {
      const units: UnitRow[] = (p.units ?? []).map((u) => ({
        id: u.id!,
        unitName: u.unitName,
        code: u.code,
        barcode: u.barcode,
        conversionValue: u.conversionValue,
        isBaseUnit: !!u.isBaseUnit,
      }));

      return units.map((u) => ({
        productId: p.id,
        productName: p.name,
        productUnitId: u.id,
        unitName: u.unitName,
        conversionValue: u.conversionValue,
        code: u.code,
        barcode: u.barcode,
        salePrice: detailByUnitId.get(u.id)?.salePrice, // prefill giá nếu có
        // ⬇️ Flow mới:
        // - Tạo mới: không check gì cả
        // - Cập nhật: chỉ check đúng unit đã có trong bảng giá
        checked: isUpdate ? detailByUnitId.has(u.id) : false,
      }));
    });

    setRows(nextRows);
    // checkAll phản ánh đúng hiện trạng (tạo mới sẽ là false)
    setCheckAll(nextRows.length > 0 && nextRows.every((r) => r.checked));

    // đồng bộ hasEnd theo endDate như cũ
    const end = form.getFieldValue('endDate');
    setHasEnd(!!end);
  }, [productData, form]);

  const updateRow = (unitId: number, patch: Partial<Row>) =>
    setRows((prev) =>
      prev.map((r) => (r.productUnitId === unitId ? { ...r, ...patch } : r)),
    );

  const onToggleAll = (checked: boolean) => {
    setCheckAll(checked);
    setRows((prev) => prev.map((r) => ({ ...r, checked })));
  };

  return (
    <Form<IPriceCreateRequest>
      form={form}
      layout="vertical"
      onFinish={onFinish}
    >
      {/* Thông tin cơ bản (compact) */}
      <div
        style={{
          borderRadius: 12,
          border: '1px solid #eee',
          padding: 12, // giảm padding
          marginBottom: 8,
        }}
      >
        {/* Hàng field gọn 1 dòng */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr 1fr auto 1fr 0.9fr',
            gap: 12,
            alignItems: 'end',
          }}
        >
          <Form.Item
            label="Tên bảng giá"
            name="priceName"
            rules={[rules]}
            style={{ marginBottom: 8 }}
          >
            <Input size="middle" placeholder="VD: Bảng giá tháng 10" />
          </Form.Item>

          <Form.Item
            label="Mã bảng giá"
            name="priceCode"
            rules={[rules]}
            style={{ marginBottom: 8 }}
          >
            <Input size="middle" placeholder="Tự động" />
          </Form.Item>

          <Form.Item
            label="Thời gian bắt đầu"
            name="startDate"
            rules={[rules]}
            initialValue={nowVN()}
            style={{ marginBottom: 8 }}
          >
            <DatePicker
              allowClear={false}
              showTime={{ format: 'HH:mm' }}
              format="YYYY-MM-DD HH:mm"
              disabledDate={disablePast}
              style={{ width: '100%' }}
            />
          </Form.Item>

          {/* Checkbox KHÔNG có text để gọn hơn */}
          <Form.Item style={{ marginBottom: 8 }}>
            <Checkbox
              checked={hasEnd}
              onChange={(e) => setHasEnd(e.target.checked)}
              aria-label="Bật thời gian kết thúc"
            />
          </Form.Item>

          <Form.Item
            label="Thời gian kết thúc"
            name="endDate"
            rules={hasEnd ? [rules] : []}
            style={{ marginBottom: 8 }}
          >
            <DatePicker
              disabled={!hasEnd}
              showTime={{ format: 'HH:mm' }}
              format="YYYY-MM-DD HH:mm"
              disabledDate={disableEnd}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label="Trạng thái"
            name="status"
            rules={hasEnd ? [rules] : []}
            style={{ marginBottom: 8 }}
          >
            <Select
              size="middle"
              options={[
                { label: 'Áp dụng', value: PriceStatus.UPCOMING },
                { label: 'Tạm ngưng', value: PriceStatus.PAUSED },
              ]}
            />
          </Form.Item>
        </div>

        {/* Mô tả: nhỏ lại để nhường chỗ cho bảng */}
        <Form.Item
          name="description"
          label="Mô tả"
          style={{ marginTop: 4, marginBottom: 4 }}
        >
          <TextArea
            size="middle"
            autoSize
            rows={2}
            placeholder="Ghi chú (tùy chọn)"
          />
        </Form.Item>
      </div>

      {enableDetails && (
        <>
          {/* Bảng tất cả sản phẩm */}
          <Table<Row>
            rowKey={(r) => `${r.productId}-${r.productUnitId}`}
            dataSource={rows}
            loading={isLoadingProduct}
            pagination={false}
            size="middle"
            sticky
            scroll={{ y: tableY }}
            columns={[
              {
                title: (
                  <Checkbox
                    checked={checkAll}
                    onChange={(e) => onToggleAll(e.target.checked)}
                  />
                ),
                width: 30,
                render: (_: any, r) => (
                  <Checkbox
                    checked={r.checked}
                    onChange={(e) =>
                      updateRow(r.productUnitId, { checked: e.target.checked })
                    }
                  />
                ),
              },
              {
                title: 'Sản phẩm',
                dataIndex: 'productName',
                render: (v) => <strong>{v}</strong>,
                width: 280,
              },
              {
                title: 'ĐVT',
                dataIndex: 'unitName',
                width: 180,
                render: (_: any, r) =>
                  `${r.unitName}${r.conversionValue && r.conversionValue !== 1 ? ` (x${r.conversionValue})` : ''}`,
              },
              { title: 'Mã', dataIndex: 'code', width: 160 },
              { title: 'Barcode', dataIndex: 'barcode', width: 160 },
              {
                title: 'Giá bán',
                dataIndex: 'salePrice',
                width: 180,
                align: 'right' as const,
                render: (_: any, r) => (
                  <InputNumber
                    min={0}
                    size="middle"
                    value={r.salePrice}
                    disabled={!r.checked}
                    onChange={(v) =>
                      updateRow(r.productUnitId, { salePrice: Number(v ?? 0) })
                    }
                    style={{ width: '100%' }}
                    formatter={(val) =>
                      `${(val ?? '').toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                    }
                    parser={(val) =>
                      Number((val ?? '').toString().replace(/,/g, ''))
                    }
                    placeholder="Nhập giá"
                  />
                ),
              },
            ]}
          />
        </>
      )}
    </Form>
  );
};

export default PriceForm;
