// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ChatMenuPage from './pages/ChatMenuPage';
import ChatPage from './pages/ChatPage';
import EditProfilePage from './pages/EditProfilePage';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={token ? <DashboardPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/messages"
          element={token ? <ChatMenuPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/chat/:id"
          element={token ? <ChatPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/edit-profile"
          element={token ? <EditProfilePage /> : <Navigate to="/login" replace />}
        />
        <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;