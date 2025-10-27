import React, { useState, useEffect } from 'react';
import { X, Save, Download, Star } from 'lucide-react';
import { submissionAPI } from '../services/api';

const PDFViewer = ({ submission, onClose, onGradeSubmitted, isTeacher = false }) => {
  const [grading, setGrading] = useState({
    marks: submission.marksObtained || '',
    feedback: submission.feedback || ''
  });
  const [correctedFile, setCorrectedFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [loadingPdf, setLoadingPdf] = useState(true);

  useEffect(() => {
    const loadPDF = async () => {
      if (!submission.id) return;
      
      setLoadingPdf(true);
      try {
        const response = await submissionAPI.download(submission.id);
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (error) {
        console.error('Error loading PDF:', error);
        alert('Error loading PDF. Please try again.');
      } finally {
        setLoadingPdf(false);
      }
    };

    loadPDF();

    // Cleanup blob URL when component unmounts
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [submission.id]);

  const handleGradeSubmit = async () => {
    if (!grading.marks || grading.marks < 0 || grading.marks > submission.assignment.maxMarks) {
      alert(`Marks must be between 0 and ${submission.assignment.maxMarks}`);
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('marks', parseInt(grading.marks));
      if (grading.feedback) {
        formData.append('feedback', grading.feedback);
      }
      if (correctedFile) {
        formData.append('correctedFile', correctedFile);
      }

      await submissionAPI.gradeWithFile(submission.id, formData);
      
      alert('Grade submitted successfully!');
      onGradeSubmitted && onGradeSubmitted();
      onClose();
    } catch (error) {
      console.error('Error grading submission:', error);
      alert('Error submitting grade. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await submissionAPI.download(submission.id);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = submission.originalFilename || 'submission.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Error downloading file');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-11/12 h-5/6 flex flex-col max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {submission.assignment?.title} - {submission.studentName}
            </h2>
            <p className="text-sm text-gray-500">
              Code: {submission.assignment?.assignmentCode} | 
              Submitted: {new Date(submission.submittedAt).toLocaleString()}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownload}
              className="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-blue-50"
              title="Download PDF"
            >
              <Download className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-red-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* PDF Viewer */}
          <div className="flex-1 p-4">
            <div className="w-full h-full border border-gray-300 rounded-lg overflow-hidden">
              {loadingPdf ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading PDF...</p>
                  </div>
                </div>
              ) : (
                <iframe
                  src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
                  className="w-full h-full"
                  title="PDF Viewer"
                  style={{ minHeight: '600px' }}
                />
              )}
            </div>
          </div>

          {/* Grading Panel (only for teachers) */}
          {isTeacher && (
            <div className="w-80 p-4 border-l border-gray-200 bg-gray-50">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    <Star className="h-5 w-5 inline mr-2" />
                    Grade Submission
                  </h3>
                </div>

                <div className="bg-white p-4 rounded-lg border">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Marks Obtained (Max: {submission.assignment?.maxMarks})
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={submission.assignment?.maxMarks}
                        value={grading.marks}
                        onChange={(e) => setGrading({...grading, marks: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter marks"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Feedback
                      </label>
                      <textarea
                        value={grading.feedback}
                        onChange={(e) => setGrading({...grading, feedback: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows="6"
                        placeholder="Enter feedback for the student..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Upload Corrected PDF (Optional)
                      </label>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setCorrectedFile(e.target.files[0])}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      {correctedFile && (
                        <p className="text-sm text-gray-600 mt-1">
                          Selected: {correctedFile.name}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={handleGradeSubmit}
                      disabled={saving || !grading.marks}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {saving ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      {saving ? 'Saving...' : 'Submit Grade'}
                    </button>
                  </div>
                </div>

                {/* Current Grade Display */}
                {submission.marksObtained !== null && (
                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-medium text-gray-900 mb-2">Current Grade</h4>
                    <div className="text-2xl font-bold text-blue-600">
                      {submission.marksObtained}/{submission.assignment?.maxMarks}
                    </div>
                    <div className="text-sm text-gray-600">
                      {Math.round((submission.marksObtained / submission.assignment?.maxMarks) * 100)}%
                    </div>
                    {submission.feedback && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700">Previous Feedback:</p>
                        <p className="text-sm text-gray-600 mt-1">{submission.feedback}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;