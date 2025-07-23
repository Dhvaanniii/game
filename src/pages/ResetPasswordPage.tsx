import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ResetPasswordPage: React.FC = () => {
  const query = useQuery();
  const token = query.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('none');
  const navigate = useNavigate();

  // Password validation logic from RegistrationPage
  const validatePassword = (password: string): { isValid: boolean; message: string; strength: string } => {
    if (!password) {
      return { isValid: false, message: 'Password is required', strength: 'none' };
    }
    if (password.length < 8) {
      return {
        isValid: false,
        message: 'Password must be at least 8 characters long',
        strength: 'weak',
      };
    }
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const missingRequirements = [];
    if (!hasUppercase) missingRequirements.push('uppercase letter');
    if (!hasLowercase) missingRequirements.push('lowercase letter');
    if (!hasNumber) missingRequirements.push('number');
    if (!hasSpecialChar) missingRequirements.push('special character');
    if (missingRequirements.length > 0) {
      return {
        isValid: false,
        message: `Password must include: ${missingRequirements.join(', ')}`,
        strength: 'weak',
      };
    }
    let strength = 'medium';
    if (password.length >= 12 && hasUppercase && hasLowercase && hasNumber && hasSpecialChar) {
      strength = 'strong';
    }
    return {
      isValid: true,
      message: 'Password meets all requirements',
      strength,
    };
  };

  const getPasswordStrengthColor = (strength: string) => {
    switch (strength) {
      case 'weak': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'strong': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };
  const getPasswordStrengthBar = (strength: string) => {
    switch (strength) {
      case 'weak': return 'w-1/3 bg-red-500';
      case 'medium': return 'w-2/3 bg-yellow-500';
      case 'strong': return 'w-full bg-green-500';
      default: return 'w-0 bg-gray-300';
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    const validation = validatePassword(e.target.value);
    setPasswordError(validation.isValid ? '' : validation.message);
    setPasswordStrength(validation.strength);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (!token) {
      setError('Invalid or missing token.');
      return;
    }
    const validation = validatePassword(password);
    if (!validation.isValid) {
      setError(validation.message);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    try {
      await apiService.resetPassword(token, password);
      setMessage('Password has been reset. You can now log in.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-fadeIn">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Reset Password</h1>
          <p className="text-gray-600">Enter your new password below.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter new password"
              required
            />
            {password && (
              <div className="mt-2 flex items-center gap-2">
                <div className={`h-2 rounded-full ${getPasswordStrengthBar(passwordStrength)}`} style={{ minWidth: 60, maxWidth: 120 }} />
                <span className={`text-xs ${getPasswordStrengthColor(passwordStrength)}`}>{passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}</span>
              </div>
            )}
            {passwordError && <div className="text-red-600 text-xs mt-1">{passwordError}</div>}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Confirm new password"
              required
            />
          </div>
          {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl">{message}</div>}
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">{error}</div>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
          <p className="text-xs text-gray-500 mt-2">
            Password must be at least 8 characters and include an uppercase letter, lowercase letter, number, and special character.
          </p>
        </form>
        <div className="mt-8 text-center">
          <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage; 