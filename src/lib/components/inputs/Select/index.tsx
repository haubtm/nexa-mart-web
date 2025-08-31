import { Select as AntdSelect } from 'antd';
import type { ComponentProps } from 'react';
import { Root } from './styles';

export interface ISelectProps extends ComponentProps<typeof AntdSelect> {}

const Select = (props: ISelectProps) => {
  const { loading, showSearch, allowClear, optionFilterProp, size, ...rest } =
    props;

  return (
    <Root
      loading={loading}
      showSearch={loading ? false : (showSearch ?? true)}
      allowClear={loading ? false : (allowClear ?? true)}
      optionFilterProp={optionFilterProp ?? 'label'}
      size={size ?? 'large'}
      {...rest}
    />
  );
};

export default Select;
