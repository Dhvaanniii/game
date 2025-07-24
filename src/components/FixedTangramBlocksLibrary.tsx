import React from 'react';
import { FIXED_TANGRAM_BLOCKS, FixedBlock } from '../data/fixedBlocks';

interface FixedTangramBlocksLibraryProps {
  onBlockSelect: (block: FixedBlock) => void;
  disabled?: boolean;
}

const FixedTangramBlocksLibrary: React.FC<FixedTangramBlocksLibraryProps> = ({ 
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
        Tangram Blocks (7 pieces)
      </h3>
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Classic Tangram:</strong> Use these 7 blocks to solve any outline. Drag them to match the target outline!
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 w-full">
        {FIXED_TANGRAM_BLOCKS.map((block) => (
          <button
            key={block.id}
            onClick={() => onBlockSelect(block)}
            disabled={disabled}
            className="flex flex-col items-center p-3 bg-gray-50 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group w-full"
            title={`Add ${block.name}`}
          >
            <div className="flex items-center justify-center h-12 mb-2">
              {renderBlockPreview(block)}
            </div>
            <span className="text-xs text-gray-600 group-hover:text-blue-600 text-center mt-1 whitespace-normal break-words min-h-[2.2rem]">{block.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FixedTangramBlocksLibrary;