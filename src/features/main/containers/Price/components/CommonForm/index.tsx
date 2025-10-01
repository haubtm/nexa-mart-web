import { useEffect, useMemo, useState } from 'react';
import {
  AutoComplete,
  Input,
  Table,
  InputNumber,
  Form,
  Space,
  Spin,
  DatePicker,
  Button,
  Checkbox,
} from 'antd';
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
import { PriceStatus, Select } from '@/lib';
dayjs.extend(utc);
dayjs.extend(timezone);
const VN_TZ = 'Asia/Ho_Chi_Minh';
// (tuỳ chọn) đặt default
dayjs.tz.setDefault(VN_TZ);

// helpers
const nowVN = () => dayjs().tz('Asia/Ho_Chi_Minh');

type Props = {
  form: FormInstance<IPriceCreateRequest>;
  handleSubmit: (values: IPriceCreateRequest) => Promise<void>;
  enableDetails?: boolean;
};

type VariantItem = {
  variantId: number; // = unit.id
  variantName: string; // ví dụ: "Coca Cola 123 - lon (x12)"
  productName: string; // = product.name
  unitName: string; // = unit.unitName
  code?: string; // = unit.code
  barcode?: string; // = unit.barcode
  conversionValue: number; // = unit.conversionValue
};

type Row = {
  variantId: number;
  name: string;
  code?: string; // giữ lại để hiển thị "Mã"
  barcode?: string; // NEW: barcode riêng cột
  unitName?: string;
  sku?: string;
  salePrice?: number;
};

