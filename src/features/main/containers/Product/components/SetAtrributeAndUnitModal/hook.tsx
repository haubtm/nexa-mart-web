import { useAttributeList } from '@/features/main';

export const useHook = () => {
  const { data: attributesData, isLoading: isAttributesLoading } =
    useAttributeList({});

  return {
    attributesData,
    isAttributesLoading,
  };
};
