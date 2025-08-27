import { Link as ReactLink } from 'react-router-dom';
import type { ComponentProps } from 'react';
import { Root } from './styles';

export interface ILinkProps extends ComponentProps<typeof ReactLink> {}

const Link = (props: ILinkProps) => {
  return <Root {...props} />;
};

export default Link;
