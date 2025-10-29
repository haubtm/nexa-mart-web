import { useEffect, useMemo, useState } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Table,
  Space,
  message,
  DatePicker,
  Row,
  Col,
} from 'antd';
import type { FormInstance } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { IPriceCreateRequest } from '@/dtos';
import { useProductList } from '@/features/main/react-query';
import { useDebounce } from '@/lib';
import { SvgSearchIcon } from '@/assets';
import { useHook } from './hook';

type Row = {
  key: string; // `${productId}-${unitId}`
  productId: number;
  productName: string;
  unitId: number; // productUnitId (units[i].id)
  unitName: string;
  salePrice?: number;
};

type Props = {
  form: FormInstance<IPriceCreateRequest>;
  handleSubmit: (values: IPriceCreateRequest) => Promise<void>;
};

const PriceForm: React.FC<Props> = ({ form, handleSubmit }) => {
  const [rows, setRows] = useState<Row[]>([]);

  // Chiều cao vùng scroll cho bảng (responsive theo viewport)
  const [tableY, setTableY] = useState<number>(420);

  useEffect(() => {
    const calc = () =>
      setTableY(Math.max(260, Math.round(window.innerHeight * 0.5)));
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const searchDebounce = useDebounce(searchTerm);
  // dữ liệu sản phẩm (dùng cho search + prefill)
  const { data: productResp, isLoading: isLoadingProducts } = useProductList({
    page: 0,
    size: 20,
    searchTerm: searchDebounce,
  });
  const products = productResp?.data?.products ?? [];

  // ====== SEARCH: mỗi option là 1 ĐVT của 1 SP (Product – Unit) ======
  const searchOptions = useMemo(() => {
    if (!searchDebounce) return [];
    const used = new Set(rows.map((r) => r.unitId)); // để disable nếu đã chọn
    return products.flatMap((p: any) =>
      (p.units ?? []).map((u: any) => ({
        label: `${p.name} – ${u.unitName}${u.isBaseUnit ? '' : ` (x${u.conversionValue})`}`,
        value: `${p.id}:${u.id}`, // encode
        disabled: used.has(u.id),
      })),
    );
  }, [products, rows, searchDebounce]);

  // Thêm 1 dòng từ lựa chọn search
  const onPickProductUnit = (val: string) => {
    const [pidStr, uidStr] = val.split(':');
    const productId = Number(pidStr);
    const unitId = Number(uidStr);

    if (rows.some((r) => r.unitId === unitId)) {
      message.warning('Đơn vị này đã có trong bảng.');
      return;
    }
    const p = products.find((x: any) => x.id === productId);
    const u = p?.units?.find((x: any) => x.id === unitId);
    if (!p || !u) return;

    const newRow: Row = {
      key: `${p.id}-${u.id}`,
      productId: p.id,
      productName: p.name,
      unitId: u.id!,
      unitName: u.unitName,
      salePrice: undefined,
    };
    setRows((prev) => [newRow, ...prev]);
    // setSearchTerm('');
    // clear lại select tìm kiếm
    form.setFieldValue('__searchPick', undefined);
  };

  // Đổi ĐVT trong 1 dòng (chỉ cho switch nếu chưa tồn tại ở bảng)
  const changeUnitInRow = (row: Row, newUnitId: number) => {
    if (
      rows.some((r) => r.productId === row.productId && r.unitId === newUnitId)
    ) {
      message.warning('Đơn vị này đã có trong bảng cho sản phẩm này.');
      return;
    }
    const p = products.find((x: any) => x.id === row.productId);
    const u = p?.units?.find((x: any) => x.id === newUnitId);
    if (!u) return;

    setRows((prev) =>
      prev.map((r) =>
        r.key === row.key
          ? {
              ...r,
              unitId: u.id!,
              unitName: u.unitName,
              key: `${row.productId}-${u.id}`,
            }
          : r,
      ),
    );
  };

  // Xoá dòng
  const removeRow = (rowKey: string) =>
    setRows((prev) => prev.filter((r) => r.key !== rowKey));

  // Prefill khi UPDATE (nếu có priceDetails + products đã sẵn sàng)
  useEffect(() => {
    const details = (form.getFieldValue('priceDetails') ?? []) as Array<{
      productUnitId: number;
      salePrice?: number;
    }>;
    if (!details.length || !products.length) return;

    const unitToInfo = new Map<
      number,
      { productId: number; productName: string; unitName: string }
    >();
    products.forEach((p: any) => {
      (p.units ?? []).forEach((u: any) =>
        unitToInfo.set(u.id, {
          productId: p.id,
          productName: p.name,
          unitName: u.unitName,
        }),
      );
    });

    const pre = details
      .map((d) => {
        const info = unitToInfo.get(d.productUnitId);
        if (!info) return null;
        return {
          key: `${info.productId}-${d.productUnitId}`,
          productId: info.productId,
          productName: info.productName,
          unitId: d.productUnitId,
          unitName: info.unitName,
          salePrice: d.salePrice,
        } as Row;
      })
      .filter(Boolean) as Row[];

    setRows(pre);
  }, [products]);

  // priceDetails để submit
  const priceDetails = useMemo(
    () =>
      rows
        .filter(
          (r) => typeof r.salePrice === 'number' && !Number.isNaN(r.salePrice),
        )
        .map((r) => ({
          productUnitId: r.unitId,
          salePrice: Number(r.salePrice),
        })),
    [rows],
  );

  // ====== Cột bảng: chỉ SP, ĐVT (có thể đổi), Giá bán ======
  const columns: ColumnsType<Row> = [
    {
      title: 'Sản phẩm',
      dataIndex: 'productName',
      width: 320,
      render: (_, r) => <strong>{r.productName}</strong>,
    },
    {
      title: 'ĐVT',
      dataIndex: 'unitId',
      width: 220,
      render: (_, r) => {
        const usedInThisProduct = new Set(
          rows.filter((x) => x.productId === r.productId).map((x) => x.unitId),
        );
        const unitOpts = (
          products.find((p: any) => p.id === r.productId)?.units ?? []
        ).map((u: any) => ({
          label: `${u.unitName}${u.isBaseUnit ? '' : ` (x${u.conversionValue})`}`,
          value: u.id,
          disabled: usedInThisProduct.has(u.id) && u.id !== r.unitId,
        }));
        return (
          <Select
            value={r.unitId}
            onChange={(val) => changeUnitInRow(r, val)}
            options={unitOpts}
            style={{ width: '100%' }}
          />
        );
      },
    },
    {
      title: 'Giá bán',
      dataIndex: 'salePrice',
      align: 'right',
      width: 180,
      render: (_, r) => (
        <InputNumber
          min={0}
          value={r.salePrice}
          onChange={(v) =>
            setRows((prev) =>
              prev.map((x) =>
                x.key === r.key ? { ...x, salePrice: Number(v ?? 0) } : x,
              ),
            )
          }
          style={{ width: '100%' }}
          formatter={(val) =>
            `${(val ?? '').toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
          }
          parser={(val) => Number((val ?? '').toString().replace(/,/g, ''))}
          placeholder="Nhập giá"
        />
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 80,
      render: (_, r) => (
        <Button danger type="link" onClick={() => removeRow(r.key)}>
          Xoá
        </Button>
      ),
    },
  ];
  const { rules, onFinish } = useHook(handleSubmit, priceDetails);

  // ====== UI ======
  return (
    <Form<IPriceCreateRequest>
      form={form}
      layout="vertical"
      onFinish={onFinish}
    >
      {/* Hàng field cơ bản (giữ gọn một dòng) */}
      <div
        style={{
          border: '1px solid #eee',
          borderRadius: 12,
          padding: 12,
          marginBottom: 12,
        }}
      >
        <Row gutter={16}>
          <Col span={10}>
            <Form.Item
              name="priceName"
              label="Tên bảng giá"
              rules={[{ required: true, message: 'Bắt buộc' }]}
              style={{ marginBottom: 8 }}
            >
              <Input placeholder="VD: Bảng giá tháng 10" />
            </Form.Item>
          </Col>

          <Col span={10}>
            <Form.Item
              name="description"
              label="Mô tả"
              style={{ marginBottom: 8 }}
              rules={[rules]}
            >
              <Input.TextArea
                autoSize={{ minRows: 1, maxRows: 2 }}
                placeholder="Ghi chú (tùy chọn)"
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              name="status"
              label="Trạng thái"
              style={{ marginBottom: 8 }}
            >
              <Select
                options={[
                  { label: 'Áp dụng', value: 'ACTIVE' },
                  { label: 'Tạm ngưng', value: 'PAUSED' },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="startDate"
              label="Ngày bắt đầu"
              rules={[rules]}
              style={{ marginBottom: 8 }}
              required
            >
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="endDate"
              label="Ngày kết thúc"
              rules={[rules]}
              required
              style={{ marginBottom: 8 }}
            >
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>
      </div>

      {/* Ô tìm kiếm: mỗi option = SP – ĐVT; chọn là thêm ngay */}
      <Space style={{ marginBottom: 10 }} wrap>
        <Form.Item name="__searchPick" noStyle>
          <Select
            showSearch
            allowClear
            filterOption={false}
            placeholder="Tìm và chọn: Sản phẩm – ĐVT (chọn là thêm vào bảng)"
            style={{ minWidth: 520 }}
            value={undefined}
            onSearch={(v) => setSearchTerm(v)}
            options={searchOptions}
            optionFilterProp="label"
            loading={isLoadingProducts}
            onSelect={onPickProductUnit}
            prefix={<SvgSearchIcon width={14} height={14} />}
          />
        </Form.Item>
      </Space>

      {/* Bảng giá sản phẩm */}
      <Table<Row>
        rowKey="key"
        dataSource={rows}
        columns={columns}
        pagination={false}
        size="middle"
        sticky
        scroll={{ y: tableY }}
      />
    </Form>
  );
};

export default PriceForm;
