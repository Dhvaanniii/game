import React from 'react';
import { GameBlock } from '../types/game';

interface GameBlockRendererProps {
  block: GameBlock;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  isMirrored: boolean;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onClick: (e: React.MouseEvent) => void;
}

const GameBlockRenderer: React.FC<GameBlockRendererProps> = ({
  block,
  x,
  y,
  rotation,
  scale,
  isMirrored,
  isSelected,
  onMouseDown,
  onClick
}) => {
  const baseStyle = {
    position: 'absolute' as const,
    left: x,
    top: y,
    transform: `rotate(${rotation}deg) scale(${scale}) ${isMirrored ? 'scaleX(-1)' : ''}`,
    cursor: 'move',
    transition: 'all 0.2s ease',
    zIndex: isSelected ? 1000 : 1,
  };

  return (
    <div
      style={baseStyle}
      onMouseDown={onMouseDown}
      onClick={onClick}
    >
      <svg 
        width={block.defaultSize} 
        height={block.defaultSize} 
        viewBox="0 0 100 100"
      >
        <path
          d={block.svgPath}
          fill="#3B82F6"
          stroke={isSelected ? '#1F2937' : '#1E40AF'}
          strokeWidth={isSelected ? 3 : 2}
          filter={isSelected ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'}
        />
      </svg>
    </div>
  );
};

export default GameBlockRenderer;