import { useState, useEffect } from 'react';
import {
  Input,
  Table,
  InputNumber,
  Select,
  Form,
  Space,
  Checkbox, // ⬅️ thêm
} from 'antd';
import { IFormProps } from '@/lib';
import {
  useProductList,
  useWarehouseStockByProductUnitId,
} from '@/features/main/react-query';
import type { IStockTakeCreateRequest } from '@/dtos';
import { useHook } from './hook';

interface IStockTakeFormProps {
  form: IFormProps<IStockTakeCreateRequest>['form'];
  handleSubmit: (values: IStockTakeCreateRequest) => Promise<void>;
}

// Mỗi unit là 1 dòng
type Row = {
  variantId: number; // = unit.id
  productName: string;
  unitName: string;
  code?: string;
  barcode?: string;
  conversionValue?: number;
  onHand: number; // tồn kho
  quantityCounted: number;
  reason?: string;
  checked: boolean; // ⬅️ chọn/bỏ chọn dòng
};

const StockTakeForm = ({ form, handleSubmit }: IStockTakeFormProps) => {
  const [rows, setRows] = useState<Row[]>([]);
  const [checkAll, setCheckAll] = useState(false);

  // Chiều cao bảng cuộn
  const [tableY, setTableY] = useState<number>(420);
  useEffect(() => {
    const calc = () =>
      setTableY(Math.max(260, Math.round(window.innerHeight * 0.55)));
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);

  // Gọi list sản phẩm KHÔNG có searchTerm -> lấy tất cả (tuỳ BE phân trang)
  const { data: productsResp, isLoading: isLoadingProducts } = useProductList({
    page: 0,
    size: 100,
  });
  // Gọi tồn kho CHỈ khi vừa tick 1 dòng (unit) gần nhất
  const [lastAddedId, setLastAddedId] = useState<number | null>(null);
  const detailsWatch = Form.useWatch('stocktakeDetails', form);

  const { data: productUnitStock, isLoading: isProductUnitStockLoading } =
    useWarehouseStockByProductUnitId({ productUnitId: lastAddedId ?? 0 });

  // Khi có tồn kho cho unit vừa tick → set onHand & quantityCounted mặc định
  useEffect(() => {
    if (lastAddedId == null) return;
    if (detailsWatch?.length) return;
    const onHand = Number(productUnitStock?.data) || 0;
    if (Number.isNaN(onHand)) return;
    setRows((prev) =>
      prev.map((r) =>
        r.variantId === lastAddedId
          ? {
              ...r,
              onHand,
              quantityCounted: r.quantityCounted || onHand,
            }
          : r,
      ),
    );
  }, [productUnitStock, lastAddedId, detailsWatch]);

  useEffect(() => {
    const products = productsResp?.data?.products ?? [];
    const prev = (detailsWatch ?? []) as Array<{
      productUnitId: number;
      quantityCounted?: number;
      reason?: string;
      quantityExpected?: number; // ⬅️ nhận thêm field này
    }>;

    const byUnit = new Map<
      number,
      {
        quantityCounted?: number;
        reason?: string;
        quantityExpected?: number;
      }
    >();
    prev.forEach((d) =>
      byUnit.set(d.productUnitId, {
        quantityCounted: d.quantityCounted,
        reason: d.reason,
        quantityExpected: d.quantityExpected, // ⬅️ lưu lại
      }),
    );

    const next = products.flatMap((p: any) =>
      (p.units ?? []).map((u: any) => {
        const preset = byUnit.get(u.id!);
        return {
          variantId: u.id!,
          productName: p.name,
          unitName: u.unitName,
          code: u.code,
          barcode: u.barcode,
          conversionValue: u.conversionValue,
          onHand: preset?.quantityExpected ?? 0, // ⬅️ FILL tồn kho tại đây
          quantityCounted: preset?.quantityCounted ?? 0,
          reason: preset?.reason,
          checked: !!preset,
        };
      }),
    );

    setRows(next);
    setCheckAll(next.length > 0 && next.every((x) => x.checked));
  }, [productsResp, detailsWatch]);

  const syncFormDetails = (list: Row[]) => {
    form?.setFieldsValue({
      stocktakeDetails: list
        .filter((r) => r.checked)
        .map((r) => ({
          productUnitId: r.variantId,
          quantityCounted: r.quantityCounted,
          reason: r.reason,
          // Không bắt buộc gửi quantityExpected khi submit (tuỳ BE),
          // nhưng nếu muốn giữ lại để reopen update lần sau fill onHand, có thể gửi kèm:
          // quantityExpected: r.onHand,
        })),
    });
  };

  // Helpers cập nhật bảng
  const updateRow = (id: number, patch: Partial<Row>) =>
    setRows((prev) => {
      const newRows = prev.map((r) =>
        r.variantId === id ? { ...r, ...patch } : r,
      );
      setCheckAll(newRows.length > 0 && newRows.every((x) => x.checked));
      // đồng bộ form để xem trước (optional)
      syncFormDetails(newRows);
      return newRows;
    });

  const onToggleOne = (r: Row, checked: boolean) => {
    updateRow(r.variantId, { checked });
    if (checked && !detailsWatch?.length) setLastAddedId(r.variantId); // tick -> query tồn kho cho dòng này
  };

  const onToggleAll = (checked: boolean) => {
    setCheckAll(checked);
    setRows((prev) => {
      const newRows = prev.map((r) => ({ ...r, checked }));
      syncFormDetails(newRows);
      // Nếu chọn tất cả: không gọi tồn kho hàng loạt (tránh nổ API)
      return newRows;
    });
  };

  const getDetails = () =>
    rows
      .filter((r) => r.checked)
      .map((r) => ({
        productUnitId: r.variantId,
        quantityCounted: r.quantityCounted,
        reason: r.reason,
      }));

  const { rules, onFinish } = useHook(async (payload) => {
    await handleSubmit(payload);
    setLastAddedId(null);
  }, getDetails);

  // Build rows từ tất cả products/units; mặc định KHÔNG check dòng nào
  // useEffect(() => {
  //   const products = productsResp?.data?.products ?? [];
  //   const next: Row[] = products.flatMap((p: any) =>
  //     (p.units ?? []).map((u: any) => ({
  //       variantId: u.id!,
  //       productName: p.name,
  //       unitName: u.unitName,
  //       code: u.code,
  //       barcode: u.barcode,
  //       conversionValue: u.conversionValue,
  //       onHand: 0,
  //       quantityCounted: 0,
  //       checked: false, // ⬅️ mặc định không chọn
  //     })),
  //   );
  //   setRows(next);
  //   setCheckAll(false);
  // }, [productsResp]);

  useEffect(() => {
    const products = productsResp?.data?.products ?? [];

    // ⬇️ details từ form (đã set bởi hook update khi mở modal)
    const prev = (form?.getFieldValue('stocktakeDetails') ?? []) as Array<{
      productUnitId: number;
      quantityCounted?: number;
      reason?: string;
      quantityExpected?: number; // ⬅️ nhận thêm field này
    }>;
    const byUnit = new Map<
      number,
      { quantityCounted?: number; reason?: string; quantityExpected?: number }
    >();
    prev.forEach((d) =>
      byUnit.set(d.productUnitId, {
        quantityCounted: d.quantityCounted,
        reason: d.reason,
        quantityExpected: d.quantityExpected,
      }),
    );

    const next: Row[] = products.flatMap((p: any) =>
      (p.units ?? []).map((u: any) => {
        const preset = byUnit.get(u.id!);
        return {
          variantId: u.id!,
          productName: p.name,
          unitName: u.unitName,
          code: u.code,
          barcode: u.barcode,
          conversionValue: u.conversionValue,
          onHand: preset?.quantityExpected ?? 0,
          quantityCounted: preset?.quantityCounted ?? 0,
          reason: preset?.reason,
          checked: !!preset, // ⬅️ tick sẵn nếu có trong chi tiết
        } as Row;
      }),
    );

    setRows(next);
    setCheckAll(next.length > 0 && next.every((x) => x.checked));
  }, [productsResp, detailsWatch]);

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
          label="Ghi chú"
          name="notes"
          style={{ minWidth: 320, flex: 1 }}
        >
          <Input.TextArea
            placeholder="Kiểm kê định kỳ"
            autoSize={{ minRows: 1, maxRows: 4 }}
          />
        </Form.Item>
        <Form.Item name="status" rules={[rules]} hidden>
          <Input />
        </Form.Item>
      </Space>

      {/* Bảng: tất cả sản phẩm/đơn vị */}
      <Table<Row>
        rowKey="variantId"
        dataSource={rows}
        loading={
          isLoadingProducts ||
          (isProductUnitStockLoading && lastAddedId != null)
        }
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
            width: 50,
            render: (_: any, r) => (
              <Checkbox
                checked={r.checked}
                onChange={(e) => onToggleOne(r, e.target.checked)}
              />
            ),
          },
          { title: 'Sản phẩm', dataIndex: 'productName', width: 280 },
          {
            title: 'ĐVT',
            dataIndex: 'unitName',
            width: 160,
            render: (_: any, r) =>
              `${r.unitName}${r.conversionValue && r.conversionValue !== 1 ? ` (x${r.conversionValue})` : ''}`,
          },
          { title: 'Mã', dataIndex: 'code', width: 140 },
          { title: 'Barcode', dataIndex: 'barcode', width: 160 },
          {
            title: 'Tồn kho',
            dataIndex: 'onHand',
            align: 'right' as const,
            width: 110,
          },
          {
            title: 'SL thực tế',
            dataIndex: 'quantityCounted',
            align: 'right' as const,
            width: 150,
            render: (_: any, r) => (
              <InputNumber
                min={0}
                value={r.quantityCounted}
                disabled={!r.checked}
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
            align: 'right' as const,
            width: 110,
            render: (_: any, r) => {
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
            render: (_: any, r) => (
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
                disabled={!r.checked}
              />
            ),
          },
        ]}
      />
    </Form>
  );
};

export default StockTakeForm;
