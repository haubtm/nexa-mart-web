import { useEffect, useState } from 'react';
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
  const [isLoading, setIsLoading] = useState(true);

  const getInfo = async () => {
    const token = getStorageItem<string>(STORAGE_KEY.TOKEN);
    if (token) {
      try {
        await dispatch(getUserInfo());
      } catch (error) {
        console.error('Error loading user info:', error);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getInfo();
  }, [dispatch]);

  if (isLoading) {
    return null;
  }

  return (
    <ReactQueryProvider>
      <AntdProvider>
        <AppRouterProvider />
      </AntdProvider>
    </ReactQueryProvider>
  );
}

export default App;
