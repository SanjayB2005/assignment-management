import React, { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Download, 
  Save,
  Highlighter,
  MessageSquare,
  Edit3,
  Trash2
} from 'lucide-react';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PDFAnnotationViewer = ({ 
  fileUrl, 
  submissionId, 
  canAnnotate = false,
  onAnnotationSave,
  existingAnnotations = []
}) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [annotations, setAnnotations] = useState(existingAnnotations);
  const [selectedTool, setSelectedTool] = useState('select');
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentAnnotation, setCurrentAnnotation] = useState(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);

  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    setAnnotations(existingAnnotations);
  }, [existingAnnotations]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setLoading(false);
  };

  const changePage = (offset) => {
    setPageNumber(prevPageNumber => Math.min(Math.max(prevPageNumber + offset, 1), numPages));
  };

  const zoomIn = () => setScale(prev => Math.min(prev + 0.2, 3.0));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));
  const rotate = () => setRotation(prev => (prev + 90) % 360);

  const handleCanvasMouseDown = (e) => {
    if (!canAnnotate || selectedTool === 'select') return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;
    
    setIsDrawing(true);
    setCurrentAnnotation({
      id: Date.now(),
      type: selectedTool,
      pageNumber,
      startX: x,
      startY: y,
      endX: x,
      endY: y,
      color: getToolColor(selectedTool),
      content: ''
    });
  };

  const handleCanvasMouseMove = (e) => {
    if (!isDrawing || !currentAnnotation) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;
    
    setCurrentAnnotation(prev => ({
      ...prev,
      endX: x,
      endY: y
    }));
  };

  const handleCanvasMouseUp = () => {
    if (!isDrawing || !currentAnnotation) return;
    
    setIsDrawing(false);
    
    if (currentAnnotation.type === 'comment') {
      setShowCommentModal(true);
    } else {
      saveAnnotation(currentAnnotation);
    }
  };

  const saveAnnotation = (annotation) => {
    const newAnnotation = {
      ...annotation,
      width: Math.abs(annotation.endX - annotation.startX),
      height: Math.abs(annotation.endY - annotation.startY),
      x: Math.min(annotation.startX, annotation.endX),
      y: Math.min(annotation.startY, annotation.endY)
    };
    
    setAnnotations(prev => [...prev, newAnnotation]);
    setCurrentAnnotation(null);
    
    if (onAnnotationSave) {
      onAnnotationSave(newAnnotation);
    }
  };

  const saveComment = () => {
    if (currentAnnotation && commentText.trim()) {
      const annotationWithComment = {
        ...currentAnnotation,
        content: commentText,
        width: 20,
        height: 20,
        x: currentAnnotation.startX,
        y: currentAnnotation.startY
      };
      
      saveAnnotation(annotationWithComment);
      setCommentText('');
      setShowCommentModal(false);
    }
  };

  const deleteAnnotation = (annotationId) => {
    setAnnotations(prev => prev.filter(ann => ann.id !== annotationId));
  };

  const getToolColor = (tool) => {
    switch (tool) {
      case 'highlight': return '#FFFF00';
      case 'comment': return '#FF6B6B';
      case 'correction': return '#FF0000';
      default: return '#000000';
    }
  };

  const renderAnnotations = () => {
    return annotations
      .filter(ann => ann.pageNumber === pageNumber)
      .map(annotation => (
        <div
          key={annotation.id}
          className="absolute pointer-events-auto"
          style={{
            left: annotation.x * scale,
            top: annotation.y * scale,
            width: annotation.width * scale,
            height: annotation.height * scale,
            backgroundColor: annotation.type === 'highlight' ? annotation.color + '80' : 'transparent',
            border: annotation.type !== 'highlight' ? `2px solid ${annotation.color}` : 'none',
            cursor: canAnnotate ? 'pointer' : 'default'
          }}
          title={annotation.content}
        >
          {annotation.type === 'comment' && (
            <MessageSquare 
              className="h-4 w-4 text-red-500" 
              style={{ color: annotation.color }}
            />
          )}
          {canAnnotate && (
            <button
              onClick={() => deleteAnnotation(annotation.id)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 hover:opacity-100 transition-opacity"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          )}
        </div>
      ));
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          {/* Navigation Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => changePage(-1)}
              disabled={pageNumber <= 1}
              className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-3 py-1 bg-gray-100 rounded">
              Page {pageNumber} of {numPages}
            </span>
            <button
              onClick={() => changePage(1)}
              disabled={pageNumber >= numPages}
              className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center space-x-2">
            <button onClick={zoomOut} className="p-2 hover:bg-gray-100 rounded">
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="px-3 py-1 bg-gray-100 rounded text-sm">
              {Math.round(scale * 100)}%
            </span>
            <button onClick={zoomIn} className="p-2 hover:bg-gray-100 rounded">
              <ZoomIn className="h-4 w-4" />
            </button>
            <button onClick={rotate} className="p-2 hover:bg-gray-100 rounded">
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          {/* Annotation Tools */}
          {canAnnotate && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSelectedTool('select')}
                className={`p-2 rounded ${selectedTool === 'select' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
              >
                Select
              </button>
              <button
                onClick={() => setSelectedTool('highlight')}
                className={`p-2 rounded ${selectedTool === 'highlight' ? 'bg-yellow-100 text-yellow-600' : 'hover:bg-gray-100'}`}
              >
                <Highlighter className="h-4 w-4" />
              </button>
              <button
                onClick={() => setSelectedTool('comment')}
                className={`p-2 rounded ${selectedTool === 'comment' ? 'bg-red-100 text-red-600' : 'hover:bg-gray-100'}`}
              >
                <MessageSquare className="h-4 w-4" />
              </button>
              <button
                onClick={() => setSelectedTool('correction')}
                className={`p-2 rounded ${selectedTool === 'correction' ? 'bg-red-100 text-red-600' : 'hover:bg-gray-100'}`}
              >
                <Edit3 className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded">
              <Download className="h-4 w-4" />
            </button>
            {canAnnotate && (
              <button className="p-2 hover:bg-gray-100 rounded">
                <Save className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 overflow-auto bg-gray-200 p-4">
        <div 
          ref={containerRef}
          className="relative bg-white shadow-lg mx-auto"
          style={{ width: 'fit-content' }}
        >
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}
          
          <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<div>Loading PDF...</div>}
            error={<div>Failed to load PDF</div>}
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              rotate={rotation}
              canvasRef={canvasRef}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
            />
          </Document>

          {/* Annotation Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {renderAnnotations()}
          </div>

          {/* Current annotation preview */}
          {isDrawing && currentAnnotation && (
            <div
              className="absolute pointer-events-none"
              style={{
                left: Math.min(currentAnnotation.startX, currentAnnotation.endX) * scale,
                top: Math.min(currentAnnotation.startY, currentAnnotation.endY) * scale,
                width: Math.abs(currentAnnotation.endX - currentAnnotation.startX) * scale,
                height: Math.abs(currentAnnotation.endY - currentAnnotation.startY) * scale,
                backgroundColor: currentAnnotation.type === 'highlight' ? currentAnnotation.color + '80' : 'transparent',
                border: currentAnnotation.type !== 'highlight' ? `2px dashed ${currentAnnotation.color}` : 'none'
              }}
            />
          )}
        </div>
      </div>

      {/* Comment Modal */}
      {showCommentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Add Comment</h3>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Enter your comment..."
              className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => {
                  setShowCommentModal(false);
                  setCommentText('');
                  setCurrentAnnotation(null);
                }}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={saveComment}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Comment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFAnnotationViewer;