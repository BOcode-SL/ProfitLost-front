import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CssBaseline } from '@mui/material';
import { GlobalThemeProvider } from './contexts/ThemeContext';

import './i18n';
import './index.scss';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalThemeProvider>
      <CssBaseline />
      <BrowserRouter>
        <App />
        <Toaster />
      </BrowserRouter>
    </GlobalThemeProvider>
  </StrictMode>,
)
