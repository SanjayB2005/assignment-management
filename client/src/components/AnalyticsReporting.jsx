import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  ResponsiveContainer
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Clock, 
  Award,
  Calendar,
  Download,
  FileText,
  Target,
  Upload
} from 'lucide-react';
import { assignmentAPI, submissionAPI } from '../services/api';
import { formatDate, generateColors } from '../utils/helpers';

const AnalyticsReporting = ({ teacherId }) => {
  const [analyticsData, setAnalyticsData] = useState({
    assignments: [],
    submissions: [],
    stats: {}
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30'); // days
  const [selectedMetric, setSelectedMetric] = useState('submissions');

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      const [assignmentsRes, submissionsRes, statsRes] = await Promise.all([
        assignmentAPI.getAll(),
        submissionAPI.getTeacherSubmissions(),
        submissionAPI.getStats()
      ]);
      
      setAnalyticsData({
        assignments: assignmentsRes.data,
        submissions: submissionsRes.data,
        stats: statsRes.data
      });
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Process data for charts
  const processSubmissionTrends = () => {
    const days = parseInt(timeRange);
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);
    
    const trendData = [];
    for (let i = 0; i < days; i += Math.ceil(days / 10)) {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      const daySubmissions = analyticsData.submissions.filter(sub => {
        const subDate = new Date(sub.submittedAt);
        return subDate.toDateString() === date.toDateString();
      });
      
      trendData.push({
        date: formatDate(date),
        submissions: daySubmissions.length,
        onTime: daySubmissions.filter(sub => !sub.isLateSubmission).length,
        late: daySubmissions.filter(sub => sub.isLateSubmission).length
      });
    }
    
    return trendData;
  };

  const processGradeDistribution = () => {
    if (!analyticsData.submissions) {
      return [];
    }
    
    const gradedSubmissions = analyticsData.submissions.filter(sub => sub.marksObtained !== null);
    const gradeRanges = [
      { range: 'A (90-100)', min: 90, max: 100, count: 0 },
      { range: 'B (80-89)', min: 80, max: 89, count: 0 },
      { range: 'C (70-79)', min: 70, max: 79, count: 0 },
      { range: 'D (60-69)', min: 60, max: 69, count: 0 },
      { range: 'F (0-59)', min: 0, max: 59, count: 0 }
    ];

    gradedSubmissions.forEach(sub => {
      if (sub.assignment && sub.assignment.maxMarks) {
        const percentage = (sub.marksObtained / sub.assignment.maxMarks) * 100;
        const range = gradeRanges.find(r => percentage >= r.min && percentage <= r.max);
        if (range) range.count++;
      }
    });

    return gradeRanges.filter(range => range.count > 0);
  };

  const processAssignmentPerformance = () => {
    if (!analyticsData.assignments || !analyticsData.submissions) {
      return [];
    }
    
    return analyticsData.assignments.map(assignment => {
      const assignmentSubmissions = analyticsData.submissions.filter(
        sub => sub.assignment && sub.assignment.id === assignment.id
      );
      const gradedSubmissions = assignmentSubmissions.filter(sub => sub.marksObtained !== null);
      const averageScore = gradedSubmissions.length > 0 
        ? gradedSubmissions.reduce((sum, sub) => sum + sub.marksObtained, 0) / gradedSubmissions.length
        : 0;
      
      return {
        title: assignment.title && assignment.title.length > 20 ? assignment.title.substring(0, 20) + '...' : assignment.title || 'Unknown',
        submissions: assignmentSubmissions.length,
        averageScore: Math.round(averageScore),
        onTimeRate: assignmentSubmissions.length > 0 
          ? Math.round((assignmentSubmissions.filter(sub => !sub.isLateSubmission).length / assignmentSubmissions.length) * 100)
          : 0
      };
    });
  };

  const processStatusDistribution = () => {
    if (!analyticsData.submissions) {
      return [];
    }
    
    const statusCounts = {
      UPLOADED: analyticsData.submissions.filter(sub => sub.status === 'UPLOADED').length,
      PENDING: analyticsData.submissions.filter(sub => sub.status === 'PENDING').length,
      COMPLETED: analyticsData.submissions.filter(sub => sub.status === 'COMPLETED').length
    };

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      value: count,
      color: status === 'UPLOADED' ? '#3B82F6' : status === 'PENDING' ? '#F59E0B' : '#10B981'
    }));
  };

  const MetricCard = ({ title, value, change, icon: Icon, color = 'blue' }) => (
    <div className="bg-white rounded-lg shadow-soft p-6 border-l-4 border-l-primary-500">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '+' : ''}{change}% from last period
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Guard clause to ensure data is available
  if (!analyticsData || !analyticsData.assignments || !analyticsData.submissions) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">No analytics data available</div>
      </div>
    );
  }

  const submissionTrends = processSubmissionTrends();
  const gradeDistribution = processGradeDistribution();
  const assignmentPerformance = processAssignmentPerformance();
  const statusDistribution = processStatusDistribution();
  const colors = generateColors(statusDistribution.length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Total Assignments"
          value={analyticsData.assignments.length}
          icon={FileText}
          color="blue"
        />
        <MetricCard
          title="Total Submissions"
          value={analyticsData.submissions.length}
          icon={Upload}
          color="green"
        />
        <MetricCard
          title="Average Score"
          value={`${Math.round(
            analyticsData.submissions
              .filter(sub => sub.marksObtained !== null)
              .reduce((sum, sub) => sum + (sub.marksObtained / sub.assignment.maxMarks) * 100, 0) /
            Math.max(analyticsData.submissions.filter(sub => sub.marksObtained !== null).length, 1)
          )}%`}
          icon={Award}
          color="purple"
        />
        <MetricCard
          title="On-Time Rate"
          value={`${Math.round(
            (analyticsData.submissions.filter(sub => !sub.isLateSubmission).length / 
             Math.max(analyticsData.submissions.length, 1)) * 100
          )}%`}
          icon={Clock}
          color="orange"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Submission Trends */}
        <div className="bg-white rounded-lg shadow-soft p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Submission Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={submissionTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="submissions" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="onTime" stroke="#10B981" strokeWidth={2} />
              <Line type="monotone" dataKey="late" stroke="#EF4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-lg shadow-soft p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Submission Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Grade Distribution */}
        <div className="bg-white rounded-lg shadow-soft p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Grade Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={gradeDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Assignment Performance */}
        <div className="bg-white rounded-lg shadow-soft p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Assignment Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={assignmentPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="title" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="submissions" fill="#3B82F6" />
              <Bar dataKey="averageScore" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Tables */}
      <div className="bg-white rounded-lg shadow-soft p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Assignment Performance Summary</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assignment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submissions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Average Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  On-Time Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assignmentPerformance.map((assignment, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {assignment.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {assignment.submissions}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {assignment.averageScore}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {assignment.onTimeRate}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      assignment.averageScore >= 80 ? 'bg-green-100 text-green-800' :
                      assignment.averageScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {assignment.averageScore >= 80 ? 'Excellent' :
                       assignment.averageScore >= 60 ? 'Good' : 'Needs Improvement'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Performance Insights */}
      <div className="bg-white rounded-lg shadow-soft p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
              <h4 className="font-medium text-blue-900">Performance Trend</h4>
            </div>
            <p className="text-sm text-blue-700">
              {analyticsData.submissions.filter(sub => !sub.isLateSubmission).length > 
               analyticsData.submissions.filter(sub => sub.isLateSubmission).length
                ? 'Most students are submitting on time'
                : 'Late submissions are increasing'}
            </p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Target className="h-5 w-5 text-green-600 mr-2" />
              <h4 className="font-medium text-green-900">Top Performing Assignment</h4>
            </div>
            <p className="text-sm text-green-700">
              {assignmentPerformance.length > 0 && 
               assignmentPerformance.reduce((prev, current) => 
                 prev.averageScore > current.averageScore ? prev : current
               ).title}
            </p>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Users className="h-5 w-5 text-orange-600 mr-2" />
              <h4 className="font-medium text-orange-900">Engagement Level</h4>
            </div>
            <p className="text-sm text-orange-700">
              {Math.round((analyticsData.submissions.length / Math.max(analyticsData.assignments.length, 1)) * 100) > 70
                ? 'High student engagement'
                : 'Consider increasing engagement strategies'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsReporting;