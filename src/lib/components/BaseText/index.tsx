import { ReactNode } from 'react';
import styled from 'styled-components';

export const FONT_SIZE = {
  xxxs: '0.625rem',
  xxs: '0.75rem',
  xs: '0.875rem',
  md: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  xxl: '1.5rem',
  xxxl: '1.625rem',
  xxxxl: '2rem',
};

export const FONT_WEIGHT = {
  thin: '100',
  extraLight: '200',
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extraBold: '800',
  black: '900',
};

export type FontWeightType = keyof typeof FONT_WEIGHT;
export type FontSizeType = keyof typeof FONT_SIZE;

interface IProps {
  fontSize?: FontSizeType;
  fontWeight?: FontWeightType;
  opacity?: string;
  children: ReactNode;
  style?: React.CSSProperties;
  lineHeight?: string;
  textAlign?: 'left' | 'center' | 'right';
  className?: string;
}

const BaseText: React.FC<IProps> = ({
  fontSize,
  fontWeight,
  opacity,
  children,
  style,
  lineHeight,
  textAlign,
  ...props
}) => {
  return (
    <TextCustom
      $fontWeight={fontWeight && FONT_WEIGHT?.[fontWeight]}
      $opacity={opacity}
      $fontSize={fontSize && FONT_SIZE?.[fontSize]}
      style={style}
      $lineHeight={lineHeight}
      $textAlign={textAlign}
      {...props}
    >
      {children}
    </TextCustom>
  );
};

export const TextCustom = styled.div<{
  $fontSize?: string;
  $fontWeight?: string;
  $opacity?: string;
  $lineHeight?: string;
  $textAlign?: string;
}>`
  font-size: ${(props) => props?.$fontSize ?? FONT_SIZE.xs};
  font-weight: ${(props) => props?.$fontWeight ?? FONT_WEIGHT.regular};
  opacity: ${(props) => props?.$opacity ?? '1'};
  line-height: ${(props) => props?.$lineHeight};
  text-align: ${(props) => props?.$textAlign ?? 'left'};
`;
export default BaseText;
