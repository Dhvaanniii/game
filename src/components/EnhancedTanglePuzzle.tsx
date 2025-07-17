import React, { useState, useRef, useCallback, useEffect } from 'react';
import { RotateCw, Trash2, CheckCircle, Move, Layers, Eye, EyeOff, Target, Lightbulb, Timer, Zap } from 'lucide-react';
import FixedBlockLibrary from './FixedBlockLibrary';
import { FIXED_GAME_BLOCKS } from '../data/gameBlocks';
import { GameBlock } from '../types/game';

interface PlacedBlock {
  id: string;
  blockId: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  zIndex: number;
  isMirrored: boolean;
}

interface EnhancedTanglePuzzleProps {
  level: number;
  category: 'tangle' | 'funthinker-basic' | 'funthinker-medium' | 'funthinker-hard';
  onComplete: (attemptNumber: number, timeUsed: number) => void;
  onAttemptFailed: () => void;
  isPlaying: boolean;
  currentAttempt: number;
  timeLeft: number;
}

const EnhancedTanglePuzzle: React.FC<EnhancedTanglePuzzleProps> = ({ 
  level, 
  category,
  onComplete, 
  onAttemptFailed,
  isPlaying,
  currentAttempt,
  timeLeft
}) => {
  const [placedBlocks, setPlacedBlocks] = useState<PlacedBlock[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [draggedBlock, setDraggedBlock] = useState<string | null>(null);
  const [showTarget, setShowTarget] = useState(true);
  const [targetOpacity, setTargetOpacity] = useState(0.5);
  const [showHint, setShowHint] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const [nextZIndex, setNextZIndex] = useState(1);

  // Timer effect
  useEffect(() => {
    if (timeLeft === 0 && isPlaying) {
      onAttemptFailed();
    }
  }, [timeLeft, isPlaying, onAttemptFailed]);

  const addBlock = (gameBlock: GameBlock) => {
    if (!isPlaying) return;
    
    const newBlock: PlacedBlock = {
      id: `placed-${Date.now()}`,
      blockId: gameBlock.id,
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 150,
      rotation: 0,
      scale: 1,
      zIndex: nextZIndex,
      isMirrored: false,
    };
    
    setPlacedBlocks(prev => [...prev, newBlock]);
    setNextZIndex(prev => prev + 1);
  };

  const handleMouseDown = useCallback((e: React.MouseEvent, blockId: string) => {
    if (!isPlaying) return;
    
    e.preventDefault();
    e.stopPropagation();
    setSelectedBlock(blockId);
    setDraggedBlock(blockId);
    
    const block = placedBlocks.find(b => b.id === blockId);
    if (block && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      dragOffset.current = {
        x: e.clientX - rect.left - block.x,
        y: e.clientY - rect.top - block.y,
      };
    }
  }, [placedBlocks, isPlaying]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!draggedBlock || !isPlaying || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const newX = e.clientX - rect.left - dragOffset.current.x;
    const newY = e.clientY - rect.top - dragOffset.current.y;
    
    setPlacedBlocks(prev => prev.map(block => 
      block.id === draggedBlock 
        ? { ...block, x: Math.max(0, Math.min(newX, 540)), y: Math.max(0, Math.min(newY, 340)) }
        : block
    ));
  }, [draggedBlock, isPlaying]);

  const handleMouseUp = useCallback(() => {
    setDraggedBlock(null);
  }, []);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedBlock(null);
    }
  }, []);

  const rotateBlock = (blockId: string) => {
    if (!isPlaying) return;
    setPlacedBlocks(prev => prev.map(block => 
      block.id === blockId 
        ? { ...block, rotation: (block.rotation + 45) % 360 }
        : block
    ));
  };

  const scaleBlock = (blockId: string, delta: number) => {
    if (!isPlaying) return;
    setPlacedBlocks(prev => prev.map(block => 
      block.id === blockId 
        ? { ...block, scale: Math.max(0.5, Math.min(2, block.scale + delta)) }
        : block
    ));
  };

  const mirrorBlock = (blockId: string) => {
    if (!isPlaying) return;
    setPlacedBlocks(prev => prev.map(block => 
      block.id === blockId 
        ? { ...block, isMirrored: !block.isMirrored }
        : block
    ));
  };

  const bringToFront = (blockId: string) => {
    if (!isPlaying) return;
    setPlacedBlocks(prev => prev.map(block => 
      block.id === blockId 
        ? { ...block, zIndex: nextZIndex }
        : block
    ));
    setNextZIndex(prev => prev + 1);
  };

  const sendToBack = (blockId: string) => {
    if (!isPlaying) return;
    const minZ = Math.min(...placedBlocks.map(b => b.zIndex));
    setPlacedBlocks(prev => prev.map(block => 
      block.id === blockId 
        ? { ...block, zIndex: minZ - 1 }
        : block
    ));
  };

  const deleteBlock = (blockId: string) => {
    if (!isPlaying) return;
    setPlacedBlocks(prev => prev.filter(block => block.id !== blockId));
    setSelectedBlock(null);
  };

  const clearAll = () => {
    if (!isPlaying) return;
    setPlacedBlocks([]);
    setSelectedBlock(null);
  };

  const checkSolution = () => {
    if (!isPlaying || placedBlocks.length === 0) return;
    
    // Simple solution check - in real implementation, check if blocks match outline
    const timeUsed = 60 - timeLeft;
    onComplete(currentAttempt, timeUsed);
  };

  const renderBlock = (block: PlacedBlock) => {
    const gameBlock = FIXED_GAME_BLOCKS.find(gb => gb.id === block.blockId);
    if (!gameBlock) return null;

    const baseStyle = {
      position: 'absolute' as const,
      left: block.x,
      top: block.y,
      transform: `rotate(${block.rotation}deg) scale(${block.scale}) ${block.isMirrored ? 'scaleX(-1)' : ''}`,
      cursor: isPlaying ? 'move' : 'default',
      transition: draggedBlock === block.id ? 'none' : 'all 0.2s ease',
      zIndex: selectedBlock === block.id ? 1000 : block.zIndex,
    };

    return (
      <div
        key={block.id}
        style={baseStyle}
        onMouseDown={(e) => handleMouseDown(e, block.id)}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedBlock(block.id);
        }}
      >
        <svg 
          width={gameBlock.defaultSize} 
          height={gameBlock.defaultSize} 
          viewBox="0 0 100 100"
        >
          <path
            d={gameBlock.svgPath}
            fill="#3B82F6"
            stroke={selectedBlock === block.id ? '#1F2937' : '#1E40AF'}
            strokeWidth={selectedBlock === block.id ? 3 : 2}
            filter={selectedBlock === block.id ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'}
          />
        </svg>
      </div>
    );
  };

  const formatTime = (seconds: number) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  const getTargetImageUrl = () => {
    // In real implementation, load from uploaded PDF outlines
    return `https://via.placeholder.com/600x400/e5e7eb/6b7280?text=${category.toUpperCase()}+Level+${level}`;
  };

  const getPointsForAttempt = (attempt: number) => {
    switch (attempt) {
      case 1: return 300;
      case 2: return 200;
      case 3: return 100;
      default: return 0;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Game Status Bar */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Timer className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Time:</span>
              <span className={`font-mono font-bold text-lg ${timeLeft < 20 ? 'text-red-600' : 'text-gray-800'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium text-gray-700">Attempt:</span>
              <span className="font-bold text-gray-800">{currentAttempt}/3</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Points:</span>
              <span className="font-bold text-green-600">{getPointsForAttempt(currentAttempt)}</span>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            {category.replace('-', ' ').toUpperCase()} - Level {level}
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Fixed Block Library */}
          <div className="flex-1">
            <FixedBlockLibrary onBlockSelect={addBlock} disabled={!isPlaying} />
          </div>

          {/* View Controls */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowTarget(!showTarget)}
                className="flex items-center space-x-1 px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
              >
                {showTarget ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                <span className="text-sm">Target</span>
              </button>
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center space-x-1 px-3 py-2 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors"
              >
                <Lightbulb className="w-4 h-4" />
                <span className="text-sm">Hint</span>
              </button>
            </div>
            {showTarget && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">Opacity:</span>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={targetOpacity}
                  onChange={(e) => setTargetOpacity(parseFloat(e.target.value))}
                  className="w-16"
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {selectedBlock && (
              <>
                <button
                  onClick={() => rotateBlock(selectedBlock)}
                  disabled={!isPlaying}
                  className="flex items-center space-x-1 px-3 py-2 bg-yellow-100 hover:bg-yellow-200 rounded-lg transition-colors disabled:opacity-50"
                >
                  <RotateCw className="w-4 h-4" />
                  <span className="text-sm">Rotate</span>
                </button>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => scaleBlock(selectedBlock, -0.1)}
                    disabled={!isPlaying}
                    className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="text-xs text-gray-600">Size</span>
                  <button
                    onClick={() => scaleBlock(selectedBlock, 0.1)}
                    disabled={!isPlaying}
                    className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => mirrorBlock(selectedBlock)}
                  disabled={!isPlaying}
                  className="px-3 py-2 bg-indigo-100 hover:bg-indigo-200 rounded-lg transition-colors disabled:opacity-50 text-sm"
                >
                  Mirror
                </button>
                <button
                  onClick={() => bringToFront(selectedBlock)}
                  disabled={!isPlaying}
                  className="flex items-center space-x-1 px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Layers className="w-4 h-4" />
                  <span className="text-sm">Front</span>
                </button>
                <button
                  onClick={() => sendToBack(selectedBlock)}
                  disabled={!isPlaying}
                  className="flex items-center space-x-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Layers className="w-4 h-4" />
                  <span className="text-sm">Back</span>
                </button>
                <button
                  onClick={() => deleteBlock(selectedBlock)}
                  disabled={!isPlaying}
                  className="flex items-center space-x-1 px-3 py-2 bg-red-100 hover:bg-red-200 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-sm">Delete</span>
                </button>
              </>
            )}
            <button
              onClick={clearAll}
              disabled={!isPlaying}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 text-sm"
            >
              Clear All
            </button>
            <button
              onClick={checkSolution}
              disabled={!isPlaying || placedBlocks.length === 0}
              className="flex items-center space-x-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Check Solution</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex gap-4">
        {/* Target Image Panel */}
        <div className="w-1/3">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-800">Target Pattern</h3>
            </div>
            <div className="relative bg-gray-50 rounded-lg overflow-hidden">
              <img
                src={getTargetImageUrl()}
                alt={`Target pattern for ${category} level ${level}`}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-blue-500 bg-opacity-10 flex items-center justify-center">
                <div className="text-center text-blue-800">
                  <div className="text-sm font-medium">Match this pattern!</div>
                </div>
              </div>
            </div>
            {showHint && (
              <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                <div className="text-sm text-yellow-800">
                  <strong>Hint:</strong> Use the 10 fixed blocks to recreate this pattern. 
                  You can rotate, scale, and mirror blocks as needed.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Working Canvas */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div
              ref={canvasRef}
              className="relative w-full h-96 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onClick={handleCanvasClick}
            >
              {/* Grid Pattern */}
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                    linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px'
                }}
              />
              
              {/* Target Image Overlay */}
              {showTarget && (
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{ opacity: targetOpacity }}
                >
                  <img
                    src={getTargetImageUrl()}
                    alt="Target overlay"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Working Area Instructions */}
              {placedBlocks.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center text-gray-500">
                    <div className="text-lg font-medium mb-2">Working Canvas</div>
                    <div className="text-sm">Use the fixed blocks to match the target pattern</div>
                  </div>
                </div>
              )}

              {/* Placed Blocks */}
              {placedBlocks.map(renderBlock)}
            </div>

            {/* Selected Block Info */}
            {selectedBlock && (
              <div className="p-4 bg-gray-50 border-t">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    <strong>Selected:</strong> {FIXED_GAME_BLOCKS.find(gb => gb.id === placedBlocks.find(pb => pb.id === selectedBlock)?.blockId)?.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    <Move className="inline w-4 h-4 mr-1" />
                    Drag • Rotate • Scale • Mirror • Layer
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">How to Play:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <ul className="space-y-1">
              <li>• Use the 10 fixed blocks to match the target pattern</li>
              <li>• Drag blocks from the library to the canvas</li>
              <li>• Select blocks to rotate, scale, or mirror them</li>
              <li>• You have 1 minute per attempt</li>
            </ul>
          </div>
          <div>
            <ul className="space-y-1">
              <li>• 1st attempt: 300 points</li>
              <li>• 2nd attempt: 200 points</li>
              <li>• 3rd attempt: 100 points</li>
              <li>• After 3 attempts, the system solves automatically</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedTanglePuzzle;