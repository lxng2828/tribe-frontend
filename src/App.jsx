import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { AuthProvider } from './contexts/AuthContext';
import { antdTheme } from './config/antdTheme';

import LoginPage from './config/pages/LoginPage/index.jsx';
import RegisterPage from './pages/RegisterPage/index.jsx';
import HomePage from './pages/HomePage/index.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage/index.jsx';
import VerifyOTPPage from './pages/VerifyOTPPage/index.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage/index.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';

function App() {
  return (
    <ConfigProvider theme={antdTheme}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/verify-otp" element={<VerifyOTPPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

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