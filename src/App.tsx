import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GameProvider } from './contexts/GameContext';
import { AuthProvider } from './contexts/AuthContext';
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import HomePage from './pages/HomePage';
import TanglePage from './pages/TanglePage';
import TanglePlaygroundPage from './pages/TanglePlaygroundPage';
import FunThinkerPage from './pages/FunThinkerPage';
import FunThinkerBasicPage from './pages/FunThinkerBasicPage';
import FunThinkerMediumPage from './pages/FunThinkerMediumPage';
import FunThinkerHardPage from './pages/FunThinkerHardPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
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
              <Route path="/home" element={<HomePage />} />
              <Route path="/tangles" element={<TanglePage />} />
              <Route path="/tangles/play/:level" element={<TanglePlaygroundPage />} />
              <Route path="/funthinkers" element={<FunThinkerPage />} />
              <Route path="/funthinkers/basic" element={<FunThinkerBasicPage />} />
              <Route path="/funthinkers/medium" element={<FunThinkerMediumPage />} />
              <Route path="/funthinkers/hard" element={<FunThinkerHardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </div>
        </Router>
      </GameProvider>
    </AuthProvider>
  );
}

export default App;