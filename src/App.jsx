import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { AuthProvider } from './contexts/AuthContext';
import { antdTheme } from './config/antdTheme';

import LoginPage from './config/pages/LoginPage/index.jsx';
import RegisterPage from './pages/RegisterPage/index.jsx';
import HomePage from './pages/HomePage/index.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';

function App() {
  return (
    <ConfigProvider theme={antdTheme}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;