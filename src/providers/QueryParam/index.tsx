import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  QueryParamProvider as BaseQueryParamProvider,
  type PartialLocation,
  type QueryParamAdapterComponent,
} from 'use-query-params';

const ReactRouter7Adapter: QueryParamAdapterComponent = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return children({
    location,
    push: ({ search, state }: PartialLocation) =>
      navigate({ search }, { state }),
    replace: ({ search, state }: PartialLocation) =>
      navigate({ search }, { replace: true, state }),
  });
};

interface IQueryParamProviderProps {
  children: ReactNode;
}

const QueryParamProvider = (props: IQueryParamProviderProps) => {
  const { children } = props;

  return (
    <BaseQueryParamProvider adapter={ReactRouter7Adapter}>
      {children}
    </BaseQueryParamProvider>
  );
};

export default QueryParamProvider;
