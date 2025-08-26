import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import { AdminRoute, AuthRoute } from './routes';
import { NotFoundPage, ROUTE_PATH } from '@/common';
import QueryParamProvider from '../QueryParam';

const WithQueryParams = () => (
  <QueryParamProvider>
    <Outlet />
  </QueryParamProvider>
);

const PrivateRoute = () => {
  // const token = getStorageItem<string>(STORAGE_KEY.TOKEN);
  // if (!token) return <Navigate to={ROUTE_PATH.AUTH.LOGIN.PATH()} replace />;
  return <WithQueryParams />;
};

const AppRouterProvider = () => {
  return (
    <BrowserRouter>
      <Routes>
        {AuthRoute()}

        <Route path={ROUTE_PATH.HOME.PATH()} element={<PrivateRoute />}>
          {AdminRoute()}
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouterProvider;
