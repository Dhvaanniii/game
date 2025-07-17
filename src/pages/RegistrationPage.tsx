import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getCountries, getStates, getCities } from '../data/locationData';
import { User, Mail, Lock, Globe, School, BookOpen, AlertCircle, CheckCircle } from 'lucide-react';

const RegistrationPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    realname: '',
    email: '',
    language: '',
    school: '',
    standard: '',
    board: '',
    country: '',
    state: '',
    city: '',
  });
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [availableStates, setAvailableStates] = useState<string[]>([]);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const { register } = useAuth();
  const navigate = useNavigate();

  // Enhanced email validation
  const validateEmail = (email: string): { isValid: boolean; message: string } => {
    if (!email) {
      return { isValid: false, message: 'Email is required' };
    }

    // Check if email has exactly 2 characters before @
    const beforeAt = email.split('@')[0];
    if (!beforeAt || beforeAt.length !== 2) {
      return { 
        isValid: false, 
        message: 'Email must contain exactly 2 characters before @ (e.g., ab@gmail.com)' 
      };
    }

    // Check if the 2 characters are alphanumeric
    const alphanumericRegex = /^[a-zA-Z0-9]{2}$/;
    if (!alphanumericRegex.test(beforeAt)) {
      return { 
        isValid: false, 
        message: 'The 2 characters before @ must be letters or numbers only' 
      };
    }

    // Check overall email format
    const emailRegex = /^[a-zA-Z0-9]{2}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return { 
        isValid: false, 
        message: 'Please enter a valid email format (e.g., ab@gmail.com)' 
      };
    }

    // Check for common email providers (optional validation)
    const domain = email.split('@')[1];
    const commonDomains = [
      'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 
      'aol.com', 'icloud.com', 'protonmail.com', 'mail.com'
    ];
    
    if (!commonDomains.includes(domain.toLowerCase())) {
      return { 
        isValid: true, // Still valid, just a warning
        message: 'Please use a common email provider (gmail.com, yahoo.com, etc.)' 
      };
    }

    return { isValid: true, message: 'Email format is correct' };
  };

  // Enhanced password validation
  const validatePassword = (password: string): { isValid: boolean; message: string; strength: string } => {
    if (!password) {
      return { isValid: false, message: 'Password is required', strength: 'none' };
    }

    if (password.length < 8) {
      return { 
        isValid: false, 
        message: 'Password must be at least 8 characters long', 
        strength: 'weak' 
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
        strength: 'weak'
      };
    }

    // Determine strength
    let strength = 'medium';
    if (password.length >= 12 && hasUppercase && hasLowercase && hasNumber && hasSpecialChar) {
      strength = 'strong';
    }

    return { 
      isValid: true, 
      message: 'Password meets all requirements', 
      strength 
    };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Email validation
    if (name === 'email') {
      const validation = validateEmail(value);
      setEmailError(validation.isValid ? '' : validation.message);
    }
    
    // Password validation
    if (name === 'password') {
      const validation = validatePassword(value);
      setPasswordError(validation.isValid ? '' : validation.message);
    }
    
    // Handle location dependencies
    if (name === 'country') {
      const states = getStates(value);
      setAvailableStates(states);
      setAvailableCities([]);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        state: '',
        city: ''
      }));
      return;
    }
    
    if (name === 'state') {
      const cities = getCities(formData.country, value);
      setAvailableCities(cities);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        city: ''
      }));
      return;
    }
    
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate email
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      setError(emailValidation.message);
      return;
    }

    // Validate password
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.message);
      return;
    }

    // Check password confirmation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Check username length
    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }

    // Check if username contains only alphanumeric characters and underscores
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(formData.username)) {
      setError('Username can only contain letters, numbers, and underscores');
      return;
    }
    
    // Check if all required fields are filled
    const requiredFields = ['username', 'password', 'realname', 'email', 'language', 'school', 'standard', 'board', 'country', 'state', 'city'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      setError(`Please fill all required fields: ${missingFields.join(', ')}`);
      return;
    }

    setIsLoading(true);

    try {
      const { confirmPassword, ...userData } = formData;
      const success = await register(userData);
      if (success) {
        navigate('/home');
      } else {
        setError('Registration failed. Username might already exist. Please try a different username.');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl animate-fadeIn">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
          <p className="text-gray-600">Join us and start your puzzle adventure</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username*
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Choose a username (min 3 chars)"
                  required
                  minLength={3}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Only letters, numbers, and underscores allowed</p>
            </div>

            <div>
              <label htmlFor="realname" className="block text-sm font-medium text-gray-700 mb-1">
                Real Name*
              </label>
              <input
                type="text"
                id="realname"
                name="realname"
                value={formData.realname}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Your full name"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email*
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    emailError ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="ab@gmail.com (exactly 2 chars before @)"
                  required
                />
                {formData.email && !emailError && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
                )}
                {emailError && (
                  <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 w-5 h-5" />
                )}
              </div>
              {emailError && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {emailError}
                </p>
              )}
              {formData.email && !emailError && (
                <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Email format is correct
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Must have exactly 2 characters before @ (e.g., ab@gmail.com, 12@yahoo.com)
              </p>
            </div>

            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                Language*
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  id="language"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                >
                  <option value="">Select Language</option>
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Hindi">Hindi</option>
                </select>
              </div>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password*
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    passwordError ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Create a strong password"
                  required
                />
              </div>
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div className={`h-2 rounded-full transition-all duration-300 ${
                        getPasswordStrengthBar(validatePassword(formData.password).strength)
                      }`}></div>
                    </div>
                    <span className={`text-xs font-medium ${
                      getPasswordStrengthColor(validatePassword(formData.password).strength)
                    }`}>
                      {validatePassword(formData.password).strength.toUpperCase()}
                    </span>
                  </div>
                  {passwordError ? (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {passwordError}
                    </p>
                  ) : (
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Password meets requirements
                    </p>
                  )}
                </div>
              )}
              <div className="text-xs text-gray-500 mt-1">
                <p>Password must contain:</p>
                <ul className="list-disc list-inside ml-2 space-y-1">
                  <li>At least 8 characters</li>
                  <li>One uppercase letter (A-Z)</li>
                  <li>One lowercase letter (a-z)</li>
                  <li>One number (0-9)</li>
                  <li>One special character (!@#$%^&*)</li>
                </ul>
              </div>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password*
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Confirm your password"
                  required
                />
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
                )}
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
              )}
            </div>

            <div>
              <label htmlFor="school" className="block text-sm font-medium text-gray-700 mb-1">
                School*
              </label>
              <div className="relative">
                <School className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  id="school"
                  name="school"
                  value={formData.school}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Your school name"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="standard" className="block text-sm font-medium text-gray-700 mb-1">
                Standard/Grade*
              </label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  id="standard"
                  name="standard"
                  value={formData.standard}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                >
                  <option value="">Select Standard</option>
                  {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                    <option key={num} value={`${num}th Grade`}>{num}th Grade</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="board" className="block text-sm font-medium text-gray-700 mb-1">
                Board*
              </label>
              <select
                id="board"
                name="board"
                value={formData.board}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              >
                <option value="">Select Board</option>
                <option value="CBSE">CBSE</option>
                <option value="ICSE">ICSE</option>
                <option value="State Board">State Board</option>
                <option value="IB">IB</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                Country*
              </label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              >
                <option value="">Select Country</option>
                {getCountries().map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                State*
              </label>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                disabled={!formData.country}
                required
              >
                <option value="">Select State</option>
                {availableStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                City*
              </label>
              <select
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                disabled={!formData.state}
                required
              >
                <option value="">Select City</option>
                {availableCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || emailError !== '' || passwordError !== ''}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;