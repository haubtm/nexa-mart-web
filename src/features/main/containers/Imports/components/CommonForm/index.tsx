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
} from 'antd';
import type { FormInstance } from 'antd';
import type { IImportsCreateRequest } from '@/dtos';
import { useHook } from './hook';

type Props = {
  form: FormInstance<IImportsCreateRequest>;
  handleSubmit: (values: IImportsCreateRequest) => Promise<void>;
};

type VariantItem = {
  variantId: number;
  variantName: string;
  variantCode?: string;
  barcode?: string;
  unit?: { unit: string };
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
      variantId: r.variantId,
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
    const items: VariantItem[] = productVariants?.data ?? [];
    return items.map((v) => ({
      value: String(v.variantId),
      label: (
        <Space direction="vertical" size={0}>
          <strong>{v.variantName}</strong>
          <span style={{ color: '#666', fontSize: 12 }}>
            {(v.variantCode && `Mã: ${v.variantCode} • `) || ''}
            {(v.barcode && `Barcode: ${v.barcode} • `) || ''}
            {v.unit?.unit ?? ''}
          </span>
        </Space>
      ),
      raw: v,
    }));
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
              code: v.variantCode,
              barcode: v.barcode,
              unitName: v.unit?.unit,
              quantity: 1, // mặc định 1
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