const PriceForm = ({ form, handleSubmit, enableDetails = true }: Props) => {
  const [rows, setRows] = useState<Row[]>([]);

  const disablePast = (current?: dayjs.Dayjs) =>
    !!current && current.tz(VN_TZ).isBefore(nowVN().startOf('day'));

  const disableEnd = (current?: dayjs.Dayjs) => {
    const start: dayjs.Dayjs | undefined = form.getFieldValue('startDate');
    if (!start) return false;
    const minEnd = start.tz(VN_TZ).startOf('day').add(1, 'day');
    return !!current && current.tz(VN_TZ).isBefore(minEnd);
  };
  // map -> priceDetails cho payload
  const getDetails = (): IPriceCreateRequest['priceDetails'] =>
    rows
      .filter((r) => r.salePrice !== undefined && !Number.isNaN(r.salePrice))
      .map((r) => ({
        variantId: r.variantId,
        salePrice: Number(r.salePrice),
      }));

  // hook validate + search biến thể
  const {
    rules,
    onFinish, // đã parse Zod ở hook
    productData,
    isLoadingProduct,
    setSearch,
    hasEnd,
    setHasEnd,
  } = useHook(async (values) => {
    // ghép details trước khi gửi
    const payload: IPriceCreateRequest = enableDetails
      ? {
          ...values,
          priceDetails: getDetails(),
        }
      : {
          ...values,
          priceDetails: undefined,
        };
    await handleSubmit(payload);
  });

  // options cho AutoComplete
  const options = useMemo(() => {
    const products: IProductListResponse['data']['products'] =
      productData?.data?.products ?? [];

    return products.flatMap((p) =>
      (p.units ?? []).map((u) => {
        const variantName =
          `${p.name} - ${u.unitName}` +
          (u.isBaseUnit ? '' : ` (x${u.conversionValue})`);

        const subLine = [
          u.code ? `Mã: ${u.code}` : null,
          u.barcode ? `Barcode: ${u.barcode}` : null,
          p.brandName ? `Brand: ${p.brandName}` : null,
        ]
          .filter(Boolean)
          .join(' • ');

        const raw: VariantItem = {
          variantId: u.id!,
          variantName,
          productName: p.name,
          unitName: u.unitName,
          code: u.code,
          barcode: u.barcode,
          conversionValue: u.conversionValue,
        };

        return {
          value: `${p.id}:${u.id}`, // giá trị hiển thị
          label: (
            <Space direction="vertical" size={0}>
              <strong>{variantName}</strong>
              {subLine && (
                <span style={{ color: '#666', fontSize: 12 }}>{subLine}</span>
              )}
            </Space>
          ),
          raw, // để onSelect addRow(opt.raw)
        };
      }),
    );
  }, [productData]);

  const getUnitFromVariantName = (name?: string) => {
    if (!name) return undefined;
    // Tách theo dấu gạch ngang có/không khoảng trắng hai bên
    const parts = name.split(/\s*-\s*/).filter(Boolean);
    return parts.length ? parts[parts.length - 1] : undefined;
  };

  useEffect(() => {
    const details = form.getFieldValue(
      'priceDetails',
    ) as IPriceListResponse['data']['content'][number]['priceDetails'];
    console.log('details', details);
    if (details && details.length) {
      // Nếu chưa có tên/đơn vị, đặt name tạm bằng mã ID
      setRows(
        details?.map((d) => ({
          variantId: d?.variantId,
          name: d?.variantName,
          salePrice: d?.salePrice,
          code: d?.variantCode,
          barcode: d?.variantCode,
          unitName: getUnitFromVariantName(d.variantName),
        })),
      );
      console.log(rows);
    } else {
      setRows([]); // trường hợp không có chi tiết
    }

    // Cập nhật checkbox hasEnd dựa trên endDate
    const end = form.getFieldValue('endDate');
    setHasEnd(!!end);
  }, [form]);

  const addRow = (v: VariantItem) =>
    setRows((prev) =>
      prev.some((r) => r.variantId === v.variantId)
        ? prev
        : [
            ...prev,
            {
              variantId: v.variantId,
              name: v.variantName,
              code: v.code, // Mã (unit.code)
              barcode: v.barcode, // Barcode (unit.barcode)
              unitName: v.unitName, // ĐVT
              salePrice: undefined,
            },
          ],
    );

  const updateRow = (id: number, patch: Partial<Row>) =>
    setRows((prev) =>
      prev.map((r) => (r.variantId === id ? { ...r, ...patch } : r)),
    );

  const removeRow = (id: number) =>
    setRows((prev) => prev.filter((r) => r.variantId !== id));

  return (
    <Form<IPriceCreateRequest>
      form={form}
      layout="vertical"
      onFinish={onFinish}
    >
      {/* Thông tin cơ bản */}
      <div
        style={{
          borderRadius: '12px',
          border: '1px solid #eee',
          padding: '16px',
        }}
      >
        <Space size={16} wrap>
          <Form.Item
            label="Tên bảng giá"
            name="priceName"
            rules={[rules]}
            style={{ minWidth: 320 }}
          >
            <Input placeholder="VD: Bảng giá tháng 10" />
          </Form.Item>

          <Form.Item
            label="Mã bảng giá"
            name="priceCode"
            rules={[rules]}
            style={{ minWidth: 220 }}
          >
            <Input placeholder="Tự động" />
          </Form.Item>

          <Form.Item
            label="Thời gian bắt đầu"
            name="startDate"
            rules={[rules]}
            initialValue={nowVN()}
          >
            <DatePicker
              allowClear={false}
              showTime={{ format: 'HH:mm' }}
              format="YYYY-MM-DD HH:mm"
              style={{ minWidth: 240 }}
              disabledDate={disablePast}
            />
          </Form.Item>

          <Form.Item label=" " colon={false}>
            <Checkbox
              checked={hasEnd}
              onChange={(e) => setHasEnd(e.target.checked)}
            >
              Thời gian kết thúc
            </Checkbox>
          </Form.Item>

          <Form.Item
            label="Thời gian kết thúc"
            name="endDate"
            rules={hasEnd ? [rules] : []}
          >
            <DatePicker
              disabled={!hasEnd}
              showTime={{ format: 'HH:mm' }}
              format="YYYY-MM-DD HH:mm"
              style={{ minWidth: 240 }}
              disabledDate={disableEnd}
            />
          </Form.Item>

          <Form.Item
            label="Trạng thái"
            name="status"
            rules={hasEnd ? [rules] : []}
            style={{ minWidth: 180 }}
          >
            <Select
              options={[
                { label: 'Áp dụng', value: PriceStatus.UPCOMING },
                { label: 'Tạm ngưng', value: PriceStatus.PAUSED },
              ]}
            />
          </Form.Item>
        </Space>

        <Form.Item name="description" label="Mô tả" style={{ marginTop: 8 }}>
          <Input.TextArea
            rows={3}
            placeholder="Ghi chú cho bảng giá (tùy chọn)"
          />
        </Form.Item>
      </div>

      {enableDetails && (
        <>
          {/* Tìm & thêm sản phẩm */}
          <Form.Item label="Tìm sản phẩm / biến thể" style={{ marginTop: 16 }}>
            <AutoComplete
              style={{ width: 520 }}
              options={isLoadingProduct ? [] : options}
              onSearch={setSearch}
              onSelect={(_, opt: any) => addRow(opt.raw)} // <-- quan trọng
              filterOption={false}
              notFoundContent={isLoadingProduct ? <Spin size="small" /> : null}
            >
              <Input allowClear placeholder="Nhập tên/mã/barcode..." />
            </AutoComplete>
          </Form.Item>

          {/* Bảng sản phẩm áp dụng */}
          <Table<Row>
            rowKey="variantId"
            dataSource={rows}
            pagination={false}
            size="middle"
            columns={[
              {
                title: 'Sản phẩm',
                dataIndex: 'name',
                render: (v, r) => (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <strong>{v}</strong>
                    <span style={{ color: '#666', fontSize: 12 }}>
                      {(r.code && `Mã: ${r.code} • `) || ''}
                      {(r.barcode && `Barcode: ${r.barcode} • `) || ''}
                      {r.unitName || ''}
                    </span>
                  </div>
                ),
              },
              { title: 'Mã', dataIndex: 'code', width: 160 }, // unit.code
              { title: 'Barcode', dataIndex: 'barcode', width: 160 }, // unit.barcode
              { title: 'ĐVT', dataIndex: 'unitName', width: 120 },
              {
                title: 'Giá bán',
                dataIndex: 'salePrice',
                width: 180,
                align: 'right' as const,
                render: (_: any, r: Row) => (
                  <InputNumber
                    min={0}
                    value={r.salePrice}
                    onChange={(v) =>
                      updateRow(r.variantId, { salePrice: Number(v ?? 0) })
                    }
                    style={{ width: '100%' }}
                    formatter={(val) =>
                      `${(val ?? '')
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                    }
                    parser={(val) =>
                      Number((val ?? '').toString().replace(/,/g, ''))
                    }
                    placeholder="Nhập giá"
                  />
                ),
              },
              {
                title: '',
                width: 70,
                render: (_: any, r: Row) => (
                  <Button
                    type="link"
                    danger
                    onClick={() => removeRow(r.variantId)}
                  >
                    Xoá
                  </Button>
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
