import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { UIProvider } from './context/UIContext';
import { Layout } from './components/Layout';

// Pages
import TaskFeed from './pages/TaskFeed';
import MyTasks from './pages/MyTasks';
import AddTask from './pages/AddTask';
import Requests from './pages/Requests';
import MyRequests from './pages/MyRequests';
import Settings from './pages/Settings';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPassword from './pages/ForgotPassword';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <UIProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              
              <Route path="/" element={<ProtectedRoute><TaskFeed /></ProtectedRoute>} />
              <Route path="/my-tasks" element={<ProtectedRoute><MyTasks /></ProtectedRoute>} />
              <Route path="/requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
              <Route path="/my-requests" element={<ProtectedRoute><MyRequests /></ProtectedRoute>} />
              <Route path="/add-task" element={<ProtectedRoute><AddTask /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </UIProvider>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
