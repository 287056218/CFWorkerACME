import { ConfigProvider, App as AntdApp } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { HashRouter } from 'react-router-dom';
import { useEffect } from 'react';
import { useThemeStore } from '@stores/useThemeStore';
import { getAntdTheme } from '@theme/tokens';
import AppRoutes from './routes';

function App() {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  return (
    <ConfigProvider theme={getAntdTheme(theme)} locale={zhCN}>
      <AntdApp>
        <HashRouter>
          <AppRoutes />
        </HashRouter>
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;
