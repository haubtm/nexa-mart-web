import { Outlet } from 'react-router-dom';
import { Root } from './styles';

const BaseLayout = () => {
  return (
    <Root>
      <Outlet />
    </Root>
  );
};

export default BaseLayout;
