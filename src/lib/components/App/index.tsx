import { App as AntdApp } from 'antd';
import type { ComponentProps } from 'react';

export interface IAppProps extends ComponentProps<typeof AntdApp> {}

const App = (props: IAppProps) => {
  return <AntdApp {...props} />;
};

App.useApp = AntdApp.useApp;

export default App;
