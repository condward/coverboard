import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter basename="/coverboard">
    <Routes>
      <Route path="/:saveId" Component={App} />
      <Route path="/" element={<Navigate to="default" />} />
    </Routes>
  </BrowserRouter>,
);
