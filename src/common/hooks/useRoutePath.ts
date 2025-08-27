import { useLocation } from 'react-router-dom';
import { ROUTE_PATH } from '../constants';

export const useRoutePath = () => {
  const { pathname } = useLocation();

  const isHomeRoute = pathname === ROUTE_PATH.HOME.PATH();
  const isAuthGroupRoute =
    pathname === ROUTE_PATH.AUTH.PATH() ||
    pathname.startsWith(`${ROUTE_PATH.AUTH.PATH()}/`);

  return {
    pathname,
    isHomeRoute,
    isAuthGroupRoute,
  };
};
