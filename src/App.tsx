import { AntdProvider, AppRouterProvider } from './providers';

function App() {
  return (
    <AntdProvider>
      <AppRouterProvider />
    </AntdProvider>
  );
}

export default App;
