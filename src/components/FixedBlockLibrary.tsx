import React from 'react';
import { FIXED_GAME_BLOCKS } from '../data/gameBlocks';
import { GameBlock } from '../types/game';

interface FixedBlockLibraryProps {
  onBlockSelect: (block: GameBlock) => void;
  disabled?: boolean;
}

const FixedBlockLibrary: React.FC<FixedBlockLibraryProps> = ({ onBlockSelect, disabled = false }) => {
  const renderBlockPreview = (block: GameBlock) => {
    return (
      <svg 
        width={40} 
        height={40} 
        viewBox="0 0 100 100"
        className="w-10 h-10"
      >
        <path
          d={block.svgPath}
          fill="#3B82F6"
          stroke="#1E40AF"
          strokeWidth="2"
        />
      </svg>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Fixed Game Blocks</h3>
      <div className="grid grid-cols-5 gap-3">
        {FIXED_GAME_BLOCKS.map((block) => (
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
          <strong>Fixed Blocks:</strong> These 10 blocks are used across all puzzle levels. 
          Drag them to match the target outline!
        </p>
      </div>
    </div>
  );
};

export default FixedBlockLibrary;