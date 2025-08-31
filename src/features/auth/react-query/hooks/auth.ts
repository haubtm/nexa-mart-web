import { useMutation } from '@tanstack/react-query';
import { client } from '../api';

export const useLogin = () => {
  return useMutation({
    mutationFn: client.auth.login,
  });
};
