import React from 'react';
import ReactDOM from 'react-dom/client';
import './style.css';
import { DashboardApp } from './modules/DashboardApp';

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <React.StrictMode>
    <DashboardApp />
  </React.StrictMode>
);
