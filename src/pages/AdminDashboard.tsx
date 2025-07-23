import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import AdminPDFUploader from '../components/AdminPDFUploader';
import WeeklyReportManager from '../components/WeeklyReportManager';
import LevelManagementSystem from '../components/LevelManagementSystem';
import { Users, Puzzle, BarChart3, Settings, Upload, Mail, Calendar, Database, Shield, Eye, Edit, Trash2, FileText, Plus } from 'lucide-react';
import { apiService } from '../services/api';
import PDFUploadManager from '../components/PDFUploadManager';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [levels, setLevels] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingLevels, setLoadingLevels] = useState(false);
  const [error, setError] = useState('');

  // Expand system settings state
  const [settings, setSettings] = useState({
    registration: true,
    maintenance: false,
    emailNotifications: true,
    timerDuration: 180,
    maxAttempts: 3,
    levelLockDuration: 15,
    fixedBlocks: true,
    weeklyReports: true,
    pdfUpload: true,
  });
  const [loadingSettings, setLoadingSettings] = useState(false);

  // Add state for analytics, reports, and puzzle upload
  const [analytics, setAnalytics] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    if (user && user.userType?.trim() !== 'admin') {
      navigate('/home');
    }
    if (!user) {
      navigate('/');
    }
    fetchUsers();
    fetchLevels();
    fetchSettings();
    // Fetch analytics and reports (add to useEffect)
    fetchAnalytics();
    fetchReports();
  }, [user]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await apiService.getAllUsers();
      setUsers(response.users || []);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchLevels = async () => {
    setLoadingLevels(true);
    try {
      const response = await apiService.getAllLevels();
      setLevels(response.levels || []);
    } catch (err) {
      setError('Failed to load levels');
    } finally {
      setLoadingLevels(false);
    }
  };

  const handleUnlockLevel = async (userId: string, levelId: string) => {
    // TODO: Call backend API to unlock level for user
    // await apiService.unlockLevelForUser(userId, levelId);
    fetchUsers();
    fetchLevels();
  };

  const handleRelockLevel = async (userId: string, levelId: string) => {
    // TODO: Call backend API to relock level for user
    // await apiService.relockLevelForUser(userId, levelId);
    fetchUsers();
    fetchLevels();
  };

  const fetchSettings = async () => {
    setLoadingSettings(true);
    try {
      const response = await apiService.getSystemSettings();
      setSettings({
        registration: response.settings.registration,
        maintenance: response.settings.maintenance,
        emailNotifications: response.settings.emailNotifications,
        timerDuration: response.settings.timerDuration || 180,
        maxAttempts: response.settings.maxAttempts || 3,
        levelLockDuration: response.settings.levelLockDuration || 15,
        fixedBlocks: response.settings.fixedBlocks !== undefined ? response.settings.fixedBlocks : true,
        weeklyReports: response.settings.weeklyReports !== undefined ? response.settings.weeklyReports : true,
        pdfUpload: response.settings.pdfUpload !== undefined ? response.settings.pdfUpload : true,
      });
    } catch (err) {
      setError('Failed to load system settings');
    } finally {
      setLoadingSettings(false);
    }
  };

  const updateSetting = async (key: string, value: any) => {
    setLoadingSettings(true);
    try {
      const response = await apiService.updateSystemSetting(key, value);
      setSettings((prev) => ({ ...prev, [key]: value }));
    } catch (err) {
      setError('Failed to update system setting');
    } finally {
      setLoadingSettings(false);
    }
  };

  // Add manual report send handler
  const manualReportSend = async () => {
    setLoadingSettings(true);
    try {
      await apiService.sendWeeklyReport({});
      setUploadSuccess('Weekly report sent!');
    } catch (err) {
      setError('Failed to send weekly report');
    } finally {
      setLoadingSettings(false);
    }
  };

  // Puzzle upload handler
  const handlePDFUpload = async (file: File) => {
    setUploading(true);
    setUploadSuccess('');
    setUploadError('');
    try {
      const response = await apiService.uploadPDF('tangram', file);
      if (response.success) {
        setUploadSuccess('PDF uploaded and levels created successfully!');
        fetchLevels();
      } else {
        setUploadError('Failed to upload PDF');
      }
    } catch (err) {
      setUploadError('Failed to upload PDF');
    } finally {
      setUploading(false);
    }
  };

  // Fetch analytics and reports (add to useEffect)
  const fetchAnalytics = async () => {
    // TODO: Call backend API for analytics
    // setAnalytics(response.analytics);
  };
  const fetchReports = async () => {
    // TODO: Call backend API for reports
    // setReports(response.reports);
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'tangram-upload', label: 'Tangram Upload', icon: Upload },
    { id: 'funthinker-basic-upload', label: 'Funthinker Basic', icon: Upload },
    { id: 'funthinker-medium-upload', label: 'Funthinker Medium', icon: Upload },
    { id: 'funthinker-hard-upload', label: 'Funthinker Hard', icon: Upload },
    { id: 'level-management', label: 'Level Management', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'reports', label: 'Weekly Reports', icon: Mail },
    { id: 'system', label: 'System Settings', icon: Settings },
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              <p className="text-xs text-green-600">Registered users</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Levels</p>
              <p className="text-2xl font-bold text-gray-900">
                {['tangram', 'funthinker-basic', 'funthinker-medium', 'funthinker-hard']
                  .reduce((total, category) => {
                    const levels = JSON.parse(localStorage.getItem(`${category}-levels`) || '[]');
                    return total + levels.length;
                  }, 0)}
              </p>
              <p className="text-xs text-blue-600">Across all categories</p>
            </div>
            <Puzzle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Fixed Blocks</p>
              <p className="text-2xl font-bold text-gray-900">10</p>
              <p className="text-xs text-orange-600">Used in all levels</p>
            </div>
            <Database className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Storage Path</p>
              <p className="text-lg font-bold text-gray-900">D:/PuzzleGame/</p>
              <p className="text-xs text-green-600">Local storage</p>
            </div>
            <Shield className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Levels by Category</h3>
          <div className="space-y-3">
            {['tangram', 'funthinker-basic', 'funthinker-medium', 'funthinker-hard'].map(category => {
              const levels = JSON.parse(localStorage.getItem(`${category}-levels`) || '[]');
              const count = levels.length;
              const maxCount = 200;
              const percentage = (count / maxCount) * 100;
              
              return (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-gray-600 capitalize">{category.replace('-', ' ')}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{count}/200</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Fixed 10 Blocks System: Active</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">PDF Upload System: Ready</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Level Management: Active</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Weekly Reports: Scheduled</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Storage: D:/PuzzleGame/ Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* File Structure */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">File Structure (D:/PuzzleGame/)</h3>
        <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
          <div className="space-y-1">
            <div>📁 D:/PuzzleGame/</div>
            <div className="ml-4">📁 outlines/</div>
            <div className="ml-8">📁 tangram/ (level_1.svg, level_2.svg, ...)</div>
            <div className="ml-8">📁 funthinker-basic/ (level_1.svg, level_2.svg, ...)</div>
            <div className="ml-8">📁 funthinker-medium/ (level_1.svg, level_2.svg, ...)</div>
            <div className="ml-8">📁 funthinker-hard/ (level_1.svg, level_2.svg, ...)</div>
            <div className="ml-4">📁 blocks/ (fixed_10_blocks.svg)</div>
            <div className="ml-4">📁 reports/ (user_report_username_date.pdf)</div>
            <div className="ml-4">📁 uploads/ (raw_admin_pdf.pdf)</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
        <div className="text-sm text-gray-600">
          Total Users: {users.length}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coins</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user: any) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.realname}</div>
                      <div className="text-sm text-gray-500">@{user.username}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                    <div className="text-xs text-gray-500">{user.language}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.city}, {user.state}</div>
                    <div className="text-xs text-gray-500">{user.country}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.school}</div>
                    <div className="text-xs text-gray-500">{user.standard} • {user.board}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-yellow-600">{user.coins}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-blue-600 hover:text-blue-900" title="View Details">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900" title="Edit User">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900" title="Delete User">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {users.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No users registered yet.</p>
        </div>
      )}
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">System Settings</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Game Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Game Configuration</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Timer Duration</h4>
                <p className="text-xs text-gray-500">Time limit per attempt</p>
              </div>
              <select className="px-3 py-2 border border-gray-300 rounded-lg">
                <option value="300">5 minutes</option>
                <option value="240">4 minutes</option>
                <option value="180">3 minutes</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Max Attempts</h4>
                <p className="text-xs text-gray-500">Maximum attempts per level</p>
              </div>
              <select className="px-3 py-2 border border-gray-300 rounded-lg">
                <option value="3">3 attempts</option>
                <option value="5">5 attempts</option>
                <option value="unlimited">Unlimited</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Level Lock Duration</h4>
                <p className="text-xs text-gray-500">Days before level locks</p>
              </div>
              <select className="px-3 py-2 border border-gray-300 rounded-lg">
                <option value="15">15 days</option>
                <option value="30">30 days</option>
                <option value="never">Never lock</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Fixed Blocks System</h4>
                <p className="text-xs text-gray-500">10 blocks for all levels</p>
              </div>
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm">
                Active
              </button>
            </div>
          </div>
        </div>

        {/* Storage Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Storage Configuration</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Base Storage Path</h4>
              <input
                type="text"
                value="D:/PuzzleGame/"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                readOnly
              />
              <p className="text-xs text-gray-500 mt-1">Base directory for all game files</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h5 className="text-xs font-medium text-gray-700">Outlines</h5>
                <p className="text-xs text-gray-500">D:/PuzzleGame/outlines/</p>
              </div>
              <div>
                <h5 className="text-xs font-medium text-gray-700">Reports</h5>
                <p className="text-xs text-gray-500">D:/PuzzleGame/reports/</p>
              </div>
              <div>
                <h5 className="text-xs font-medium text-gray-700">Uploads</h5>
                <p className="text-xs text-gray-500">D:/PuzzleGame/uploads/</p>
              </div>
              <div>
                <h5 className="text-xs font-medium text-gray-700">Blocks</h5>
                <p className="text-xs text-gray-500">D:/PuzzleGame/blocks/</p>
              </div>
            </div>
          </div>
        </div>

        {/* Email Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Email Configuration</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Weekly Reports</h4>
                <p className="text-xs text-gray-500">Send weekly progress reports</p>
              </div>
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm">
                Enabled
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Report Day</h4>
                <p className="text-xs text-gray-500">Day of week to send reports</p>
              </div>
              <select className="px-3 py-2 border border-gray-300 rounded-lg">
                <option value="sunday">Sunday</option>
                <option value="monday">Monday</option>
                <option value="friday">Friday</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Email Format</h4>
                <p className="text-xs text-gray-500">2 characters before @ validation</p>
              </div>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
                Enforced
              </button>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Security Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">User Registration</h4>
                <p className="text-xs text-gray-500">Allow new user registration</p>
              </div>
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm">
                Enabled
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Password Strength</h4>
                <p className="text-xs text-gray-500">8 chars, 1 uppercase, 1 special</p>
              </div>
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm">
                Enforced
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Admin Access</h4>
                <p className="text-xs text-gray-500">Multiple admin accounts</p>
              </div>
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm">
                Active
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">System Settings</h2>
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        {/* Registration */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">User Registration</h3>
            <p className="text-sm text-gray-500">Allow new users to register</p>
          </div>
          <button
            className={`px-4 py-2 rounded-lg text-white ${settings.registration ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-500 hover:bg-gray-600'}`}
            onClick={() => updateSetting('registration', !settings.registration)}
            disabled={loadingSettings}
          >
            {settings.registration ? 'Enabled' : 'Disabled'}
          </button>
        </div>
        {/* Maintenance */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Maintenance Mode</h3>
            <p className="text-sm text-gray-500">Put the system in maintenance mode</p>
          </div>
          <button
            className={`px-4 py-2 rounded-lg text-white ${settings.maintenance ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-500 hover:bg-gray-600'}`}
            onClick={() => updateSetting('maintenance', !settings.maintenance)}
            disabled={loadingSettings}
          >
            {settings.maintenance ? 'Enabled' : 'Disabled'}
          </button>
        </div>
        {/* Email Notifications */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Email Notifications</h3>
            <p className="text-sm text-gray-500">Send email notifications to users</p>
          </div>
          <button
            className={`px-4 py-2 rounded-lg text-white ${settings.emailNotifications ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-500 hover:bg-gray-600'}`}
            onClick={() => updateSetting('emailNotifications', !settings.emailNotifications)}
            disabled={loadingSettings}
          >
            {settings.emailNotifications ? 'Enabled' : 'Disabled'}
          </button>
        </div>
        {/* Timer Duration */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Timer Duration</h3>
            <p className="text-sm text-gray-500">Time limit per attempt</p>
          </div>
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg"
            value={settings.timerDuration}
            onChange={e => updateSetting('timerDuration', Number(e.target.value))}
            disabled={loadingSettings}
          >
            <option value={60}>1 minute</option>
            <option value={120}>2 minutes</option>
            <option value={180}>3 minutes</option>
            <option value={240}>4 minutes</option>
          </select>
        </div>
        {/* Max Attempts */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Max Attempts</h3>
            <p className="text-sm text-gray-500">Maximum attempts per level</p>
          </div>
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg"
            value={settings.maxAttempts}
            onChange={e => updateSetting('maxAttempts', e.target.value === 'unlimited' ? 'unlimited' : Number(e.target.value))}
            disabled={loadingSettings}
          >
            <option value={3}>3 attempts</option>
            <option value={5}>5 attempts</option>
            <option value="unlimited">Unlimited</option>
          </select>
        </div>
        {/* Level Lock Duration */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Level Lock Duration</h3>
            <p className="text-sm text-gray-500">Days before level locks</p>
          </div>
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg"
            value={settings.levelLockDuration}
            onChange={e => updateSetting('levelLockDuration', e.target.value === 'never' ? 'never' : Number(e.target.value))}
            disabled={loadingSettings}
          >
            <option value={15}>15 days</option>
            <option value={30}>30 days</option>
            <option value="never">Never lock</option>
          </select>
        </div>
        {/* Fixed Blocks System */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Fixed 10 Blocks System</h3>
            <p className="text-sm text-gray-500">10 blocks for all levels</p>
          </div>
          <button
            className={`px-4 py-2 rounded-lg text-white ${settings.fixedBlocks ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'}`}
            onClick={() => updateSetting('fixedBlocks', !settings.fixedBlocks)}
            disabled={loadingSettings}
          >
            {settings.fixedBlocks ? 'Active' : 'Inactive'}
          </button>
        </div>
        {/* Weekly Reports */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Weekly Reports</h3>
            <p className="text-sm text-gray-500">Send weekly progress reports</p>
          </div>
          <button
            className={`px-4 py-2 rounded-lg text-white ${settings.weeklyReports ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-500 hover:bg-gray-600'}`}
            onClick={() => updateSetting('weeklyReports', !settings.weeklyReports)}
            disabled={loadingSettings}
          >
            {settings.weeklyReports ? 'Enabled' : 'Disabled'}
          </button>
          <button
            className="ml-4 px-4 py-2 rounded-lg text-white bg-purple-500 hover:bg-purple-600"
            onClick={manualReportSend}
            disabled={loadingSettings}
          >
            Send Report Now
          </button>
        </div>
        {/* PDF Upload System */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">PDF Upload System</h3>
            <p className="text-sm text-gray-500">Allow PDF upload for new levels</p>
          </div>
          <button
            className={`px-4 py-2 rounded-lg text-white ${settings.pdfUpload ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-500 hover:bg-gray-600'}`}
            onClick={() => updateSetting('pdfUpload', !settings.pdfUpload)}
            disabled={loadingSettings}
          >
            {settings.pdfUpload ? 'Enabled' : 'Disabled'}
          </button>
        </div>
        {loadingSettings && <div className="text-blue-600">Updating settings...</div>}
        {error && <div className="text-red-600">{error}</div>}
      </div>
    </div>
  );

  const renderPuzzleUpload = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Tangram PDF Upload</h2>
      <PDFUploadManager category="tangram" onLevelsCreated={() => fetchLevels()} />
      {uploading && <div className="text-blue-600">Uploading...</div>}
      {uploadSuccess && <div className="text-green-600">{uploadSuccess}</div>}
      {uploadError && <div className="text-red-600">{uploadError}</div>}
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h2>
      {/* TODO: Show real analytics from backend */}
      <div className="bg-white rounded-lg shadow p-6">Coming soon: Real-time analytics</div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Weekly Reports</h2>
      <WeeklyReportManager />
      {/* TODO: Show/download reports from backend */}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Complete puzzle game management system with fixed 10 blocks</p>
        </div>

        <div className="flex space-x-8">
          <nav className="w-64 bg-white rounded-lg shadow p-4">
            <ul className="space-y-2">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <li key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span className="text-sm">{tab.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex-1">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'users' && renderUsers()}
            {activeTab === 'tangram-upload' && (
              <PDFUploadManager category="tangram" onLevelsCreated={() => fetchLevels()} />
            )}
            {activeTab === 'funthinker-basic-upload' && (
              <PDFUploadManager category="funthinker-basic" onLevelsCreated={() => fetchLevels()} />
            )}
            {activeTab === 'funthinker-medium-upload' && (
              <PDFUploadManager category="funthinker-medium" onLevelsCreated={() => fetchLevels()} />
            )}
            {activeTab === 'funthinker-hard-upload' && (
              <PDFUploadManager category="funthinker-hard" onLevelsCreated={() => fetchLevels()} />
            )}
            {activeTab === 'level-management' && <LevelManagementSystem />}
            {activeTab === 'analytics' && renderAnalytics()}
            {activeTab === 'reports' && renderReports()}
            {activeTab === 'system' && renderSettings()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;