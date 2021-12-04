import React from 'react';
import App from './app';
import HostMainPage from './Components/Host/hostMainPage';
import ClientMainPage from './Components/Client/clientMainPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Portal } from './Components/portal';

export default (
  <App>
  <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portal />} />
        <Route path="/host" element={<HostMainPage />} />
        <Route path="/client" element={<ClientMainPage />} />
      </Routes>
  </BrowserRouter>
    </App>
);