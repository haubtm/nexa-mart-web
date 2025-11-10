import { IAdminOrderListRequest } from '@/dtos/order';

export const orderAdminKeys = {
  all: ['orderAdmin'] as const,
  lists: () => [...orderAdminKeys.all, 'list'] as const,
  list: (body: IAdminOrderListRequest) =>
    [...orderAdminKeys.lists(), { body }] as const,
  details: () => [...orderAdminKeys.all, 'detail'] as const,
  detail: (id: number) => [...orderAdminKeys.details(), id] as const,
};
