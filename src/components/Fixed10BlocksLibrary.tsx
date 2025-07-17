import React from 'react';
import { FIXED_10_BLOCKS, FixedBlock } from '../data/fixedBlocks';

interface Fixed10BlocksLibraryProps {
  onBlockSelect: (block: FixedBlock) => void;
  disabled?: boolean;
}

const Fixed10BlocksLibrary: React.FC<Fixed10BlocksLibraryProps> = ({ 
  onBlockSelect, 
  disabled = false 
}) => {
  const renderBlockPreview = (block: FixedBlock) => {
    return (
      <svg 
        width={40} 
        height={40} 
        viewBox="0 0 100 100"
        className="w-10 h-10"
      >
        <path
          d={block.svgPath}
          fill={block.color}
          stroke="#1F2937"
          strokeWidth="2"
        />
      </svg>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
        Fixed 10 Blocks (All Levels)
      </h3>
      <div className="grid grid-cols-5 gap-3">
        {FIXED_10_BLOCKS.map((block) => (
          <button
            key={block.id}
            onClick={() => onBlockSelect(block)}
            disabled={disabled}
            className="flex flex-col items-center p-3 bg-gray-50 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            title={`Add ${block.name}`}
          >
            <div className="flex items-center justify-center h-12 mb-2">
              {renderBlockPreview(block)}
            </div>
            <span className="text-xs text-gray-600 group-hover:text-blue-600 text-center">
              {block.name}
            </span>
          </button>
        ))}
      </div>
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Fixed System:</strong> These 10 blocks are used across all 200 levels. 
          Drag them to match the target outline!
        </p>
      </div>
    </div>
  );
};

export default Fixed10BlocksLibrary;