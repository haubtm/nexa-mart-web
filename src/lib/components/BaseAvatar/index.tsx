import { Avatar, AvatarProps } from 'antd';
import * as S from './styles';
import { useBaseImage } from '@/common';
export type BaseAvatarProps = AvatarProps;

interface BaseAvatarInterface extends React.FC<BaseAvatarProps> {
  Group: typeof Avatar.Group;
}

export const BaseAvatar: BaseAvatarInterface = (props) => {
  const { firstCharacterOfName, backgroundColor, color } = useBaseImage(props);

  return (
    <S.AvatarComponent
      $color={color}
      $backgroundColor={backgroundColor}
      {...props}
    >
      {!props?.src && firstCharacterOfName}
    </S.AvatarComponent>
  );
};

BaseAvatar.Group = Avatar.Group;
