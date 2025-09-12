// SetAttributeAndUnitModal.tsx (dedupe attribute)
import { SvgPlusIcon } from '@/assets';
import type { IProductCreateRequest } from '@/dtos';
import {
  Button,
  Form,
  FormItem,
  FormList,
  IModalRef,
  Input,
  ModalNew,
  Select,
  Flex,
  Text,
  slug,
  cartesian,
} from '@/lib';
import {
  Card,
  FormInstance,
  Space,
  Table,
  Popover,
  Divider,
  message,
} from 'antd';
import type { RuleRender } from 'antd/es/form';
import type { RefObject } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useHook } from './hook';
import CreateAttributeModal from '../CreateAttributteModal';
import { useAttributeValueById } from '@/features/main/react-query';

type AttrValue = { attributeId: number; value: string };
type UnitTemplate = {
  unit?: string;
  basePrice?: number | string;
  cost?: number | string;
  onHand?: number | string;
  conversionValue?: number | string;
};

type MatrixRow = {
  rowKey: string; // comboKey::unit
  comboKey: string;
  comboLabel: string;
  attributes: AttrValue[];
  unit: string;
  conversionValue: number;
  sku?: string;
  cost: number;
  basePrice: number;
  onHand: number;
};

const makeComboKey = (attrs: AttrValue[]) =>
  attrs
    .slice()
    .sort(
      (a, b) => a.attributeId - b.attributeId || a.value.localeCompare(b.value),
    )
    .map((x) => `${x.attributeId}:${x.value}`)
    .join('|');

const makeComboLabel = (attrs: AttrValue[]) =>
  attrs.map((x) => String(x.value)).join(' - ');

// kiểm tra khóa sâu để tránh loop khi chính "matrix" thay đổi
const hasKeyDeep = (obj: any, target: string): boolean => {
  if (!obj || typeof obj !== 'object') return false;
  if (Object.prototype.hasOwnProperty.call(obj, target)) return true;
  return Object.values(obj).some((v) => hasKeyDeep(v, target));
};

// ---------- component ----------
interface ISetAttributeAndUnitModalProps {
  ref: RefObject<IModalRef | null>;
  form?: FormInstance<IProductCreateRequest>;
  rules: RuleRender;
  onFinish: (values: IProductCreateRequest) => void; // giữ để tương thích
  modalForm: FormInstance<any>;
}

// --- Component phụ để load value theo attributeId của dòng hiện tại ---
const AttributeValueSelect: React.FC<{
  form: FormInstance<any>;
  attrIdPath: (string | number)[];
  valuePath: (string | number)[];
  // 👇 nhận từ Form.Item (sẽ được inject tự động)
  value?: string[];
  onChange?: (v: string[]) => void;
}> = ({ form, attrIdPath, valuePath, value, onChange }) => {
  const attributeId = Form.useWatch(attrIdPath, form);
  const enabled = !!attributeId;

  const { data, isLoading } = useAttributeValueById({ id: attributeId });

  const options =
    data?.data?.map((v: any) => ({ label: v.value, value: v.value })) ?? [];

  // Khi đổi attributeId => reset value để tránh giữ value cũ không hợp lệ
  useEffect(() => {
    form.setFieldValue(valuePath, []);
  }, [attributeId]);

  return (
    <Select
      placeholder="Giá trị (tags: đỏ, trắng, ...)"
      mode="tags"
      style={{ width: 420 }}
      options={options}
      loading={isLoading && enabled}
      disabled={!enabled}
      // 👇 nhận/forward để Form ghi nhận thay đổi
      value={value}
      onChange={onChange as any}
    />
  );
};

