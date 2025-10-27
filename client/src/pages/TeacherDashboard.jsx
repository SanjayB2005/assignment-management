import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { assignmentAPI, submissionAPI, userAPI } from '../services/api';
import PDFViewer from '../components/PDFViewer';
import { 
  Plus, 
  BookOpen, 
  Users, 
  Clock, 
  FileText, 
  Search,
  Filter,
  Calendar,
  Download,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  Upload,
  CheckCircle,
  BarChart3,
  User,
  Save
} from 'lucide-react';
import { formatDateTime, getStatusColor, isDeadlinePassed, getTimeRemaining } from '../utils/helpers';
import AnalyticsReporting from '../components/AnalyticsReporting';

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [showPDFViewer, setShowPDFViewer] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [selectedRole, setSelectedRole] = useState(user?.role || 'TEACHER');
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [assignmentsRes, submissionsRes, statsRes] = await Promise.all([
        assignmentAPI.getAll(),
        submissionAPI.getTeacherSubmissions(),
        submissionAPI.getStats(),
      ]);
      
      setAssignments(assignmentsRes.data);
      setSubmissions(submissionsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditAssignment = (assignment) => {
    // Convert the assignment deadline to separate date and time
    const deadline = new Date(assignment.deadline);
    const date = deadline.toISOString().split('T')[0];
    const time = deadline.toTimeString().slice(0, 5);
    
    setEditingAssignment({
      ...assignment,
      deadlineDate: date,
      deadlineTime: time
    });
    setShowEditModal(true);
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (window.confirm('Are you sure you want to delete this assignment? This action cannot be undone.')) {
      try {
        await assignmentAPI.delete(assignmentId);
        loadDashboardData();
        alert('Assignment deleted successfully');
      } catch (error) {
        console.error('Error deleting assignment:', error);
        alert('Error deleting assignment. Please try again.');
      }
    }
  };

  const openPDFViewer = (submission) => {
    setSelectedSubmission(submission);
    setShowPDFViewer(true);
  };

  const closePDFViewer = () => {
    setShowPDFViewer(false);
    setSelectedSubmission(null);
  };

  const handleGradeSubmitted = () => {
    loadDashboardData(); // Refresh data after grading
  };

  const handleRoleSave = async () => {
    if (selectedRole === user?.role) {
      alert('No changes detected in role selection.');
      return;
    }

    setProfileLoading(true);
    try {
      const response = await userAPI.updateRole({ role: selectedRole });
      
      if (response.data) {
        // Update localStorage with new user data
        const updatedUser = {
          ...user,
          role: selectedRole
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        localStorage.setItem('token', response.data.token);
        
        alert('Role updated successfully! The page will reload to reflect changes.');
        
        // Reload the page to reflect the role change
        window.location.reload();
      }
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Failed to update role. Please try again.');
    } finally {
      setProfileLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color = 'blue' }) => (
    <div className="bg-white rounded-lg shadow-soft p-6 border-l-4 border-l-primary-500">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const AssignmentCard = ({ assignment }) => (
    <div className="bg-white rounded-lg shadow-soft p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
          <p className="text-sm text-gray-500 mt-1">Code: {assignment.assignmentCode}</p>
          <p className="text-sm text-gray-600 mt-2">{assignment.description}</p>
        </div>
        <div className="flex space-x-2">
          <button className="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-blue-50">
            <Eye className="h-4 w-4" />
          </button>
          <button 
            onClick={() => handleEditAssignment(assignment)}
            className="p-2 text-gray-500 hover:text-green-600 rounded-lg hover:bg-green-50"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button 
            onClick={() => handleDeleteAssignment(assignment.id)}
            className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDateTime(assignment.deadline)}
          </span>
          <span className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            {assignment.submissionCount} submissions
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {isDeadlinePassed(assignment.deadline) ? (
            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
              Expired
            </span>
          ) : (
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              {getTimeRemaining(assignment.deadline)} left
            </span>
          )}
        </div>
      </div>
    </div>
  );

  const CreateAssignmentModal = () => {
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      deadlineDate: '',
      deadlineTime: '',
      maxMarks: 100,
      instructions: ''
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        // Combine date and time into proper format
        const deadlineDateTime = `${formData.deadlineDate}T${formData.deadlineTime}:00`;
        
        await assignmentAPI.create({
          title: formData.title,
          description: formData.description,
          deadline: deadlineDateTime,
          maxMarks: formData.maxMarks,
          instructions: formData.instructions
        });
        setShowCreateModal(false);
        loadDashboardData();
        setFormData({
          title: '',
          description: '',
          deadlineDate: '',
          deadlineTime: '',
          maxMarks: 100,
          instructions: ''
        });
      } catch (error) {
        console.error('Error creating assignment:', error);
        alert('Error creating assignment. Please try again.');
      }
    };

    return (
      <div className="fixed inset-0  bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/90 backdrop-saturate-100 rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Assignment</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Assignment title"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows="3"
          placeholder="Assignment description"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Deadline Date</label>
          <input
            type="date"
            required
            value={formData.deadlineDate}
            onChange={(e) => setFormData({...formData, deadlineDate: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          </div>
          <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Deadline Time</label>
          <input
            type="time"
            required
            value={formData.deadlineTime}
            onChange={(e) => setFormData({...formData, deadlineTime: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Max Marks</label>
          <input
          type="number"
          required
          min="1"
          value={formData.maxMarks}
          onChange={(e) => setFormData({...formData, maxMarks: parseInt(e.target.value)})}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
          <textarea
          value={formData.instructions}
          onChange={(e) => setFormData({...formData, instructions: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows="3"
          placeholder="Assignment instructions"
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
          type="button"
          onClick={() => setShowCreateModal(false)}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
          Cancel
          </button>
          <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
          Create Assignment
          </button>
        </div>
        </form>
      </div>
      </div>
    );
  };

  const EditAssignmentModal = () => {
    const [formData, setFormData] = useState({
      title: editingAssignment?.title || '',
      description: editingAssignment?.description || '',
      deadlineDate: editingAssignment?.deadlineDate || '',
      deadlineTime: editingAssignment?.deadlineTime || '',
      maxMarks: editingAssignment?.maxMarks || 100,
      instructions: editingAssignment?.instructions || ''
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        // Combine date and time into proper format
        const deadlineDateTime = `${formData.deadlineDate}T${formData.deadlineTime}:00`;
        
        await assignmentAPI.update(editingAssignment.id, {
          title: formData.title,
          description: formData.description,
          deadline: deadlineDateTime,
          maxMarks: formData.maxMarks,
          instructions: formData.instructions
        });
        setShowEditModal(false);
        setEditingAssignment(null);
        loadDashboardData();
        alert('Assignment updated successfully');
      } catch (error) {
        console.error('Error updating assignment:', error);
        alert('Error updating assignment. Please try again.');
      }
    };

    return ( 
      <div className="fixed inset-0  bg-white/90 backdrop-saturate-100 flex items-center justify-center p-4 z-50">
        <div className=" rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Assignment</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Assignment title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                placeholder="Assignment description"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deadline Date</label>
                <input
                  type="date"
                  required
                  value={formData.deadlineDate}
                  onChange={(e) => setFormData({...formData, deadlineDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deadline Time</label>
                <input
                  type="time"
                  required
                  value={formData.deadlineTime}
                  onChange={(e) => setFormData({...formData, deadlineTime: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Marks</label>
              <input
                type="number"
                required
                min="1"
                value={formData.maxMarks}
                onChange={(e) => setFormData({...formData, maxMarks: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
              <textarea
                value={formData.instructions}
                onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                placeholder="Assignment instructions"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingAssignment(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update Assignment
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Teacher Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user?.firstName} {user?.lastName}
              </span>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Assignments"
            value={assignments.length}
            icon={FileText}
            color="blue"
          />
          <StatCard
            title="Total Submissions"
            value={stats.totalSubmissions || 0}
            icon={Upload}
            color="green"
          />
          <StatCard
            title="Pending Reviews"
            value={stats.pendingSubmissions || 0}
            icon={Clock}
            color="orange"
          />
          <StatCard
            title="Completed"
            value={stats.gradedSubmissions || 0}
            icon={CheckCircle}
            color="green"
          />
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-soft mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'overview', label: 'Overview', icon: BookOpen },
                { key: 'assignments', label: 'Assignments', icon: FileText },
                { key: 'submissions', label: 'Submissions', icon: Users },
                { key: 'analytics', label: 'Analytics', icon: BarChart3 },
                { key: 'profile', label: 'Profile', icon: User },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Assignment
                  </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Assignments</h3>
                    <div className="space-y-4">
                      {assignments.slice(0, 3).map((assignment) => (
                        <AssignmentCard key={assignment.id} assignment={assignment} />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Submissions</h3>
                    <div className="space-y-4">
                      {submissions.slice(0, 5).map((submission) => (
                        <div key={submission.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{submission.assignment?.title}</p>
                            <p className="text-sm text-gray-600">{submission.student?.firstName} {submission.student?.lastName}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full status-${submission.status.toLowerCase()}`}>
                            {submission.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'assignments' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">My Assignments</h2>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Assignment
                  </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {assignments.map((assignment) => (
                    <AssignmentCard key={assignment.id} assignment={assignment} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'submissions' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Student Submissions</h2>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Assignment
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Submitted At
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {submissions.map((submission) => (
                        <tr key={submission.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {submission.student?.firstName} {submission.student?.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{submission.student?.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{submission.assignment?.title}</div>
                            <div className="text-sm text-gray-500">Code: {submission.assignment?.assignmentCode}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDateTime(submission.submittedAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full status-${submission.status.toLowerCase()}`}>
                              {submission.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button 
                              onClick={() => openPDFViewer(submission)}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                              title="View & Grade PDF"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <AnalyticsReporting teacherId={user?.id} />
            )}

            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">My Profile</h2>
                
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center mb-6">
                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                      <User className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </h3>
                      <p className="text-gray-600">{user?.email}</p>
                      <p className="text-sm text-gray-500">Teacher</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Teaching Statistics</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Assignments:</span>
                          <span className="font-medium">{assignments.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Submissions:</span>
                          <span className="font-medium">{submissions.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Graded Submissions:</span>
                          <span className="font-medium">
                            {submissions.filter(s => s.status === 'GRADED').length}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Account Details</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Role:</span>
                          <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="TEACHER">Teacher</option>
                            <option value="STUDENT">Student</option>
                          </select>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Member Since:</span>
                          <span className="font-medium">{formatDateTime(user?.createdAt || new Date())}</span>
                        </div>
                        <div className="mt-4">
                          <button
                            onClick={handleRoleSave}
                            disabled={profileLoading || selectedRole === user?.role}
                            className={`flex items-center px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                              profileLoading || selectedRole === user?.role
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                          >
                            <Save className="h-4 w-4 mr-2" />
                            {profileLoading ? 'Saving...' : 'Save Changes'}
                          </button>
                          {selectedRole !== user?.role && (
                            <p className="text-sm text-amber-600 mt-2">
                              ⚠️ Changing your role will reload the page and redirect you to the appropriate dashboard.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Assignment Modal */}
      {showCreateModal && <CreateAssignmentModal />}
      {showEditModal && <EditAssignmentModal />}

      {/* PDF Viewer Modal */}
      {showPDFViewer && selectedSubmission && (
        <PDFViewer
          submission={selectedSubmission}
          onClose={closePDFViewer}
          onGradeSubmitted={handleGradeSubmitted}
          isTeacher={true}
        />
      )}
    </div>
  );
};

export default TeacherDashboard;