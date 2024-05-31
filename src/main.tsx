import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { DEFAULT_KEY, NAME_SPACE } from 'utils';

import { AppWrapper } from './AppWrapper.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={`/${NAME_SPACE}`}>
      <Routes>
        <Route path="/:saveId" Component={AppWrapper} />
        <Route path="/" element={<Navigate to={DEFAULT_KEY} />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
