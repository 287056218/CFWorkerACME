import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@theme/reset.css';
import '@theme/variables.css';
import '@theme/animations.css';
import '@theme/antd-override.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
