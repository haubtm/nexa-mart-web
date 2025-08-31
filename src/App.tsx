import { useEffect } from 'react';
import { getStorageItem, STORAGE_KEY } from './lib';
import {
  AntdProvider,
  AppRouterProvider,
  ReactQueryProvider,
} from './providers';
import { useAppDispatch } from './redux/hooks';
import { getUserInfo } from './redux/slices/userSlice';

function App() {
  const dispatch = useAppDispatch();

  const getInfo = async () => {
    const token = getStorageItem<string>(STORAGE_KEY.TOKEN);
    if (token) {
      await dispatch(getUserInfo());
    }
  };

  useEffect(() => {
    getInfo();
  }, []);

  return (
    <ReactQueryProvider>
      <AntdProvider>
        <AppRouterProvider />
      </AntdProvider>
    </ReactQueryProvider>
  );
}

export default App;
