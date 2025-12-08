import { useMutation, useQuery } from '@tanstack/react-query';
import { saleKeys } from '../query-keys';
import type {
  IOrderByIdRequest,
  IOrderByInvoiceIdRequest,
  IOrderListRequest,
} from '@/dtos';
import { saleApi } from '@/api';

export const useOrderList = (filters: IOrderListRequest) => {
  return useQuery({
    queryKey: saleKeys.list(filters),
    queryFn: async () => await saleApi.list(filters),
  });
};

export const useOrderByInvoiceId = (filters: IOrderByInvoiceIdRequest) => {
  return useQuery({
    queryKey: saleKeys.byInvoiceId(filters.invoiceId),
    queryFn: async () => await saleApi.byInvoiceId(filters),
  });
};

export const useOrderStatus = (filters: IOrderByIdRequest) => {
  return useQuery({
    queryKey: saleKeys.byId(filters),
    queryFn: async () => await saleApi.byId(filters),
  });
};

export const useOrderCreate = () => {
  return useMutation({
    mutationFn: saleApi.create,
  });
};

export const useOrderPrintPDF = () => {
  return useMutation({
    mutationFn: saleApi.print,
  });
};
