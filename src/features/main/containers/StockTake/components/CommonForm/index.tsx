import { useMemo, useState, useEffect } from 'react';
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
import { IFormProps, useDebounce } from '@/lib';
import {
  useProductList,
  useWarehouseStockByVariantId,
} from '@/features/main/react-query';
import type { IStockTakeCreateRequest } from '@/dtos';
import { useHook } from './hook';

interface IStockTakeFormProps {
  form: IFormProps<IStockTakeCreateRequest>['form'];
  handleSubmit: (values: IStockTakeCreateRequest) => Promise<void>;
}

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
  onHand: number;
  quantityCounted: number;
  reason?: string;
};

const StockTakeForm = ({ form, handleSubmit }: IStockTakeFormProps) => {
  const [rows, setRows] = useState<Row[]>([]);
  const [search, setSearch] = useState('');
  const debounced = useDebounce(search, 300);

  // variant vừa thêm gần nhất -> dùng để query tồn kho
  const [lastAddedId, setLastAddedId] = useState<number | null>(null);

  // search variants
  const { data: variantsResp, isLoading: isLoadingVariants } = useProductList({
    searchTerm: debounced,
  });

  // chỉ query tồn kho cho dòng vừa thêm (hook chỉ nhận 1 id)
  const { data: variantStock, isLoading: isVariantStockLoading } =
    useWarehouseStockByVariantId({ variantId: lastAddedId ?? 0 });

  const getDetails = () =>
    rows.map((r) => ({
      variantId: r.variantId,
      quantityCounted: r.quantityCounted,
      reason: r.reason,
    }));

  const { rules, onFinish } = useHook(async (payload) => {
    await handleSubmit(payload);
    form?.resetFields(); // reset form fields
    setRows([]); // clear table
    setLastAddedId(null); // clear lastAddedId
    setSearch(''); // optional: clear search box
  }, getDetails);

  // Khi API tồn kho trả về, cập nhật đúng dòng vừa thêm
  useEffect(() => {
    if (lastAddedId == null) return;
    if (variantStock?.data == null) return;

    const onHand = Number(variantStock.data) || 0;

    setRows((prev) =>
      prev.map((r) =>
        r.variantId === lastAddedId
          ? {
              ...r,
              onHand,
              // nếu chưa nhập thủ công thì mặc định = tồn kho
              quantityCounted: r.quantityCounted || onHand,
            }
          : r,
      ),
    );
  }, [variantStock, lastAddedId]);

  const options = useMemo(() => {
    const items: VariantItem[] = variantsResp?.data ?? [];
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
  }, [variantsResp]);

  const addRow = (v: VariantItem) =>
    setRows((prev) => {
      if (prev.some((r) => r.variantId === v.variantId)) return prev; // tránh trùng
      // set id để hook tồn kho query cho dòng vừa thêm
      setLastAddedId(v.variantId);
      return [
        ...prev,
        {
          variantId: v.variantId,
          name: v.variantName,
          code: v.variantCode,
          barcode: v.barcode,
          unitName: v.unit?.unit,
          onHand: 0, // sẽ được fill bởi effect bên trên
          quantityCounted: 0, // mặc định 0; sau effect sẽ set = onHand
        },
      ];
    });

  const updateRow = (id: number, patch: Partial<Row>) =>
    setRows((prev) =>
      prev.map((r) => (r.variantId === id ? { ...r, ...patch } : r)),
    );

  const removeRow = (id: number) =>
    setRows((prev) => prev.filter((r) => r.variantId !== id));

  return (
    <Form<IStockTakeCreateRequest>
      form={form}
      layout="vertical"
      onFinish={onFinish}
    >
      <Space size={16} wrap>
        <Form.Item
          label="Mã kiểm kê"
          name="stocktakeCode"
          rules={[rules]}
          style={{ minWidth: 260 }}
        >
          <Input placeholder="Mã phiếu tự động" />
        </Form.Item>
        <Form.Item
          label="Trạng thái"
          name="status"
          rules={[rules]}
          style={{ minWidth: 200 }}
          hidden
        ></Form.Item>
        <Form.Item
          label="Ghi chú"
          name="notes"
          style={{ minWidth: 320, flex: 1 }}
        >
          <Input.TextArea
            placeholder="Kiểm kê định kỳ"
            autoSize={{ minRows: 1, maxRows: 4 }}
          />
        </Form.Item>
      </Space>

      <Form.Item label="Tìm sản phẩm / biến thể">
        <AutoComplete
          style={{ width: 520 }}
          options={options}
          notFoundContent={isLoadingVariants ? <Spin size="small" /> : null}
          onSearch={setSearch}
          onSelect={(_, opt: any) => addRow(opt.raw)}
        >
          <Input allowClear placeholder="Nhập tên/mã/barcode..." />
        </AutoComplete>
      </Form.Item>

      <Table<Row>
        rowKey="variantId"
        dataSource={rows}
        loading={isVariantStockLoading && lastAddedId != null}
        pagination={false}
        size="middle"
        columns={[
          { title: 'Tên hàng', dataIndex: 'name' },
          { title: 'ĐVT', dataIndex: 'unitName', width: 100 },
          { title: 'Tồn kho', dataIndex: 'onHand', align: 'right', width: 110 },
          {
            title: 'SL thực tế',
            dataIndex: 'quantityCounted',
            align: 'right',
            width: 150,
            render: (_: any, r: Row) => (
              <InputNumber
                min={0}
                value={r.quantityCounted}
                onChange={(v) =>
                  updateRow(r.variantId, { quantityCounted: Number(v ?? 0) })
                }
                style={{ width: '100%' }}
              />
            ),
          },
          {
            title: 'SL lệch',
            key: 'diff',
            align: 'right',
            width: 110,
            render: (_: any, r: Row) => {
              const diff = (r.quantityCounted ?? 0) - (r.onHand ?? 0);
              return (
                <span
                  style={{
                    color: diff === 0 ? undefined : diff > 0 ? 'green' : 'red',
                  }}
                >
                  {diff}
                </span>
              );
            },
          },
          {
            title: 'Lý do',
            dataIndex: 'reason',
            width: 220,
            render: (_: any, r: Row) => (
              <Select
                allowClear
                placeholder="Chọn lý do"
                value={r.reason}
                onChange={(val) => updateRow(r.variantId, { reason: val })}
                options={[
                  {
                    value: 'Hàng bị hỏng do vận chuyển',
                    label: 'Hàng bị hỏng do vận chuyển',
                  },
                  { value: 'Sai lệch kiểm đếm', label: 'Sai lệch kiểm đếm' },
                  { value: 'Thất lạc', label: 'Thất lạc' },
                ]}
                style={{ width: '100%' }}
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

export default StockTakeForm;
