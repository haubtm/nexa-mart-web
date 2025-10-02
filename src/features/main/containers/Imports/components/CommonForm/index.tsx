import { useMemo, useState } from 'react';
import {
  AutoComplete,
  Input,
  Table,
  InputNumber,
  Select,
  Form,
  Space,
  Spin,
  DatePicker,
} from 'antd';
import type { FormInstance } from 'antd';
import type { IImportsCreateRequest } from '@/dtos';
import { useHook } from './hook';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const VN_TZ = 'Asia/Ho_Chi_Minh';

type Props = {
  form: FormInstance<IImportsCreateRequest>;
  handleSubmit: (values: IImportsCreateRequest) => Promise<void>;
};

type VariantItem = {
  variantId: number; // = unit.id
  variantName: string; // ví dụ "Coca Cola - lon (x12)"
  productName: string; // = product.name
  unitName: string; // = unit.unitName
  code?: string; // = unit.code
  barcode?: string; // = unit.barcode
  conversionValue: number; // = unit.conversionValue
};

type Row = {
  variantId: number;
  name: string;
  code?: string;
  barcode?: string;
  unitName?: string;
  quantity: number;
  notes?: string;
};

const ImportForm = ({ form, handleSubmit }: Props) => {
  const [rows, setRows] = useState<Row[]>([]);

  // details cho payload
  const getDetails = () =>
    rows.map((r) => ({
      productUnitId: r.variantId,
      quantity: r.quantity,
      notes: r.notes,
    }));

  // hook validate + search sản phẩm
  const {
    rules,
    onFinish,
    productVariants,
    isLoadingVariants,
    supplierOptions,
    isLoadingSuppliers,
    setSearch,
  } = useHook(handleSubmit, getDetails);

  // build options cho AutoComplete
  const options = useMemo(() => {
    const products = productVariants?.data?.products ?? []; // <- giống price form
    return products.flatMap((p: any) =>
      (p.units ?? []).map((u: any) => {
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
          value: `${p.id}:${u.id}`, // chỉ để hiển thị
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
  }, [productVariants]);

  const addRow = (v: VariantItem) =>
    setRows((prev) =>
      prev.some((r) => r.variantId === v.variantId)
        ? prev
        : [
            ...prev,
            {
              variantId: v.variantId,
              name: v.variantName,
              code: v.code,
              barcode: v.barcode,
              unitName: v.unitName,
              quantity: 1,
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
    <Form<IImportsCreateRequest>
      form={form}
      layout="vertical"
      onFinish={onFinish}
    >
      <Space size={16} wrap>
        <Form.Item
          label="Mã phiếu nhập"
          name="importCode"
          style={{ minWidth: 240 }}
        >
          <Input placeholder="Tự động hoặc nhập tay (tuỳ hệ thống)" />
        </Form.Item>

        <Form.Item
          label="Nhà cung cấp"
          name="supplierId"
          rules={[rules]}
          style={{ minWidth: 280 }}
        >
          <Select
            showSearch
            placeholder="Chọn nhà cung cấp"
            options={
              supplierOptions?.data?.content.map((s) => ({
                value: s.supplierId,
                label: s.name,
              })) || []
            }
            loading={isLoadingSuppliers}
          />
        </Form.Item>

        <Form.Item
          label="Ghi chú"
          name="notes"
          style={{ minWidth: 320, flex: 1 }}
        >
          <Input.TextArea
            placeholder="Ghi chú cho phiếu nhập"
            autoSize={{ minRows: 1, maxRows: 4 }}
          />
        </Form.Item>

        <Form.Item
          label="Ngày nhập"
          name="importDate"
          rules={[rules]}
          style={{ minWidth: 260 }}
          initialValue={dayjs().tz(VN_TZ)}
        >
          <DatePicker
            allowClear={false}
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Space>

      <Form.Item label="Tìm sản phẩm / biến thể">
        <AutoComplete
          style={{ width: 520 }}
          options={isLoadingVariants ? [] : options}
          onSearch={setSearch}
          onSelect={(_, opt: any) => addRow(opt.raw)}
          filterOption={false}
          notFoundContent={isLoadingVariants ? <Spin size="small" /> : null}
        >
          <Input allowClear placeholder="Nhập tên/mã/barcode..." />
        </AutoComplete>
      </Form.Item>

      <Table<Row>
        rowKey="variantId"
        dataSource={rows}
        pagination={false}
        size="middle"
        columns={[
          { title: 'Tên hàng', dataIndex: 'name' },
          { title: 'ĐVT', dataIndex: 'unitName', width: 100 },
          {
            title: 'SL nhập',
            dataIndex: 'quantity',
            width: 140,
            align: 'right',
            render: (_: any, r: Row) => (
              <InputNumber
                min={1}
                value={r.quantity}
                onChange={(v) =>
                  updateRow(r.variantId, { quantity: Number(v ?? 1) })
                }
                style={{ width: '100%' }}
              />
            ),
          },
          {
            title: 'Ghi chú dòng',
            dataIndex: 'notes',
            width: 240,
            render: (_: any, r: Row) => (
              <Input
                value={r.notes}
                onChange={(e) =>
                  updateRow(r.variantId, { notes: e.target.value })
                }
                placeholder="Ghi chú cho dòng này"
              />
            ),
          },
          {
            title: '',
            width: 56,
            render: (_: any, r: Row) => (
              <a
                onClick={() => removeRow(r.variantId)}
                style={{ color: '#ff4d4f' }}
              >
                Xoá
              </a>
            ),
          },
        ]}
      />
    </Form>
  );
};

export default ImportForm;
