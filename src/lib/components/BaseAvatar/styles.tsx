import { Avatar } from 'antd'
import styled from 'styled-components'

export const AvatarComponent = styled(Avatar)<{
  $color?: string
  $backgroundColor?: string
}>`
  background-color: ${props => props.$backgroundColor ?? ''};
  color: ${props => props.$color ?? ''};
`
