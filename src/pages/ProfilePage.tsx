import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import { getCountries, getStates, getCities, hasStates, hasCities, isStateRequired, isCityRequired } from '../data/locationData';
import { User, Mail, Globe, School, BookOpen, MapPin, Edit2, Save, X } from 'lucide-react';
import { apiService } from '../services/api';

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    realname: user?.realname || '',
    email: user?.email || '',
    language: user?.language || '',
    school: user?.school || '',
    standard: user?.standard || '',
    board: user?.board || '',
    country: user?.country || '',
    state: user?.state || '',
    city: user?.city || '',
  });
  const [availableStates, setAvailableStates] = useState<string[]>([]);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [isStateRequired, setIsStateRequired] = useState(true);
  const [isCityRequired, setIsCityRequired] = useState(true);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isChanging, setIsChanging] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle location dependencies
    if (name === 'country') {
      const states = getStates(value);
      const countryHasStates = hasStates(value);
      
      setAvailableStates(states);
      setAvailableCities([]);
      setIsStateRequired(countryHasStates);
      setIsCityRequired(!countryHasStates); // If no states, city is required directly
      
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
      const stateHasCities = hasCities(formData.country, value);
      
      setAvailableCities(cities);
      setIsCityRequired(stateHasCities);
      
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

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      realname: user?.realname || '',
      email: user?.email || '',
      language: user?.language || '',
      school: user?.school || '',
      standard: user?.standard || '',
      board: user?.board || '',
      country: user?.country || '',
      state: user?.state || '',
      city: user?.city || '',
    });
    setIsEditing(false);
  };

  // Initialize location data when editing starts
  const handleEditStart = () => {
    setIsEditing(true);
    
    // Initialize states and cities based on current user data
    if (user?.country) {
      const states = getStates(user.country);
      const countryHasStates = hasStates(user.country);
      
      setAvailableStates(states);
      setIsStateRequired(countryHasStates);
      
      if (user?.state && countryHasStates) {
        const cities = getCities(user.country, user.state);
        const stateHasCities = hasCities(user.country, user.state);
        
        setAvailableCities(cities);
        setIsCityRequired(stateHasCities);
      } else {
        setIsCityRequired(!countryHasStates);
      }
    }
  };

  const validatePassword = (password: string): { isValid: boolean; message: string } => {
    if (!password) return { isValid: false, message: 'Password is required' };
    if (password.length < 8) return { isValid: false, message: 'Password must be at least 8 characters' };
    if (!/[A-Z]/.test(password)) return { isValid: false, message: 'Password must include an uppercase letter' };
    if (!/[a-z]/.test(password)) return { isValid: false, message: 'Password must include a lowercase letter' };
    if (!/\d/.test(password)) return { isValid: false, message: 'Password must include a number' };
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return { isValid: false, message: 'Password must include a special character' };
    return { isValid: true, message: '' };
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError('All fields are required.');
      return;
    }
    const validation = validatePassword(newPassword);
    if (!validation.isValid) {
      setPasswordError(validation.message);
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }
    setIsChanging(true);
    try {
      await apiService.changePassword(oldPassword, newPassword, confirmPassword);
      setPasswordSuccess('Password changed successfully.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to change password.');
    } finally {
      setIsChanging(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">{user.realname}</h1>
                  <p className="text-blue-100">@{user.username}</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                {!isEditing ? (
                  <button
                    onClick={handleEditStart}
                    className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline w-4 h-4 mr-2" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="realname"
                    value={formData.realname}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-800 font-medium">{user.realname}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="inline w-4 h-4 mr-2" />
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-800 font-medium">{user.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Globe className="inline w-4 h-4 mr-2" />
                  Language
                </label>
                {isEditing ? (
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Hindi">Hindi</option>
                  </select>
                ) : (
                  <p className="text-gray-800 font-medium">{user.language}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <School className="inline w-4 h-4 mr-2" />
                  School
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="school"
                    value={formData.school}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-800 font-medium">{user.school}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <BookOpen className="inline w-4 h-4 mr-2" />
                  Standard/Grade
                </label>
                {isEditing ? (
                  <select
                    name="standard"
                    value={formData.standard}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="1st Grade">1st Grade</option>
                    <option value="2nd Grade">2nd Grade</option>
                    <option value="3rd Grade">3rd Grade</option>
                    <option value="4th Grade">4th Grade</option>
                    <option value="5th Grade">5th Grade</option>
                    <option value="6th Grade">6th Grade</option>
                    <option value="7th Grade">7th Grade</option>
                    <option value="8th Grade">8th Grade</option>
                    <option value="9th Grade">9th Grade</option>
                    <option value="10th Grade">10th Grade</option>
                  </select>
                ) : (
                  <p className="text-gray-800 font-medium">{user.standard}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <BookOpen className="inline w-4 h-4 mr-2" />
                  Board
                </label>
                {isEditing ? (
                  <select
                    name="board"
                    value={formData.board}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="CBSE">CBSE</option>
                    <option value="ICSE">ICSE</option>
                    <option value="State Board">State Board</option>
                    <option value="IB">IB</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <p className="text-gray-800 font-medium">{user.board}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline w-4 h-4 mr-2" />
                  Country
                </label>
                {isEditing ? (
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Country</option>
                    {getCountries().map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-800 font-medium">{user.country}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline w-4 h-4 mr-2" />
                  State
                </label>
                {isEditing ? (
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={!formData.country || !isStateRequired}
                  >
                    <option value="">{isStateRequired ? "Select State" : "No states available"}</option>
                    {availableStates.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-800 font-medium">{user.state}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline w-4 h-4 mr-2" />
                  City
                </label>
                {isEditing ? (
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={!formData.state && isStateRequired}
                  >
                    <option value="">{isCityRequired ? "Select City" : "No cities available"}</option>
                    {availableCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-800 font-medium">{user.city}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Section */}
        <div className="mt-8">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
            onClick={() => setShowChangePassword((v) => !v)}
          >
            {showChangePassword ? 'Hide Change Password' : 'Change Password'}
          </button>
          {showChangePassword && (
            <form onSubmit={handleChangePassword} className="mt-4 space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Old Password</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={e => setOldPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters and include uppercase, lowercase, number, and special character.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              {passwordError && <div className="text-red-600 text-sm">{passwordError}</div>}
              {passwordSuccess && <div className="text-green-600 text-sm">{passwordSuccess}</div>}
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold"
                disabled={isChanging}
              >
                {isChanging ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;