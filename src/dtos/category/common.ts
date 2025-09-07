export interface ICategoryResponseData {
  id: number;
  name: string;
  description: string;
  level: number;
  parentId?: number | null;
  parentName?: string | null;
  children?: ICategoryResponseData[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}
