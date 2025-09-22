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
  cartesian,
} from '@/lib';
import { Card, FormInstance, Space, Table, message } from 'antd';
import type { RuleRender } from 'antd/es/form';
import type { RefObject } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useHook } from './hook';
import CreateAttributeModal from '../CreateAttributteModal';
import { useAttributeValueById } from '@/features/main/react-query';

type AttrValue = { attributeId: number; value: string };
type UnitTemplate = {
  unit?: string;
  conversionValue?: number | string;
};

type MatrixRow = {
  rowKey: string; // comboKey::unit
  comboKey: string;
  comboLabel: string;
  attributes: AttrValue[];
  unit: string;
  conversionValue: number;
  barcode?: string;
  variantCode?: string;
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

  // số dòng đơn vị / mỗi combo (để đánh dấu hàng đầu combo)
  const unitCount = useMemo(() => {
    if (matrixRows.length === 0) return 0;
    const first = matrixRows[0].comboKey;
    return matrixRows.filter((r) => r.comboKey === first).length || 0;
  }, [matrixRows]);

  // ---- Hàm rebuild ma trận từ allValues + baseUnit của form cha ----
  const rebuildMatrixFrom = (allValues: any) => {
    const rawAttrs = (allValues?.attributes ?? []) as {
      attributeId?: number;
      value?: string[];
    }[];
    const attrGroups = rawAttrs.filter(
      (g) => g && g.attributeId && Array.isArray(g.value),
    ) as { attributeId: number; value: string[] }[];

    const parentBase = form?.getFieldValue?.(['baseUnit']) || {};
    const baseUnitName = String(parentBase?.unit || '');

    const rawUnits = (allValues?.additionalUnits ?? []) as UnitTemplate[];

    const unitMap = new Map<string, UnitTemplate>();
    if (baseUnitName)
      unitMap.set(baseUnitName, { unit: baseUnitName, conversionValue: 1 });
    (rawUnits ?? []).forEach((u) => {
      if (!u?.unit) return;
      const key = String(u.unit);
      if (!unitMap.has(key)) unitMap.set(key, u);
    });
    const validUnits = Array.from(unitMap.values());

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
          conversionValue: isBase
            ? 1
            : Number(prevRow?.conversionValue ?? u.conversionValue ?? 1) || 1,
          barcode: prevRow?.barcode,
          variantCode: prevRow?.variantCode,
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
    } catch (e) {
      console.error(e);
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
        render: (_: any, __: MatrixRow, idx: number) => (
          <FormItem noStyle name={['matrix', idx, 'unit']}>
            <Input readOnly />
          </FormItem>
        ),
      },
      {
        title: 'Quy đổi',
        dataIndex: 'conversionValue',
        width: 110,
        render: (_: any, record: MatrixRow, idx: number) => (
          <FormItem
            noStyle
            name={['matrix', idx, 'conversionValue']}
            rules={[{ required: true, message: 'Nhập quy đổi' }]}
          >
            <Input
              type="number"
              min={1}
              disabled={record.unit === baseUnitName && !!baseUnitName}
            />
          </FormItem>
        ),
      },
      {
        title: 'Mã vạch (barcode)',
        dataIndex: 'barcode',
        width: 180,
        render: (_: any, __: MatrixRow, idx: number) => (
          <FormItem noStyle name={['matrix', idx, 'barcode']}>
            <Input placeholder="VD: 893xxxx" />
          </FormItem>
        ),
      },
      {
        title: 'Mã sản phẩm (variantCode)',
        dataIndex: 'variantCode',
        width: 200,
        render: (_: any, __: MatrixRow, idx: number) => (
          <FormItem noStyle name={['matrix', idx, 'variantCode']}>
            <Input placeholder="VD: sp123" />
          </FormItem>
        ),
      },
    ],
    [matrixRows, unitCount, baseUnitName],
  );

  const handleOk = async () => {
    await modalForm.validateFields();

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

    const baseName = String(parentBase?.unit || '');

    const variants = Array.from(group.values()).map(({ attributes, rows }) => {
      const sortedRows = rows.slice().sort((a, b) => {
        const ai = a.unit === baseName ? -1 : 0;
        const bi = b.unit === baseName ? -1 : 0;
        return bi - ai;
      });

      return {
        attributes,
        units: sortedRows.map((r) => ({
          unit: r.unit,
          conversionValue:
            r.unit === baseName ? 1 : Number(r.conversionValue) || 1,
          barcode: r.barcode?.trim() || undefined,
          variantCode: r.variantCode?.trim() || undefined,
          isBaseUnit: r.unit === baseName,
        })),
      };
    });

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
            if (!base?.unit) {
              message.warning(
                'Vui lòng nhập Đơn vị cơ bản trước khi thiết lập.',
              );
              return;
            }
            const parent = form?.getFieldsValue(['variants', 'baseUnit']) as {
              variants?: IProductCreateRequest['variants'];
              baseUnit?: {
                unit?: string;
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
        <Card title={<Text strong>Đơn vị bổ sung</Text>}>
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
                      <Button danger onClick={() => remove(name)}>
                        Xóa
                      </Button>
                    </div>
                  ))}
                </Space>
                <Button
                  type="dashed"
                  onClick={() => add({ unit: '', conversionValue: 1 })}
                  style={{ marginTop: 8 }}
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
                            validator: async (_, _value) => {
                              const list =
                                modalForm.getFieldValue(['attributes']) || [];
                              const count = list.filter(
                                (row: any, idx: number) =>
                                  idx !== name && row?.attributeId === _value,
                              ).length;
                              if (count > 0)
                                throw new Error(
                                  'Thuộc tính này đã được chọn ở dòng khác',
                                );
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
                        />
                      </FormItem>
                      <FormItem
                        {...restField}
                        name={[name, 'value']}
                        rules={[{ required: true, message: 'Chọn giá trị' }]}
                      >
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
