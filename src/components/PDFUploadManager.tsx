import React, { useState, useRef } from 'react';
import { Upload, FileText, Trash2, Eye, Download, AlertCircle, CheckCircle } from 'lucide-react';

interface PDFLevel {
  levelNumber: number;
  pageNumber: number;
  category: 'tangle' | 'funthinker-basic' | 'funthinker-medium' | 'funthinker-hard';
  outlineUrl: string;
  unlockDate: Date;
  lockDate: Date;
}

interface PDFUploadManagerProps {
  category: 'tangle' | 'funthinker-basic' | 'funthinker-medium' | 'funthinker-hard';
  onLevelsCreated?: (levels: PDFLevel[]) => void;
}

const PDFUploadManager: React.FC<PDFUploadManagerProps> = ({ category, onLevelsCreated }) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedLevels, setProcessedLevels] = useState<PDFLevel[]>([]);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get existing level count for this category
  const getExistingLevelCount = (): number => {
    const stored = localStorage.getItem(`${category}-levels`);
    if (stored) {
      const levels = JSON.parse(stored);
      return levels.length;
    }
    return 0;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please select a PDF file');
      return;
    }

    setUploadedFile(file);
    setError('');
    setSuccess('');
  };

  const processPDF = async () => {
    if (!uploadedFile) return;

    setIsProcessing(true);
    setError('');

    try {
      // Simulate PDF processing (in real implementation, use PDF.js or similar)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock: Assume PDF has 4 pages for demo
      const pageCount = 4;
      const existingCount = getExistingLevelCount();
      
      const newLevels: PDFLevel[] = [];
      
      for (let i = 1; i <= pageCount; i++) {
        const levelNumber = existingCount + i;
        const unlockDate = new Date();
        unlockDate.setDate(unlockDate.getDate() + (levelNumber - 1)); // Unlock daily
        
        const lockDate = new Date(unlockDate);
        lockDate.setDate(lockDate.getDate() + 15); // Lock after 15 days

        // Create mock outline URL (in real implementation, convert PDF page to SVG/PNG)
        const outlineUrl = URL.createObjectURL(uploadedFile);

        newLevels.push({
          levelNumber,
          pageNumber: i,
          category,
          outlineUrl,
          unlockDate,
          lockDate,
        });
      }

      setProcessedLevels(newLevels);
      
      // Save to localStorage (in real implementation, save to database)
      const existingLevels = JSON.parse(localStorage.getItem(`${category}-levels`) || '[]');
      const allLevels = [...existingLevels, ...newLevels];
      localStorage.setItem(`${category}-levels`, JSON.stringify(allLevels));

      setSuccess(`Successfully processed ${pageCount} pages and created ${pageCount} new levels!`);
      onLevelsCreated?.(newLevels);

    } catch (err) {
      setError('Failed to process PDF. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const clearUpload = () => {
    setUploadedFile(null);
    setProcessedLevels([]);
    setError('');
    setSuccess('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getCategoryDisplayName = () => {
    switch (category) {
      case 'tangle': return 'Tangles';
      case 'funthinker-basic': return 'Funthinker Basic';
      case 'funthinker-medium': return 'Funthinker Medium';
      case 'funthinker-hard': return 'Funthinker Hard';
      default: return category;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">
          PDF Upload - {getCategoryDisplayName()}
        </h3>
        <div className="text-sm text-gray-600">
          Existing Levels: {getExistingLevelCount()}
        </div>
      </div>

      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-700 mb-2">
          Upload PDF with Puzzle Outlines
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Each page will become a new level. Pages will be auto-numbered starting from the next available level.
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <button
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Upload className="w-4 h-4" />
          Choose PDF File
        </button>
      </div>

      {/* File Info */}
      {uploadedFile && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-red-600" />
              <div>
                <p className="font-medium text-gray-800">{uploadedFile.name}</p>
                <p className="text-sm text-gray-600">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={processPDF}
                disabled={isProcessing}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Process PDF
                  </>
                )}
              </button>
              <button
                onClick={clearUpload}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Messages */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <p className="text-green-800">{success}</p>
        </div>
      )}

      {/* Processed Levels */}
      {processedLevels.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            Created Levels ({processedLevels.length})
          </h4>
          <div className="space-y-3">
            {processedLevels.map((level) => (
              <div key={level.levelNumber} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">
                    Level {level.levelNumber} (Page {level.pageNumber})
                  </p>
                  <p className="text-sm text-gray-600">
                    Unlocks: {level.unlockDate.toLocaleDateString()} | 
                    Locks: {level.lockDate.toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => window.open(level.outlineUrl, '_blank')}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                    title="Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <h5 className="font-medium text-yellow-800 mb-2">Instructions:</h5>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Upload a PDF where each page contains a puzzle outline</li>
          <li>• Pages will be automatically converted to individual levels</li>
          <li>• Levels will be numbered sequentially starting from the next available number</li>
          <li>• Each level unlocks daily at midnight and locks after 15 days if unplayed</li>
          <li>• Supported format: PDF files only</li>
        </ul>
      </div>
    </div>
  );
};

export default PDFUploadManager;