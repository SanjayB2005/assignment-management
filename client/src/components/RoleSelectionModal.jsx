import React, { useState } from 'react';
import { Users, GraduationCap, BookOpen, X } from 'lucide-react';

const RoleSelectionModal = ({ isOpen, onClose, onRoleSelect, userEmail, userFirstName }) => {
  const [selectedRole, setSelectedRole] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleSubmit = async () => {
    if (!selectedRole) return;
    
    setIsSubmitting(true);
    try {
      await onRoleSelect(selectedRole);
    } catch (error) {
      console.error('Role selection error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Welcome, {userFirstName}!
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Please select your role to continue
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 mb-6 text-center">
            Since you're signing in with Google for the first time, we need to know your role in the system.
          </p>

          <div className="space-y-4">
            {/* Student Option */}
            <div
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedRole === 'STUDENT'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => handleRoleSelect('STUDENT')}
            >
              <div className="flex items-center space-x-3">
                <div className={`shrink-0 ${
                  selectedRole === 'STUDENT' ? 'text-blue-600' : 'text-gray-400'
                }`}>
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className={`font-medium ${
                    selectedRole === 'STUDENT' ? 'text-blue-900' : 'text-gray-900'
                  }`}>
                    Student
                  </h3>
                  <p className={`text-sm ${
                    selectedRole === 'STUDENT' ? 'text-blue-700' : 'text-gray-600'
                  }`}>
                    Access assignments, submit work, and view grades
                  </p>
                </div>
                <div className={`shrink-0 ${
                  selectedRole === 'STUDENT' ? 'text-blue-600' : 'text-gray-300'
                }`}>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedRole === 'STUDENT'
                      ? 'border-blue-600 bg-blue-600'
                      : 'border-gray-300'
                  }`}>
                    {selectedRole === 'STUDENT' && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Teacher Option */}
            <div
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedRole === 'TEACHER'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => handleRoleSelect('TEACHER')}
            >
              <div className="flex items-center space-x-3">
                <div className={`shrink-0 ${
                  selectedRole === 'TEACHER' ? 'text-green-600' : 'text-gray-400'
                }`}>
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className={`font-medium ${
                    selectedRole === 'TEACHER' ? 'text-green-900' : 'text-gray-900'
                  }`}>
                    Teacher
                  </h3>
                  <p className={`text-sm ${
                    selectedRole === 'TEACHER' ? 'text-green-700' : 'text-gray-600'
                  }`}>
                    Create assignments, manage classes, and grade submissions
                  </p>
                </div>
                <div className={`shrink-0 ${
                  selectedRole === 'TEACHER' ? 'text-green-600' : 'text-gray-300'
                }`}>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedRole === 'TEACHER'
                      ? 'border-green-600 bg-green-600'
                      : 'border-gray-300'
                  }`}>
                    {selectedRole === 'TEACHER' && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selectedRole || isSubmitting}
              className={`px-6 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                selectedRole
                  ? selectedRole === 'STUDENT'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Continuing...</span>
                </div>
              ) : (
                'Continue'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionModal;