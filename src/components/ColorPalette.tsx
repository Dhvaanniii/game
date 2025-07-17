import React from 'react';
import { Palette } from 'lucide-react';

export const colorPalette = [
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Green', value: '#10B981' },
  { name: 'Yellow', value: '#F59E0B' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Gray', value: '#6B7280' },
  { name: 'Indigo', value: '#6366F1' },
  { name: 'Teal', value: '#14B8A6' },
  { name: 'Lime', value: '#84CC16' },
  { name: 'Rose', value: '#F43F5E' },
];

interface ColorPaletteProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const ColorPalette: React.FC<ColorPaletteProps> = ({ 
  selectedColor, 
  onColorSelect, 
  disabled = false,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className="flex items-center space-x-2">
      <Palette className="w-4 h-4 text-gray-600" />
      <div className="flex flex-wrap gap-1">
        {colorPalette.map((color) => (
          <button
            key={color.value}
            onClick={() => onColorSelect(color.value)}
            disabled={disabled}
            className={`${sizeClasses[size]} rounded border-2 transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${
              selectedColor === color.value 
                ? 'border-gray-800 scale-110 shadow-md' 
                : 'border-gray-300 hover:border-gray-500'
            }`}
            style={{ backgroundColor: color.value }}
            title={color.name}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPalette;