import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import PDFUploadManager from '../components/PDFUploadManager';
import WeeklyReportManager from '../components/WeeklyReportManager';
import LevelManagementSystem from '../components/LevelManagementSystem';
import { Users, Puzzle, BarChart3, Settings, Upload, Mail, Calendar, FileText, Database, Shield, Edit, Trash2, Eye } from 'lucide-react';

const EnhancedAdminPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Redirect if not admin
  if (!user || !user.isAdmin) {
    navigate('/home');
    return null;
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'tangle-upload', label: 'Tangle Upload', icon: Upload },
    { id: 'funthinker-basic-upload', label: 'Funthinker Basic', icon: Upload },
    { id: 'funthinker-medium-upload', label: 'Funthinker Medium', icon: Upload },
    { id: 'funthinker-hard-upload', label: 'Funthinker Hard', icon: Upload },
    { id: 'level-management', label: 'Level Management', icon: Calendar },
    { id: 'reports', label: 'Weekly Reports', icon: Mail },
    { id: 'system', label: 'System Settings', icon: Settings },
  ];

  const mockUsers = [
    { 
      id: 1, 
      username: 'john_doe', 
      realname: 'John Doe', 
      email: 'jo@gmail.com', 
      school: 'ABC School', 
      standard: '5',
      country: 'India',
      state: 'Gujarat',
      city: 'Ahmedabad',
      coins: 150,
      lastActive: '2024-01-15',
      levelsCompleted: 12,
      totalAttempts: 45,
      avgScore: 245
    },
    { 
      id: 2, 
      username: 'jane_smith', 
      realname: 'Jane Smith', 
      email: 'ja@gmail.com', 
      school: 'XYZ School', 
      standard: '6',
      country: 'India',
      state: 'Maharashtra',
      city: 'Mumbai',
      coins: 200,
      lastActive: '2024-01-14',
      levelsCompleted: 18,
      totalAttempts: 52,
      avgScore: 267
    },
    { 
      id: 3, 
      username: 'bob_wilson', 
      realname: 'Bob Wilson', 
      email: 'bo@gmail.com', 
      school: 'DEF School', 
      standard: '4',
      country: 'India',
      state: 'Karnataka',
      city: 'Bangalore',
      coins: 75,
      lastActive: '2024-01-13',
      levelsCompleted: 8,
      totalAttempts: 28,
      avgScore: 189
    },
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
              <p className="text-2xl font-bold text-gray-900">1,234</p>
              <p className="text-xs text-green-600">+12% from last week</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Levels</p>
              <p className="text-2xl font-bold text-gray-900">856</p>
              <p className="text-xs text-blue-600">Across all categories</p>
            </div>
            <Puzzle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Daily Active Users</p>
              <p className="text-2xl font-bold text-gray-900">456</p>
              <p className="text-xs text-orange-600">Peak: 2-4 PM</p>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">78%</p>
              <p className="text-xs text-green-600">Above target</p>
            </div>
            <BarChart3 className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Levels by Category</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Tangles</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
                <span className="text-sm font-medium">456</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Funthinker Basic</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                </div>
                <span className="text-sm font-medium">200</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Funthinker Medium</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
                <span className="text-sm font-medium">150</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Funthinker Hard</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                </div>
                <span className="text-sm font-medium">50</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">New user registered: john_doe</span>
              <span className="text-xs text-gray-400">2 min ago</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Level completed: Tangle Level 15</span>
              <span className="text-xs text-gray-400">5 min ago</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-gray-600">PDF uploaded: 20 new levels</span>
              <span className="text-xs text-gray-400">1 hour ago</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Weekly reports sent to 1,234 users</span>
              <span className="text-xs text-gray-400">2 hours ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm">Database: Online</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm">Email Service: Active</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm">File Storage: Available</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
        <div className="flex gap-2">
          <button className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
            <FileText className="w-4 h-4" />
            <span>Export Users</span>
          </button>
          <button className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg">
            <Users className="w-4 h-4" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">1,234</div>
          <div className="text-sm text-blue-800">Total Users</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">456</div>
          <div className="text-sm text-green-800">Active Today</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-600">89</div>
          <div className="text-sm text-yellow-800">New This Week</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600">78%</div>
          <div className="text-sm text-purple-800">Retention Rate</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">User List</h3>
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Search users..."
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">All Standards</option>
                <option value="1">Standard 1</option>
                <option value="2">Standard 2</option>
                <option value="3">Standard 3</option>
                <option value="4">Standard 4</option>
                <option value="5">Standard 5</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.realname}</div>
                      <div className="text-sm text-gray-500">@{user.username}</div>
                      <div className="text-xs text-gray-400">Standard {user.standard} • {user.school}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                    <div className="text-xs text-gray-500">Last active: {user.lastActive}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.city}, {user.state}</div>
                    <div className="text-xs text-gray-500">{user.country}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.levelsCompleted} levels</div>
                    <div className="text-xs text-gray-500">{user.coins} coins</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Avg: {user.avgScore} pts</div>
                    <div className="text-xs text-gray-500">{user.totalAttempts} attempts</div>
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
                <option value="60">1 minute</option>
                <option value="90">1.5 minutes</option>
                <option value="120">2 minutes</option>
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
                <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                <p className="text-xs text-gray-500">Level unlock notifications</p>
              </div>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
                Enabled
              </button>
            </div>
          </div>
        </div>

        {/* Storage Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Storage Configuration</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Storage Path</h4>
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
                <h4 className="text-sm font-medium text-gray-900">Email Validation</h4>
                <p className="text-xs text-gray-500">Enforce 2-character email format</p>
              </div>
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm">
                Enabled
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Password Strength</h4>
                <p className="text-xs text-gray-500">Require strong passwords</p>
              </div>
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm">
                Enabled
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Database Backup */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Database Management</h3>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Database Backup</h4>
            <p className="text-xs text-gray-500">Last backup: January 15, 2024 at 3:00 AM</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              <Database className="w-4 h-4" />
              Backup Now
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
              <Shield className="w-4 h-4" />
              Restore
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Enhanced Admin Dashboard</h1>
          <p className="text-gray-600">Complete puzzle game management system</p>
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
            {activeTab === 'tangle-upload' && <PDFUploadManager category="tangle" />}
            {activeTab === 'funthinker-basic-upload' && <PDFUploadManager category="funthinker-basic" />}
            {activeTab === 'funthinker-medium-upload' && <PDFUploadManager category="funthinker-medium" />}
            {activeTab === 'funthinker-hard-upload' && <PDFUploadManager category="funthinker-hard" />}
            {activeTab === 'level-management' && <LevelManagementSystem />}
            {activeTab === 'reports' && <WeeklyReportManager />}
            {activeTab === 'system' && renderSystemSettings()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default EnhancedAdminPage;