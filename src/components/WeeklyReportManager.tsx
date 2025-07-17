import React, { useState, useEffect } from 'react';
import { Mail, Download, Calendar, User, FileText, Send } from 'lucide-react';

interface WeeklyReportData {
  userId: string;
  username: string;
  email: string;
  weekStart: string;
  weekEnd: string;
  attempts: Array<{
    category: string;
    level: string;
    attempt: number;
    points: number;
    date: string;
  }>;
  totalPoints: number;
}

const WeeklyReportManager: React.FC = () => {
  const [reports, setReports] = useState<WeeklyReportData[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<string>('');

  useEffect(() => {
    // Load existing reports
    loadReports();
    
    // Set current week as default
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    setSelectedWeek(startOfWeek.toISOString().split('T')[0]);
  }, []);

  const loadReports = () => {
    const stored = localStorage.getItem('weeklyReports');
    if (stored) {
      setReports(JSON.parse(stored));
    }
  };

  const generateWeeklyReports = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock data - in real implementation, fetch from database
      const mockReports: WeeklyReportData[] = [
        {
          userId: '1',
          username: 'john_doe',
          email: 'john@example.com',
          weekStart: selectedWeek,
          weekEnd: new Date(new Date(selectedWeek).getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          attempts: [
            { category: 'Tangles', level: 'Level 1', attempt: 2, points: 200, date: selectedWeek },
            { category: 'Tangles', level: 'Level 2', attempt: 1, points: 300, date: selectedWeek },
            { category: 'Funthinker Basic', level: 'Level 1', attempt: 3, points: 100, date: selectedWeek },
          ],
          totalPoints: 600,
        },
        {
          userId: '2',
          username: 'jane_smith',
          email: 'jane@example.com',
          weekStart: selectedWeek,
          weekEnd: new Date(new Date(selectedWeek).getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          attempts: [
            { category: 'Tangles', level: 'Level 1', attempt: 1, points: 300, date: selectedWeek },
            { category: 'Funthinker Medium', level: 'Level 1', attempt: 2, points: 200, date: selectedWeek },
          ],
          totalPoints: 500,
        },
      ];
      
      setReports(mockReports);
      localStorage.setItem('weeklyReports', JSON.stringify(mockReports));
      
    } catch (error) {
      console.error('Failed to generate reports:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPDFReport = (report: WeeklyReportData) => {
    // In real implementation, generate PDF using jsPDF or similar
    const pdfContent = generatePDFContent(report);
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `weekly_report_${report.username}_${report.weekStart}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const generatePDFContent = (report: WeeklyReportData): string => {
    return `
WEEKLY PUZZLE PROGRESS REPORT
============================

User: ${report.username}
Email: ${report.email}
Week: ${report.weekStart} to ${report.weekEnd}

GAME PROGRESS:
--------------
${report.attempts.map(attempt => 
  `${attempt.category} | ${attempt.level} | ${attempt.attempt}${getOrdinalSuffix(attempt.attempt)} attempt | ${attempt.points} points`
).join('\n')}

TOTAL POINTS: ${report.totalPoints}

Generated on: ${new Date().toLocaleString()}
    `.trim();
  };

  const getOrdinalSuffix = (num: number): string => {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const v = num % 100;
    return suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
  };

  const sendEmailReport = async (report: WeeklyReportData) => {
    // In real implementation, send email via backend API
    alert(`Email report sent to ${report.email}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">Weekly Report Manager</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-600" />
            <input
              type="date"
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={generateWeeklyReports}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                Generate Reports
              </>
            )}
          </button>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {reports.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Mail className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No reports generated yet. Click "Generate Reports" to create weekly reports for all users.</p>
          </div>
        ) : (
          reports.map((report) => (
            <div key={report.userId} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <User className="w-8 h-8 text-blue-600" />
                  <div>
                    <h4 className="font-semibold text-gray-800">{report.username}</h4>
                    <p className="text-sm text-gray-600">{report.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {report.weekStart} to {report.weekEnd}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => downloadPDFReport(report)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => sendEmailReport(report)}
                      className="p-2 text-green-600 hover:bg-green-100 rounded transition-colors"
                      title="Send Email"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Report Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Total Attempts:</p>
                    <p className="text-lg font-bold text-gray-900">{report.attempts.length}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Total Points:</p>
                    <p className="text-lg font-bold text-blue-600">{report.totalPoints}</p>
                  </div>
                </div>

                {/* Attempts Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2">Category</th>
                        <th className="text-left py-2">Level</th>
                        <th className="text-left py-2">Attempt</th>
                        <th className="text-left py-2">Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.attempts.map((attempt, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-2">{attempt.category}</td>
                          <td className="py-2">{attempt.level}</td>
                          <td className="py-2">{attempt.attempt}{getOrdinalSuffix(attempt.attempt)}</td>
                          <td className="py-2 font-semibold">{attempt.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h5 className="font-medium text-blue-800 mb-2">Weekly Report System:</h5>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Reports are automatically generated every Sunday at midnight</li>
          <li>• Each report includes all user attempts for the week with scoring details</li>
          <li>• PDF reports are attached to emails sent to users</li>
          <li>• Manual generation is available for testing or resending reports</li>
          <li>• Reports include: Category, Level, Attempt Number, Points Earned</li>
        </ul>
      </div>
    </div>
  );
};

export default WeeklyReportManager;