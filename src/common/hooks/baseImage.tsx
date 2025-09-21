import {
  backgroundColorAvatarMap,
  colorAvatarMap,
} from '@/lib/components/BaseAvatar/contant';
import { AvatarProps } from 'antd';
import { useMemo } from 'react';
export const REGEX_REMOVE_SPECIAL_CHARACTERS = /[()!@#$%]/g;

export const mapColorWithFirstCharacter = (firstCharacter: string) => {
  const character = firstCharacter.toUpperCase();
  const backgroundColor = backgroundColorAvatarMap[character as keyof typeof backgroundColorAvatarMap];
  const color = colorAvatarMap[character as keyof typeof colorAvatarMap];
  return { backgroundColor, color };
};

export const useBaseImage = ({ alt, src }: AvatarProps) => {
  const firstCharacterOfName = useMemo(() => {
    if (src) return 'P';

    if (!alt) return 'P';

    const nameSplit = alt?.trim()?.split(' ') ?? [];
    const name = nameSplit?.[0] ?? '';
    const res = name?.replace(REGEX_REMOVE_SPECIAL_CHARACTERS, '');

    return res?.charAt(0);
  }, [alt, src]);

  const color = useMemo(() => {
    if (src) return '';
    return mapColorWithFirstCharacter(firstCharacterOfName).color;
  }, [firstCharacterOfName, src]);

  const backgroundColor = useMemo(() => {
    if (src) return '';
    return mapColorWithFirstCharacter(firstCharacterOfName).backgroundColor;
  }, [firstCharacterOfName, src]);

  return { color, backgroundColor, firstCharacterOfName };
};
