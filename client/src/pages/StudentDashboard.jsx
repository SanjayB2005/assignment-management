import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { assignmentAPI, submissionAPI, userAPI } from '../services/api';
import PDFViewer from '../components/PDFViewer';
import { 
  Search, 
  Upload, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Download,
  Eye,
  Calendar,
  Trophy,
  TrendingUp,
  BookOpen,
  User,
  Save
} from 'lucide-react';
import { formatDateTime, getStatusColor, isDeadlinePassed, getTimeRemaining } from '../utils/helpers';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('search');
  const [searchCode, setSearchCode] = useState('');
  const [currentAssignment, setCurrentAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [showPDFViewer, setShowPDFViewer] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [selectedRole, setSelectedRole] = useState(user?.role || 'STUDENT');
  const [profileLoading, setProfileLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      const response = await submissionAPI.getStudentSubmissions();
      setSubmissions(response.data);
    } catch (error) {
      console.error('Error loading submissions:', error);
    }
  };

  const searchAssignment = async () => {
    if (!searchCode.trim()) return;
    
    setLoading(true);
    try {
      const response = await assignmentAPI.getByCode(searchCode.toUpperCase());
      setCurrentAssignment(response.data);
    } catch (error) {
      console.error('Error searching assignment:', error);
      setCurrentAssignment(null);
      alert('Assignment not found or invalid code');
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (file) => {
    if (file.type !== 'application/pdf') {
      alert('Please select a PDF file only');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('File size must be less than 10MB');
      return;
    }
    
    setSelectedFile(file);
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const uploadSubmission = async () => {
    if (!selectedFile || !currentAssignment) return;
    
    setUploadLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('assignmentCode', currentAssignment.assignmentCode);
      
      await submissionAPI.upload(formData);
      alert('File uploaded successfully!');
      setSelectedFile(null);
      loadSubmissions();
      setCurrentAssignment(null);
      setSearchCode('');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploadLoading(false);
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

  const downloadSubmission = async (submissionId) => {
    try {
      const response = await submissionAPI.download(submissionId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'submission.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading file:', error);
    }
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

  const AssignmentCard = ({ assignment }) => {
    const hasSubmitted = submissions.some(s => s.assignment?.id === assignment.id);
    const submission = submissions.find(s => s.assignment?.id === assignment.id);
    
    return (
      <div className="bg-white rounded-lg shadow-soft p-6 hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
            <p className="text-sm text-gray-500 mt-1">Code: {assignment.assignmentCode}</p>
            <p className="text-sm text-gray-600 mt-2">{assignment.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            {hasSubmitted ? (
              <span className={`px-2 py-1 text-xs rounded-full status-${submission.status.toLowerCase()}`}>
                {submission.status}
              </span>
            ) : (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                Not Submitted
              </span>
            )}
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDateTime(assignment.deadline)}
            </span>
            <span className="flex items-center">
              <Trophy className="h-4 w-4 mr-1" />
              {assignment.maxMarks} marks
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
  };

  const completedSubmissions = submissions.filter(s => s.status === 'COMPLETED').length;
  const pendingSubmissions = submissions.filter(s => s.status === 'PENDING').length;
  const averageMarks = submissions
    .filter(s => s.marksObtained !== null)
    .reduce((acc, s) => acc + s.marksObtained, 0) / Math.max(completedSubmissions, 1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Student Dashboard</h1>
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
            title="Total Submissions"
            value={submissions.length}
            icon={FileText}
            color="blue"
          />
          <StatCard
            title="Completed"
            value={completedSubmissions}
            icon={CheckCircle}
            color="green"
          />
          <StatCard
            title="Pending Review"
            value={pendingSubmissions}
            icon={Clock}
            color="orange"
          />
          <StatCard
            title="Average Score"
            value={`${Math.round(averageMarks || 0)}%`}
            icon={TrendingUp}
            color="purple"
          />
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-soft mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'search', label: 'Search Assignment', icon: Search },
                { key: 'submissions', label: 'My Submissions', icon: FileText },
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
            {activeTab === 'search' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Search for Assignment</h2>
                
                {/* Search Box */}
                <div className="max-w-md mb-6">
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={searchCode}
                      onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
                      placeholder="Enter 5-digit assignment code"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      maxLength="5"
                    />
                    <button
                      onClick={searchAssignment}
                      disabled={loading || !searchCode.trim()}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? 'Searching...' : 'Search'}
                    </button>
                  </div>
                </div>

                {/* Assignment Details */}
                {currentAssignment && (
                  <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{currentAssignment.title}</h3>
                    <p className="text-gray-600 mb-4">{currentAssignment.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Deadline</p>
                        <p className="font-medium">{formatDateTime(currentAssignment.deadline)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Max Marks</p>
                        <p className="font-medium">{currentAssignment.maxMarks}</p>
                      </div>
                    </div>
                    
                    {currentAssignment.instructions && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-500 mb-2">Instructions</p>
                        <p className="text-gray-700">{currentAssignment.instructions}</p>
                      </div>
                    )}

                    {/* File Upload Area */}
                    {!isDeadlinePassed(currentAssignment.deadline) && (
                      <div className="border-t pt-4">
                        <p className="text-sm font-medium text-gray-700 mb-3">Upload Your Submission (PDF only)</p>
                        
                        <div
                          className={`file-upload-area ${dragActive ? 'dragover' : ''}`}
                          onDragEnter={handleDrag}
                          onDragLeave={handleDrag}
                          onDragOver={handleDrag}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf"
                            onChange={handleFileInputChange}
                            className="hidden"
                          />
                          
                          <Upload className="h-12 w-12 text-gray-400 mb-4 mx-auto" />
                          <p className="text-lg font-medium text-gray-700 mb-2">
                            {selectedFile ? selectedFile.name : 'Drop your PDF here, or click to browse'}
                          </p>
                          <p className="text-sm text-gray-500">Maximum file size: 10MB</p>
                        </div>
                        
                        {selectedFile && (
                          <div className="mt-4 flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                              Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)}KB)
                            </span>
                            <div className="space-x-3">
                              <button
                                onClick={() => setSelectedFile(null)}
                                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={uploadSubmission}
                                disabled={uploadLoading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                              >
                                {uploadLoading ? 'Uploading...' : 'Submit Assignment'}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {isDeadlinePassed(currentAssignment.deadline) && (
                      <div className="border-t pt-4">
                        <div className="flex items-center p-4 bg-red-50 rounded-lg">
                          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                          <p className="text-red-700">This assignment deadline has passed. Submissions are no longer accepted.</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'submissions' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">My Submissions</h2>
                
                {submissions.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No submissions yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {submissions.map((submission) => (
                      <div key={submission.id} className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{submission.assignment?.title}</h3>
                            <p className="text-sm text-gray-500">Code: {submission.assignment?.assignmentCode}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full status-${submission.status.toLowerCase()}`}>
                            {submission.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-500">Submitted</p>
                            <p className="font-medium">{formatDateTime(submission.submittedAt)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">File</p>
                            <p className="font-medium">{submission.originalFilename}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Status</p>
                            <p className="font-medium">{submission.status}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Score</p>
                            <p className="font-medium">
                              {submission.marksObtained !== null ? 
                                `${submission.marksObtained}/${submission.assignment?.maxMarks}` : 
                                'Not graded'
                              }
                            </p>
                          </div>
                        </div>
                        
                        {submission.feedback && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-500 mb-2">Feedback</p>
                            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{submission.feedback}</p>
                          </div>
                        )}
                        
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => openPDFViewer(submission)}
                            className="flex items-center px-4 py-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View PDF
                          </button>
                          <button
                            onClick={() => downloadSubmission(submission.id)}
                            className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
                      <p className="text-sm text-gray-500">Student</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Academic Performance</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Submissions:</span>
                          <span className="font-medium">{submissions.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Completed:</span>
                          <span className="font-medium">{completedSubmissions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Average Score:</span>
                          <span className="font-medium">{Math.round(averageMarks || 0)}%</span>
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
                            <option value="STUDENT">Student</option>
                            <option value="TEACHER">Teacher</option>
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

      {/* PDF Viewer Modal */}
      {showPDFViewer && selectedSubmission && (
        <PDFViewer
          submission={selectedSubmission}
          onClose={closePDFViewer}
          isTeacher={false}
        />
      )}
    </div>
  );
};

export default StudentDashboard;