const SetAttributeAndUnitModal = ({
  ref,
  form,
  rules,
  modalForm,
}: ISetAttributeAndUnitModalProps) => {
  const { attributesData, isAttributesLoading } = useHook();

  // Bảng sinh tự động
  const [matrixRows, setMatrixRows] = useState<MatrixRow[]>([]);

  // Quick set giá theo ĐƠN VỊ
  const [quickOpen, setQuickOpen] = useState(false);
  const [quickUnit, setQuickUnit] = useState<string>();
  const [quickBasePrice, setQuickBasePrice] = useState<string>('');
  const [quickCost, setQuickCost] = useState<string>('');

  // số dòng đơn vị / mỗi combo (để đánh dấu hàng đầu combo)
  const unitCount = useMemo(() => {
    if (matrixRows.length === 0) return 0;
    const first = matrixRows[0].comboKey;
    return matrixRows.filter((r) => r.comboKey === first).length || 0;
  }, [matrixRows]);

  // ---- Hàm rebuild ma trận từ allValues + baseUnit của form cha ----
  const rebuildMatrixFrom = (allValues: any) => {
    // 1) Thuộc tính
    const rawAttrs = (allValues?.attributes ?? []) as {
      attributeId?: number;
      value?: string[];
    }[];
    const attrGroups = rawAttrs.filter(
      (g) => g && g.attributeId && Array.isArray(g.value),
    ) as { attributeId: number; value: string[] }[];

    // 2) Đơn vị cơ bản từ Form cha
    const parentBase = form?.getFieldValue?.(['baseUnit']) || {};
    const baseUnit: UnitTemplate = {
      unit: parentBase?.unit,
      basePrice: parentBase?.basePrice,
      cost: parentBase?.cost,
      onHand: parentBase?.onHand,
      conversionValue: 1, // cố định 1
    };
    const baseUnitName = String(baseUnit.unit || '');

    // 3) Đơn vị bổ sung ở modal
    const rawUnits = (allValues?.additionalUnits ?? []) as UnitTemplate[];

    // 4) Ghép baseUnit + additionalUnits, loại trùng theo 'unit' (ưu tiên baseUnit)
    const unitMap = new Map<string, UnitTemplate>();
    if (baseUnitName) unitMap.set(baseUnitName, baseUnit);
    (rawUnits ?? []).forEach((u) => {
      if (!u?.unit) return;
      const key = String(u.unit);
      if (!unitMap.has(key)) unitMap.set(key, u);
    });
    const validUnits = Array.from(unitMap.values());

    // preserve chỉnh sửa hiện tại trong bảng (dựa rowKey)
    const prev = (allValues?.matrix ?? []) as MatrixRow[];
    const prevMap = new Map(prev.map((r) => [r.rowKey, r]));

    // 5) Tổ hợp thuộc tính
    const combos: AttrValue[][] =
      attrGroups.length > 0
        ? cartesian(
            attrGroups.map((g) =>
              (g.value ?? [])
                .map((v) => String(v))
                .filter(Boolean)
                .map((v) => ({ attributeId: g.attributeId, value: v })),
            ),
          )
        : [[]];

    const newMatrix: MatrixRow[] = [];
    combos.forEach((combo) => {
      const comboKey = makeComboKey(combo);
      const comboLabel = makeComboLabel(combo);
      validUnits.forEach((u) => {
        const unit = String(u.unit);
        const isBase = unit === baseUnitName && !!baseUnitName;
        const rowKey = `${comboKey}::${unit}`;
        const prevRow = prevMap.get(rowKey);

        newMatrix.push({
          rowKey,
          comboKey,
          comboLabel,
          attributes: combo,
          unit,
          // ✅ baseUnit luôn 1 và sync từ ngoài (không lấy prev)
          conversionValue: isBase
            ? 1
            : Number(prevRow?.conversionValue ?? u.conversionValue ?? 1) || 1,
          // ✅ Giá/ vốn/ tồn kho của baseUnit lấy từ form cha (luôn sync)
          cost: isBase
            ? Number(baseUnit.cost ?? 0) || 0
            : Number(prevRow?.cost ?? u.cost ?? 0) || 0,
          basePrice: isBase
            ? Number(baseUnit.basePrice ?? 0) || 0
            : Number(prevRow?.basePrice ?? u.basePrice ?? 0) || 0,
          onHand: isBase
            ? Number(baseUnit.onHand ?? 0) || 0
            : Number(prevRow?.onHand ?? u.onHand ?? 0) || 0,
          // SKU giữ theo prev (chỉ nhập ở hàng đầu combo)
          sku: prevRow?.sku,
        });
      });
    });

    modalForm.setFieldsValue({ matrix: newMatrix });
    setMatrixRows(newMatrix);
  };

  // Build 1 lần khi modal mount (nếu đã có giá trị)
  useEffect(() => {
    try {
      rebuildMatrixFrom(modalForm.getFieldsValue());
    } catch (error) {
      console.error('Lỗi khi rebuild matrix:', error);
    }
  }, []);

  // Columns
  const baseUnitName = String(
    form?.getFieldValue?.(['baseUnit', 'unit']) || '',
  );
  const columns = useMemo(
    () => [
      {
        title: 'Giá trị thuộc tính',
        dataIndex: 'comboLabel',
        width: 220,
        render: (_: any, record: MatrixRow, idx: number) => {
          const isFirst = unitCount > 0 ? idx % unitCount === 0 : true;
          return (
            <Flex vertical gap={2}>
              <Text strong>
                {matrixRows[idx]?.comboLabel || (record?.comboLabel ?? '-')}
              </Text>
              {!isFirst ? <Text type="secondary">(cùng biến thể)</Text> : null}
            </Flex>
          );
        },
      },
      {
        title: 'Đơn vị',
        dataIndex: 'unit',
        width: 120,
        render: (_: any, record: MatrixRow, idx: number) => (
          <FormItem noStyle name={['matrix', idx, 'unit']}>
            <Input readOnly />
          </FormItem>
        ),
      },
      {
        title: 'Quy đổi',
        dataIndex: 'conversionValue',
        width: 110,
        render: (_: any, record: MatrixRow, idx: number) => {
          const isBase = record.unit === baseUnitName && !!baseUnitName;
          return (
            <FormItem
              noStyle
              name={['matrix', idx, 'conversionValue']}
              rules={[{ required: true, message: 'Nhập quy đổi' }]}
            >
              <Input type="number" min={1} disabled={isBase} />
            </FormItem>
          );
        },
      },
      {
        title: 'Mã hàng (SKU biến thể)',
        dataIndex: 'sku',
        width: 200,
        render: (_: any, __: MatrixRow, idx: number) => {
          const isFirst = unitCount > 0 ? idx % unitCount === 0 : true;
          return (
            <FormItem noStyle name={['matrix', idx, 'sku']}>
              <Input placeholder="Tự động" disabled={!isFirst} />
            </FormItem>
          );
        },
      },
      {
        title: 'Giá vốn',
        dataIndex: 'cost',
        width: 120,
        render: (_: any, record: MatrixRow, idx: number) => (
          <FormItem noStyle name={['matrix', idx, 'cost']}>
            <Input
              type="number"
              min={0}
              disabled={record.unit === baseUnitName && !!baseUnitName}
            />
          </FormItem>
        ),
      },
      {
        title: 'Giá bán',
        dataIndex: 'basePrice',
        width: 140,
        render: (_: any, record: MatrixRow, idx: number) => (
          <FormItem noStyle name={['matrix', idx, 'basePrice']}>
            <Input
              type="number"
              min={0}
              disabled={record.unit === baseUnitName && !!baseUnitName}
            />
          </FormItem>
        ),
      },
      {
        title: 'Tồn kho',
        dataIndex: 'onHand',
        width: 120,
        render: (_: any, record: MatrixRow, idx: number) => (
          <FormItem noStyle name={['matrix', idx, 'onHand']}>
            <Input
              type="number"
              min={0}
              disabled={record.unit === baseUnitName && !!baseUnitName}
            />
          </FormItem>
        ),
      },
    ],
    [matrixRows, unitCount, baseUnitName],
  );

  // Quick apply theo đơn vị (bao gồm đơn vị cơ bản)
  const unitOptionsForQuick = useMemo(() => {
    const opts = new Set<string>();
    const parentBase = form?.getFieldValue?.(['baseUnit', 'unit']);
    if (parentBase) opts.add(String(parentBase));
    const additional = (modalForm.getFieldValue('additionalUnits') ||
      []) as UnitTemplate[];
    additional.forEach((u) => u?.unit && opts.add(String(u.unit)));
    return Array.from(opts).map((u) => ({ label: u, value: u }));
  }, [form, modalForm]);

  const applyQuickPrice = () => {
    const unit = quickUnit;
    if (!unit) return;
    const next = (modalForm.getFieldValue('matrix') as MatrixRow[]).map((r) =>
      r.unit === unit
        ? {
            ...r,
            basePrice:
              quickBasePrice !== '' ? Number(quickBasePrice) || 0 : r.basePrice,
            cost: quickCost !== '' ? Number(quickCost) || 0 : r.cost,
          }
        : r,
    );
    modalForm.setFieldsValue({ matrix: next });
    setQuickOpen(false);
  };

  const handleOk = async () => {
    await modalForm.validateFields();

    // Đảm bảo có ít nhất baseUnit
    const parentBase = form?.getFieldValue?.(['baseUnit']) || {};
    if (!parentBase?.unit) {
      message.warning('Vui lòng nhập Đơn vị cơ bản ở ngoài trước.');
      return;
    }

    const rows: MatrixRow[] = modalForm.getFieldValue('matrix') || [];

    // Nhóm theo comboKey => sinh variants[]
    const group = new Map<
      string,
      { attributes: AttrValue[]; rows: MatrixRow[] }
    >();
    rows.forEach((r) => {
      if (!group.has(r.comboKey))
        group.set(r.comboKey, { attributes: r.attributes, rows: [] });
      group.get(r.comboKey)!.rows.push(r);
    });

    const variants = Array.from(group.values()).map(({ attributes, rows }) => {
      const firstSKU = rows.find((r) => r.sku && r.sku.trim())?.sku?.trim();
      const autoSku =
        attributes.length > 0
          ? attributes.map((a) => slug(String(a.value))).join('-')
          : 'default';

      // ⚠️ Bảo đảm đơn vị cơ bản đứng đầu danh sách units
      const baseName = String(parentBase?.unit || '');
      const sortedRows = rows.slice().sort((a, b) => {
        const ai = a.unit === baseName ? -1 : 0;
        const bi = b.unit === baseName ? -1 : 0;
        return bi - ai;
      });

      return {
        sku: firstSKU || autoSku,
        attributes,
        units: sortedRows.map((r) => ({
          unit: r.unit,
          basePrice: Number(r.basePrice) || 0,
          cost: Number(r.cost) || 0,
          onHand: Number(r.onHand) || 0,
          conversionValue:
            r.unit === baseName ? 1 : Number(r.conversionValue) || 1,
        })),
      };
    });

    // set vào Form cha (và commit field)
    form?.setFields?.([{ name: 'variants', value: variants }]);
    form?.setFieldValue?.('variants', variants);
    form?.setFieldsValue?.({ variants });
    await form?.validateFields?.(['variants']);

    ref?.current?.hide();
  };

  return (
    <ModalNew
      ref={ref}
      width={1100}
      title="Thiết lập thuộc tính & đơn vị bổ sung"
      onCancel={() => ref?.current?.hide()}
      onOk={handleOk}
      openButton={
        <Button
          type="primary"
          icon={<SvgPlusIcon width={12} height={12} />}
          onClick={() => {
            const base = form?.getFieldValue?.(['baseUnit']) || {};
            const missingUnit = !base?.unit;
            const missingBasePrice =
              base?.basePrice == null || base?.basePrice === '';
            const missingCost = base?.cost == null || base?.cost === '';
            const missingOnHand = base?.onHand == null || base?.onHand === '';

            if (
              missingUnit ||
              missingBasePrice ||
              missingCost ||
              missingOnHand
            ) {
              message.warning(
                'Vui lòng nhập đầy đủ Đơn vị cơ bản (đơn vị, giá bán, giá vốn, tồn kho) trước khi thiết lập.',
              );
              return;
            }
            const parent = form?.getFieldsValue(['variants', 'baseUnit']) as {
              variants?: IProductCreateRequest['variants'];
              baseUnit?: {
                unit?: string;
                basePrice?: number;
                cost?: number;
                onHand?: number;
                conversionValue?: number;
              };
            };

            const variants = parent?.variants ?? [];

            // gom attributeId -> unique values từ variants cũ (nếu có)
            const attrMap = new Map<number, Set<string>>();
            variants?.forEach((v) =>
              v.attributes?.forEach((a) => {
                if (!attrMap.has(a.attributeId))
                  attrMap.set(a.attributeId, new Set());
                attrMap.get(a.attributeId)!.add(a.value);
              }),
            );
            const groupedAttrs =
              Array.from(attrMap.entries()).map(([attributeId, set]) => ({
                attributeId,
                value: Array.from(set),
              })) ?? [];

            // đơn vị bổ sung mặc định rỗng
            modalForm.setFieldsValue({
              attributes: groupedAttrs ?? [],
              additionalUnits: [], // baseUnit sẽ được chèn tự động khi build
              matrix: [],
            });

            // Build lần đầu khi mở (đồng bộ với baseUnit)
            setTimeout(() => rebuildMatrixFrom(modalForm.getFieldsValue()), 0);
            ref?.current?.open();
          }}
        >
          Thiết lập
        </Button>
      }
    >
      <Form
        form={modalForm}
        layout="vertical"
        // Mỗi khi form đổi, tự rebuild matrix trừ khi thay đổi chính là "matrix"
        onValuesChange={(changed, all) => {
          if (hasKeyDeep(changed, 'matrix')) return;
          rebuildMatrixFrom(all);
        }}
      >
        {/* ĐƠN VỊ BỔ SUNG */}
        <Card
          title={
            <Flex align="center" justify="space-between">
              <Text strong>Đơn vị bổ sung</Text>
              <Popover
                trigger="click"
                open={quickOpen}
                onOpenChange={setQuickOpen}
                content={
                  <div style={{ width: 280 }}>
                    <Text strong>Thiết lập giá nhanh theo đơn vị</Text>
                    <Divider style={{ margin: '8px 0' }} />
                    <FormItem label="Đơn vị">
                      <Select
                        placeholder="Chọn đơn vị"
                        value={quickUnit}
                        onChange={setQuickUnit as any}
                        options={unitOptionsForQuick}
                      />
                    </FormItem>
                    <FormItem label="Giá bán (áp dụng)">
                      <Input
                        placeholder="không đổi nếu bỏ trống"
                        value={quickBasePrice}
                        onChange={(e) => setQuickBasePrice(e.target.value)}
                      />
                    </FormItem>
                    <FormItem label="Giá vốn (áp dụng)">
                      <Input
                        placeholder="không đổi nếu bỏ trống"
                        value={quickCost}
                        onChange={(e) => setQuickCost(e.target.value)}
                      />
                    </FormItem>
                    <Button type="primary" block onClick={applyQuickPrice}>
                      Áp dụng
                    </Button>
                  </div>
                }
              >
                <Button type="link">Thiết lập giá</Button>
              </Popover>
            </Flex>
          }
        >
          <FormList name="additionalUnits">
            {(fields: any[], { add, remove }: any) => (
              <>
                <Space wrap size={[8, 8]}>
                  {fields.map(({ key, name, ...restField }) => (
                    <div
                      key={key}
                      style={{
                        border: '1px solid #eaeaea',
                        borderRadius: 8,
                        padding: 8,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <FormItem
                        label="Đơn vị"
                        {...restField}
                        name={[name, 'unit']}
                        rules={[{ required: true, message: 'Nhập đơn vị' }]}
                      >
                        <Input
                          placeholder="Đơn vị (vd: lốc, thùng)"
                          style={{ width: 140 }}
                        />
                      </FormItem>
                      <FormItem
                        label="Giá trị quy đổi"
                        {...restField}
                        name={[name, 'conversionValue']}
                        rules={[{ required: true, message: 'Quy đổi' }]}
                      >
                        <Input placeholder="Quy đổi" style={{ width: 96 }} />
                      </FormItem>
                      <FormItem
                        label="Giá bán"
                        {...restField}
                        name={[name, 'basePrice']}
                      >
                        <Input placeholder="Giá bán" style={{ width: 110 }} />
                      </FormItem>
                      <FormItem
                        label="Giá vốn"
                        {...restField}
                        name={[name, 'cost']}
                      >
                        <Input placeholder="Giá vốn" style={{ width: 100 }} />
                      </FormItem>
                      <FormItem
                        label="Tồn kho"
                        {...restField}
                        name={[name, 'onHand']}
                      >
                        <Input placeholder="Tồn kho" style={{ width: 100 }} />
                      </FormItem>
                      <Button danger onClick={() => remove(name)}>
                        Xóa
                      </Button>
                    </div>
                  ))}
                </Space>

                <Divider />

                <Button
                  type="dashed"
                  onClick={() =>
                    add({
                      unit: '',
                      conversionValue: 1,
                      basePrice: 0,
                      cost: 0,
                      onHand: 0,
                    })
                  }
                >
                  + Thêm đơn vị
                </Button>
              </>
            )}
          </FormList>
        </Card>

        {/* THUỘC TÍNH */}
        <Card title="Thuộc tính">
          <FormList name="attributes" rules={[rules]}>
            {(fields: any[], { add, remove }: any) => (
              <>
                {fields.map(({ key, name, ...restField }) => {
                  const attrIdPath = ['attributes', name, 'attributeId'];
                  const valuePath = ['attributes', name, 'value'];

                  // Danh sách attributeId đã chọn để disable option trùng (UI guard)
                  const all = modalForm.getFieldValue(['attributes']) || [];
                  const currentValue = all?.[name]?.attributeId;
                  const usedIds = (all || [])
                    .map((x: any) => x?.attributeId)
                    .filter((x: any) => x != null);

                  const attributeOptions =
                    attributesData?.data?.map((a: any) => ({
                      label: a.name,
                      value: a.id,
                      disabled: usedIds.includes(a.id) && a.id !== currentValue,
                    })) ?? [];

                  return (
                    <Space
                      key={key}
                      align="baseline"
                      style={{ display: 'flex', marginBottom: 8 }}
                    >
                      <FormItem
                        {...restField}
                        name={[name, 'attributeId']}
                        rules={[
                          { required: true, message: 'Chọn thuộc tính' },
                          {
                            // Rule chống trùng trong cùng Form.List
                            validator: async (_, value) => {
                              if (!value) return Promise.resolve();
                              const list =
                                modalForm.getFieldValue(['attributes']) || [];
                              const count = list.filter(
                                (row: any, idx: number) =>
                                  idx !== name && row?.attributeId === value,
                              ).length;
                              if (count > 0) {
                                return Promise.reject(
                                  new Error(
                                    'Thuộc tính này đã được chọn ở dòng khác',
                                  ),
                                );
                              }
                              return Promise.resolve();
                            },
                          },
                        ]}
                      >
                        <Select
                          loading={isAttributesLoading}
                          placeholder="Chọn thuộc tính"
                          popupRender={(menus) => (
                            <div>
                              <CreateAttributeModal />
                              {menus}
                            </div>
                          )}
                          options={attributeOptions}
                          style={{ width: 240 }}
                          onChange={() => {
                            // đổi attribute => reset value tương ứng
                            modalForm.setFieldValue(valuePath, []);
                          }}
                        />
                      </FormItem>

                      <FormItem {...restField} name={[name, 'value']}>
                        <AttributeValueSelect
                          form={modalForm}
                          attrIdPath={attrIdPath}
                          valuePath={valuePath}
                        />
                      </FormItem>

                      <Button danger onClick={() => remove(name)}>
                        Xóa
                      </Button>
                    </Space>
                  );
                })}
                <Button
                  type="dashed"
                  onClick={() => add({ attributeId: undefined, value: [] })}
                >
                  + Thêm thuộc tính
                </Button>
              </>
            )}
          </FormList>
        </Card>

        {/* BẢNG HÀNG CÙNG LOẠI */}
        <Card
          title={
            <Flex align="center" gap={8}>
              <Text strong>Hàng cùng loại</Text>
              <Text type="secondary">
                (đơn vị cơ bản + đơn vị bổ sung × thuộc tính)
              </Text>
            </Flex>
          }
        >
          <Table
            rowKey="rowKey"
            dataSource={matrixRows}
            columns={columns as any}
            pagination={false}
            size="small"
          />
        </Card>
      </Form>
    </ModalNew>
  );
};

export default SetAttributeAndUnitModal;
