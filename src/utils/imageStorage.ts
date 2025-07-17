// Utility functions for managing level images

export interface LevelImage {
  level: number;
  imageUrl: string;
  fileName: string;
  uploadDate: Date;
}

const STORAGE_KEY = 'tangleLevelImages';

export const getLevelImages = (): LevelImage[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    return parsed.map((img: any) => ({
      ...img,
      uploadDate: new Date(img.uploadDate)
    }));
  } catch (error) {
    console.error('Error loading level images:', error);
    return [];
  }
};

export const saveLevelImages = (images: LevelImage[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
  } catch (error) {
    console.error('Error saving level images:', error);
  }
};

export const getLevelImage = (level: number): LevelImage | null => {
  const images = getLevelImages();
  return images.find(img => img.level === level) || null;
};

export const addLevelImage = (level: number, imageUrl: string, fileName: string): void => {
  const images = getLevelImages();
  const existingIndex = images.findIndex(img => img.level === level);
  
  const newImage: LevelImage = {
    level,
    imageUrl,
    fileName,
    uploadDate: new Date()
  };

  if (existingIndex >= 0) {
    images[existingIndex] = newImage;
  } else {
    images.push(newImage);
  }

  images.sort((a, b) => a.level - b.level);
  saveLevelImages(images);
};

export const deleteLevelImage = (level: number): void => {
  const images = getLevelImages();
  const filtered = images.filter(img => img.level !== level);
  saveLevelImages(filtered);
};

export const getTargetImageUrl = (level: number): string => {
  const levelImage = getLevelImage(level);
  if (levelImage) {
    return levelImage.imageUrl;
  }
  
  // Fallback to placeholder
  return `https://via.placeholder.com/600x400/e5e7eb/6b7280?text=Level+${level}+%0A%0AUpload+target+image+in+Admin`;
};

export const exportLevelImages = (): void => {
  const images = getLevelImages();
  const dataStr = JSON.stringify(images, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `tangle-level-images-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  
  URL.revokeObjectURL(url);
};

export const importLevelImages = (file: File): Promise<void> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        
        if (!Array.isArray(imported)) {
          throw new Error('Invalid file format: expected array');
        }
        
        const validImages = imported.filter((img: any) => 
          img.level && 
          img.imageUrl && 
          img.fileName &&
          typeof img.level === 'number' &&
          img.level >= 1 && 
          img.level <= 236
        ).map((img: any) => ({
          ...img,
          uploadDate: new Date(img.uploadDate || Date.now())
        }));
        
        saveLevelImages(validImages);
        resolve();
      } catch (error) {
        reject(new Error('Invalid file format or corrupted data'));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};