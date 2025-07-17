import React from 'react';

export interface ShapeTemplate {
  id: string;
  name: string;
  type: 'triangle' | 'square' | 'circle' | 'hexagon' | 'diamond' | 'star' | 'heart';
  defaultColor: string;
  points?: string; // For complex SVG shapes
}

export const shapeLibrary: ShapeTemplate[] = [
  {
    id: 'triangle',
    name: 'Triangle',
    type: 'triangle',
    defaultColor: '#3B82F6',
  },
  {
    id: 'square',
    name: 'Square',
    type: 'square',
    defaultColor: '#EF4444',
  },
  {
    id: 'circle',
    name: 'Circle',
    type: 'circle',
    defaultColor: '#10B981',
  },
  {
    id: 'hexagon',
    name: 'Hexagon',
    type: 'hexagon',
    defaultColor: '#F59E0B',
  },
  {
    id: 'diamond',
    name: 'Diamond',
    type: 'diamond',
    defaultColor: '#8B5CF6',
  },
  {
    id: 'star',
    name: 'Star',
    type: 'star',
    defaultColor: '#F97316',
    points: '50,5 61,35 95,35 69,57 79,91 50,70 21,91 31,57 5,35 39,35',
  },
  {
    id: 'heart',
    name: 'Heart',
    type: 'heart',
    defaultColor: '#EC4899',
  },
];

interface ShapeLibraryProps {
  onShapeSelect: (shapeType: ShapeTemplate['type']) => void;
  disabled?: boolean;
}

const ShapeLibrary: React.FC<ShapeLibraryProps> = ({ onShapeSelect, disabled = false }) => {
  const renderShapePreview = (shape: ShapeTemplate) => {
    const commonProps = {
      className: "w-6 h-6",
      style: { color: shape.defaultColor },
    };

    switch (shape.type) {
      case 'circle':
        return <div className="w-6 h-6 rounded-full" style={{ backgroundColor: shape.defaultColor }} />;
      case 'square':
        return <div className="w-6 h-6" style={{ backgroundColor: shape.defaultColor }} />;
      case 'triangle':
        return (
          <div 
            className="w-0 h-0"
            style={{
              borderLeft: '12px solid transparent',
              borderRight: '12px solid transparent',
              borderBottom: `20px solid ${shape.defaultColor}`,
            }}
          />
        );
      case 'hexagon':
        return (
          <div 
            className="w-6 h-6"
            style={{
              backgroundColor: shape.defaultColor,
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            }}
          />
        );
      case 'diamond':
        return (
          <div 
            className="w-5 h-5 transform rotate-45"
            style={{ backgroundColor: shape.defaultColor }}
          />
        );
      case 'star':
        return (
          <svg className="w-6 h-6" viewBox="0 0 100 100">
            <polygon 
              points={shape.points}
              fill={shape.defaultColor}
            />
          </svg>
        );
      case 'heart':
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill={shape.defaultColor}>
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        );
      default:
        return <div className="w-6 h-6 bg-gray-400" />;
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {shapeLibrary.map((shape) => (
        <button
          key={shape.id}
          onClick={() => onShapeSelect(shape.type)}
          disabled={disabled}
          className="flex flex-col items-center p-3 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          title={`Add ${shape.name}`}
        >
          <div className="flex items-center justify-center h-8 mb-1">
            {renderShapePreview(shape)}
          </div>
          <span className="text-xs text-gray-600 group-hover:text-blue-600">
            {shape.name}
          </span>
        </button>
      ))}
    </div>
  );
};

export default ShapeLibrary;