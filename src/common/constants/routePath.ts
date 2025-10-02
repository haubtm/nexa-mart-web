export const ROUTE_PATH = {
  HOME: {
    PATH: () => `/`,
  },
  ADMIN: {
    PATH: () => `/admin`,
    DASHBOARD: {
      PATH: () => `/admin/dashboard`,
    },
    PRODUCT: {
      PATH: () => `/admin/product`,
    },
    CUSTOMER: {
      PATH: () => `/admin/customer`,
    },
    EMPLOYEE: {
      PATH: () => `/admin/employee`,
    },
    IMPORTS: {
      PATH: () => `/admin/imports`,
    },
    PRICE: {
      PATH: () => `/admin/price`,
    },
    TRANSACTION: {
      PATH: () => `/admin/transaction`,
    },
    SETTING: {
      PATH: () => `/admin/setting`,
    },
    STOCK_TAKE: {
      PATH: () => `/admin/stock-take`,
    },
    SUPPLIER: {
      PATH: () => `/admin/supplier`,
    },
    WAREHOUSE: {
      PATH: () => `/admin/warehouse`,
    },
  },
  AUTH: {
    PATH: () => `/auth`,
    LOGIN: {
      PATH: () => `${ROUTE_PATH.AUTH.PATH()}/login`,
    },
    FORGOT_PASSWORD: {
      PATH: () => `${ROUTE_PATH.AUTH.PATH()}/forgot-password`,
    },
  },
  EMPLOYEE: {
    PATH: () => `/employee`,
    DASHBOARD: {
      PATH: () => `${ROUTE_PATH.EMPLOYEE.PATH()}/dashboard`,
    },
  },
};
