import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider } from './contexts/GameContext';
import { AuthProvider } from './contexts/AuthContext';
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import HomePage from './pages/HomePage';
import TengramsPage from './pages/TengramsPage';
import TengramPlaygroundPage from './pages/TengramPlaygroundPage';
import FunThinkerPage from './pages/FunThinkerPage';
import FunThinkerBasicPage from './pages/FunThinkerBasicPage';
import FunThinkerMediumPage from './pages/FunThinkerMediumPage';
import FunThinkerHardPage from './pages/FunThinkerHardPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
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
              <Route path="*" element={<Navigate to="/" replace />} /> {/* Catch-all route with redirect */}
              {/* Protected routes */}
              <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
              <Route path="/tengrams" element={<ProtectedRoute><TengramsPage /></ProtectedRoute>} />
              <Route path="/tengrams/play/:level" element={<ProtectedRoute><TengramPlaygroundPage /></ProtectedRoute>} />
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