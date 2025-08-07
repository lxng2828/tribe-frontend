import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import AppRoutes from './AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <AppRoutes />
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
