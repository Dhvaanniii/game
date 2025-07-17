import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import AdminPDFUploader from '../components/AdminPDFUploader';
import WeeklyReportManager from '../components/WeeklyReportManager';
import LevelManagementSystem from '../components/LevelManagementSystem';
import { Users, Puzzle, BarChart3, Settings, Upload, Mail, Calendar, Database, Shield, Eye, Edit, Trash2 } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Redirect if not admin
  if (!user || user.userType !== 'admin') {
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

  const mockUsers = JSON.parse(localStorage.getItem('regularUsers') || '[]');

  const renderDashboard = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{mockUsers.length}</p>
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
                {['tangle', 'funthinker-basic', 'funthinker-medium', 'funthinker-hard']
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
            {['tangle', 'funthinker-basic', 'funthinker-medium', 'funthinker-hard'].map(category => {
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
            <div className="ml-8">📁 tangle/ (level_1.svg, level_2.svg, ...)</div>
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
          Total Users: {mockUsers.length}
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
              {mockUsers.map((user: any) => (
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

      {mockUsers.length === 0 && (
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
            {activeTab === 'tangle-upload' && <AdminPDFUploader category="tangle" />}
            {activeTab === 'funthinker-basic-upload' && <AdminPDFUploader category="funthinker-basic" />}
            {activeTab === 'funthinker-medium-upload' && <AdminPDFUploader category="funthinker-medium" />}
            {activeTab === 'funthinker-hard-upload' && <AdminPDFUploader category="funthinker-hard" />}
            {activeTab === 'level-management' && <LevelManagementSystem />}
            {activeTab === 'reports' && <WeeklyReportManager />}
            {activeTab === 'system' && renderSystemSettings()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;