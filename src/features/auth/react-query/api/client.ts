import { Client } from '@/lib';

export const client = new Client({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
});
