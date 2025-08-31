import { ROUTE_PATH } from '@/common';
import {
  BaseLayout as AuthBaseLayout,
  ForgotPasswordPage as AuthForgotPasswordPage,
  LoginPage as AuthLoginPage,
} from '@/features/auth';

import { getStorageItem, STORAGE_KEY } from '@/lib';
import QueryParamProvider from '@/providers/QueryParam';
import { Navigate, Outlet, Route } from 'react-router-dom';

const WithQueryParams = () => (
  <QueryParamProvider>
    <Outlet />
  </QueryParamProvider>
);

const AuthMiddleware = () => {
  const token = getStorageItem<string>(STORAGE_KEY.TOKEN);
  if (token) return <Navigate to={ROUTE_PATH.HOME.PATH()} replace />;
  return <WithQueryParams />;
};

export const AuthRoute = () => {
  return (
    <Route path={ROUTE_PATH.AUTH.PATH()} element={<AuthMiddleware />}>
      <Route element={<AuthBaseLayout />}>
        <Route
          index
          element={<Navigate to={ROUTE_PATH.AUTH.LOGIN.PATH()} replace />}
        />
        <Route
          path={ROUTE_PATH.AUTH.LOGIN.PATH()}
          element={<AuthLoginPage />}
        />
        <Route
          path={ROUTE_PATH.AUTH.FORGOT_PASSWORD.PATH()}
          element={<AuthForgotPasswordPage />}
        />
      </Route>
    </Route>
  );
};
