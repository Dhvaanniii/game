import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider } from './contexts/GameContext';
import { AuthProvider } from './contexts/AuthContext';
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import HomePage from './pages/HomePage';
import TangramsPage from './pages/TangramsPage';
import TangramPlaygroundPage from './pages/TangramPlaygroundPage';
import FunThinkerPage from './pages/FunThinkerPage';
import FunThinkerBasicPage from './pages/FunThinkerBasicPage';
import FunThinkerMediumPage from './pages/FunThinkerMediumPage';
import FunThinkerHardPage from './pages/FunThinkerHardPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<IndexPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegistrationPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="*" element={<Navigate to="/" replace />} /> {/* Catch-all route with redirect */}
              {/* Protected routes */}
              <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
              <Route path="/tangrams" element={<ProtectedRoute><TangramsPage /></ProtectedRoute>} />
              <Route path="/tangrams/play/:level" element={<ProtectedRoute><TangramPlaygroundPage /></ProtectedRoute>} />
              <Route path="/funthinkers" element={<ProtectedRoute><FunThinkerPage /></ProtectedRoute>} />
              <Route path="/funthinkers/basic" element={<ProtectedRoute><FunThinkerBasicPage /></ProtectedRoute>} />
              <Route path="/funthinkers/medium" element={<ProtectedRoute><FunThinkerMediumPage /></ProtectedRoute>} />
              <Route path="/funthinkers/hard" element={<ProtectedRoute><FunThinkerHardPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            </Routes>
          </div>
        </Router>
      </GameProvider>
    </AuthProvider>
  );
}

export default App;