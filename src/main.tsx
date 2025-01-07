import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CssBaseline } from '@mui/material';
import { ThemeProviderWrapper } from './theme/ThemeContext';

import './index.scss'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProviderWrapper>
      <CssBaseline />
      <BrowserRouter>
        <App />
        <Toaster />
      </BrowserRouter>
    </ThemeProviderWrapper>
  </StrictMode>,
)
