import { useMutation, useQuery } from '@tanstack/react-query';
import { employeeKeys } from '../query-keys';
import type { IEmployeeByIdRequest, IEmployeeListRequest } from '@/dtos';
import { employeeApi } from '@/api';

export const useEmployeeList = (filters: IEmployeeListRequest) => {
  return useQuery({
    queryKey: employeeKeys.list(filters),
    queryFn: async () => await employeeApi.list(filters),
  });
};

export const useEmployeeById = (body: IEmployeeByIdRequest) => {
  return useQuery({
    queryKey: employeeKeys.detail(body.id),
    queryFn: async () => await employeeApi.byId(body),
  });
};

export const useEmployeeCreate = () => {
  return useMutation({
    mutationFn: employeeApi.create,
  });
};

export const useEmployeeUpdate = () => {
  return useMutation({
    mutationFn: employeeApi.update,
  });
};

export const useEmployeeDelete = () => {
  return useMutation({
    mutationFn: employeeApi.delete,
  });
};
