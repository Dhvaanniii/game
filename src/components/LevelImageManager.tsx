import React, { useState, useEffect } from 'react';
import { Upload, Image, Trash2, Eye, Download } from 'lucide-react';

interface LevelImage {
  level: number;
  imageUrl: string;
  fileName: string;
  uploadDate: Date;
}

interface LevelImageManagerProps {
  onImageUpdate?: (level: number, imageUrl: string) => void;
}

const LevelImageManager: React.FC<LevelImageManagerProps> = ({ onImageUpdate }) => {
  const [levelImages, setLevelImages] = useState<LevelImage[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [dragOver, setDragOver] = useState(false);

  // Load existing images from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('tangleLevelImages');
    if (stored) {
      const parsed = JSON.parse(stored);
      setLevelImages(parsed.map((img: any) => ({
        ...img,
        uploadDate: new Date(img.uploadDate)
      })));
    }
  }, []);

  // Save images to localStorage
  const saveImages = (images: LevelImage[]) => {
    localStorage.setItem('tangleLevelImages', JSON.stringify(images));
    setLevelImages(images);
  };

  const handleFileUpload = (file: File, level: number) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      const newImage: LevelImage = {
        level,
        imageUrl,
        fileName: file.name,
        uploadDate: new Date()
      };

      const updatedImages = levelImages.filter(img => img.level !== level);
      updatedImages.push(newImage);
      updatedImages.sort((a, b) => a.level - b.level);
      
      saveImages(updatedImages);
      onImageUpdate?.(level, imageUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    files.forEach((file, index) => {
      handleFileUpload(file, selectedLevel + index);
    });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file, index) => {
      handleFileUpload(file, selectedLevel + index);
    });
  };

  const deleteImage = (level: number) => {
    const updatedImages = levelImages.filter(img => img.level !== level);
    saveImages(updatedImages);
  };

  const getImageForLevel = (level: number) => {
    return levelImages.find(img => img.level === level);
  };

  const exportImages = () => {
    const dataStr = JSON.stringify(levelImages, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tangle-level-images.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const importImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        const validImages = imported.filter((img: any) => 
          img.level && img.imageUrl && img.fileName
        ).map((img: any) => ({
          ...img,
          uploadDate: new Date(img.uploadDate || Date.now())
        }));
        saveImages(validImages);
      } catch (error) {
        alert('Invalid file format');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Level Image Manager</h2>
        <div className="flex gap-2">
          <button
            onClick={exportImages}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <label className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 cursor-pointer">
            <Upload className="w-4 h-4" />
            Import
            <input
              type="file"
              accept=".json"
              onChange={importImages}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Level Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Level (1-236):
        </label>
        <input
          type="number"
          min="1"
          max="236"
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(parseInt(e.target.value) || 1)}
          className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
      >
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-700 mb-2">
          Upload Image for Level {selectedLevel}
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Drag and drop images here, or click to select files
        </p>
        <label className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer">
          <Image className="w-4 h-4" />
          Choose Files
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />
        </label>
      </div>

      {/* Current Level Image */}
      {getImageForLevel(selectedLevel) && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Current Image for Level {selectedLevel}
          </h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <img
              src={getImageForLevel(selectedLevel)!.imageUrl}
              alt={`Level ${selectedLevel}`}
              className="max-w-full h-48 object-contain mx-auto rounded"
            />
            <div className="flex items-center justify-between mt-3">
              <span className="text-sm text-gray-600">
                {getImageForLevel(selectedLevel)!.fileName}
              </span>
              <button
                onClick={() => deleteImage(selectedLevel)}
                className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Images Grid */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          All Uploaded Images ({levelImages.length}/236)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-h-96 overflow-y-auto">
          {levelImages.map((image) => (
            <div key={image.level} className="bg-gray-50 rounded-lg p-2">
              <img
                src={image.imageUrl}
                alt={`Level ${image.level}`}
                className="w-full h-20 object-cover rounded mb-2"
              />
              <div className="text-center">
                <div className="text-sm font-medium text-gray-800">
                  Level {image.level}
                </div>
                <div className="flex justify-center gap-1 mt-1">
                  <button
                    onClick={() => setSelectedLevel(image.level)}
                    className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                    title="View"
                  >
                    <Eye className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => deleteImage(image.level)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                    title="Delete"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <h4 className="font-medium text-yellow-800 mb-2">Instructions:</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Upload images for each of the 236 levels</li>
          <li>• Images should show the target pattern children need to recreate</li>
          <li>• Supported formats: JPG, PNG, GIF, WebP</li>
          <li>• Images are stored locally in your browser</li>
          <li>• Use Export/Import to backup or share your image collection</li>
        </ul>
      </div>
    </div>
  );
};

export default LevelImageManager;