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
    PROMOTION: {
      PATH: () => `/admin/promotion`,
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
    ORDER: {
      PATH: () => `/admin/order`,
      DETAIL: {
        PATH: () => `${ROUTE_PATH.ADMIN.ORDER.PATH()}/:invoiceId`,
        LINK: (invoiceId: string | number) =>
          `${ROUTE_PATH.ADMIN.ORDER.PATH()}/${invoiceId}`,
      },
    },
    ORDER_ADMIN: {
      PATH: () => `/admin/order-admin`,
    },
    REPORT: {
      PATH: () => `/admin/report`,
    },
    REFUND: {
      PATH: () => `/admin/refund`,
      DETAIL: {
        PATH: () => `${ROUTE_PATH.ADMIN.REFUND.PATH()}/:refundId`,
        LINK: (refundId: string | number) =>
          `${ROUTE_PATH.ADMIN.REFUND.PATH()}/${refundId}`,
      },
    },
    SALE: {
      PATH: () => `/admin/sale`,
    },
  },
  SALE: {
    PATH: () => `/sale`,
    DASHBOARD: {
      PATH: () => `${ROUTE_PATH.SALE.PATH()}/dashboard`,
    },
    ORDER: {
      PATH: () => `${ROUTE_PATH.SALE.PATH()}/order`,
    },
    REFUND: {
      PATH: () => `${ROUTE_PATH.SALE.PATH()}/refund`,
    },
    CREATE_REFUND_ORDER: {
      PATH: () => `${ROUTE_PATH.SALE.PATH()}/create/:orderId`,
      LINK: (orderId: string | number) =>
        `${ROUTE_PATH.SALE.PATH()}/create/${orderId}`,
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
