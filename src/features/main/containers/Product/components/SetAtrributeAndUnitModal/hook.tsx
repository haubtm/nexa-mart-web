import { useAttributeList, useAttributeValueById } from '@/features/main';

export const useHook = () => {
  const { data: attributesData, isLoading: isAttributesLoading } =
    useAttributeList({});
  const { data: attributeValueData, isLoading: isAttributeValueLoading } =
    useAttributeValueById({ id: 1 });

  return {
    attributesData,
    isAttributesLoading,
    attributeValueData,
    isAttributeValueLoading,
  };
};
