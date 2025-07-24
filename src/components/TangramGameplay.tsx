import React, { useState, useRef, useCallback, useEffect } from 'react';
import { RotateCw, Trash2, CheckCircle, Timer, Star, XCircle, RefreshCw } from 'lucide-react';
import FixedTangramBlocksLibrary from './FixedTangramBlocksLibrary';
import { FIXED_TANGRAM_BLOCKS, FixedBlock } from '../data/fixedBlocks';

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

interface TangramGameplayProps {
  level: number;
  category: 'tangram' | 'funthinker-basic' | 'funthinker-medium' | 'funthinker-hard';
  onComplete: (attemptNumber: number, timeUsed: number, points: number) => void;
  onAttemptFailed: () => void;
  isPlaying: boolean;
  currentAttempt: number;
  timeLeft: number;
  onGameStart: () => void;
}

const CANVAS_SIZE = 600;
const BLOCK_SIZE = 400; // Block will be centered and sized to fit the outline

const TangramGameplay: React.FC<TangramGameplayProps> = ({ 
  level, 
  category,
  onComplete, 
  onAttemptFailed,
  isPlaying,
  currentAttempt,
  timeLeft}) => {
  const [placedBlocks, setPlacedBlocks] = useState<PlacedBlock[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0); // 0-360
  const [attempts, setAttempts] = useState(1);
  const [showAnswer, setShowAnswer] = useState(false);
  const [attemptHistory, setAttemptHistory] = useState<Array<{ number: number, correct: boolean, timeUsed: number, points: number }>>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [feedback, setFeedback] = useState<{ open: boolean, success: boolean, message: string }>({ open: false, success: false, message: '' });
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const [nextZIndex, setNextZIndex] = useState(1);

  // Timer effect: if time runs out, count as failed attempt
  useEffect(() => {
    if (timeLeft === 0 && isPlaying) {
      // If time runs out, we don't need to call onAttemptFailed here
      // as the checkSolution will handle the final attempt.
      // We can just set a feedback message.
      setFeedback({ open: true, success: false, message: 'Time is up!' });
    }
  }, [timeLeft, isPlaying]);

  // Helper: get image paths
  const getQuestionImageUrl = () => `/backend/outlines/tangram/questions/level-${level}.jpg`;
  const getAnswerImageUrl = () => `/backend/outlines/tangram/answers/answer-${level}.jpg`;

  // Drag/Drop/Rotate logic
  const handleMouseDown = useCallback((e: React.MouseEvent, blockId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedBlock(blockId);
    const block = FIXED_TANGRAM_BLOCKS.find(fb => fb.id === blockId);
    if (block && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      dragOffset.current = {
        x: e.clientX - rect.left - block.defaultSize / 2,
        y: e.clientY - rect.top - block.defaultSize / 2,
      };
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!placedBlocks.length) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const newPlacedBlocks = placedBlocks.map(block => {
    const newX = e.clientX - rect.left - dragOffset.current.x;
    const newY = e.clientY - rect.top - dragOffset.current.y;
      return {
        ...block,
        x: Math.max(0, Math.min(newX, rect.width - BLOCK_SIZE / 2)),
        y: Math.max(0, Math.min(newY, rect.height - BLOCK_SIZE / 2)),
      };
    });
    setPlacedBlocks(newPlacedBlocks);
  }, [placedBlocks]);

  const handleMouseUp = useCallback(() => {
    setSelectedBlock(null);
  }, []);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedBlock(null);
    }
  }, []);

  // Add block (only one at a time)
  const addBlock = (fixedBlock: FixedBlock) => {
    setPlacedBlocks(prev => [...prev, {
      id: `placed-${Date.now()}-${Math.random()}`,
      blockId: fixedBlock.id,
      x: (CANVAS_SIZE - BLOCK_SIZE) / 2,
      y: (CANVAS_SIZE - BLOCK_SIZE) / 2,
      rotation: 0,
      scale: 1,
      zIndex: 1,
      isMirrored: false,
    }]);
    setRotation(0);
    setSelectedBlock(null);
  };

  // Drag logic (centered block, so only allow moving within canvas)
  const handleBlockDrag = (e: React.MouseEvent) => {
    if (!isPlaying || !selectedBlock) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    setPlacedBlocks(prev => prev.map(block => 
      block.id === selectedBlock
        ? { ...block, x: Math.max(0, Math.min(offsetX - (block.x || 0), CANVAS_SIZE - ((FIXED_TANGRAM_BLOCKS.find(fb => fb.id === block.blockId)?.sizePercent || 0) / 100) * CANVAS_SIZE)), y: Math.max(0, Math.min(offsetY - (block.y || 0), CANVAS_SIZE - ((FIXED_TANGRAM_BLOCKS.find(fb => fb.id === block.blockId)?.sizePercent || 0) / 100) * CANVAS_SIZE)) }
        : block
    ));
  };

  // Rotation logic
  const handleRotationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const angle = parseInt(e.target.value, 10);
    setRotation(angle);
    setPlacedBlocks(prev => prev.map(block => ({
      ...block,
      rotation: angle,
    })));
  };

  // Remove block
  const clearBlock = () => {
    setPlacedBlocks(prev => prev.filter(block => block.id !== selectedBlock));
    setSelectedBlock(null);
    // If the block was the last one, reset the game
    if (placedBlocks.length === 1) {
      setShowAnswer(false);
      setRotation(0);
      setAttempts(1);
      setFeedback({ open: false, success: false, message: '' });
    }
  };

  // Reset level
  const resetLevel = () => {
    setPlacedBlocks([]);
    setSelectedBlock(null);
    setShowAnswer(false);
    setRotation(0);
    setAttempts(1);
    setFeedback({ open: false, success: false, message: '' });
  };

  const checkSolution = () => {
    if (!isPlaying || placedBlocks.length === 0) return;
    
    // Calculate points based on attempt number
    const points = currentAttempt === 1 ? 300 : currentAttempt === 2 ? 200 : 100;
    const timeUsed = 300 - timeLeft; // 5 minutes - remaining time
    
    onComplete(currentAttempt, timeUsed, points);
  };

  const renderBlock = (block: PlacedBlock) => {
    const fixedBlock = FIXED_TANGRAM_BLOCKS.find(fb => fb.id === block.blockId);
    if (!fixedBlock) return null;

    const baseStyle = {
      position: 'absolute' as const,
      left: block.x,
      top: block.y,
      transform: `rotate(${block.rotation}deg) scale(${block.scale}) ${block.isMirrored ? 'scaleX(-1)' : ''}`,
      cursor: isPlaying ? 'move' : 'default',
      transition: selectedBlock === block.id ? 'none' : 'all 0.2s ease',
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
          width={fixedBlock.defaultSize} 
          height={fixedBlock.defaultSize} 
          viewBox="0 0 100 100"
        >
          <path
            d={fixedBlock.svgPath}
            fill={fixedBlock.color}
            stroke={selectedBlock === block.id ? '#1F2937' : '#374151'}
            strokeWidth={selectedBlock === block.id ? 3 : 2}
            filter={selectedBlock === block.id ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'}
          />
        </svg>
      </div>
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTargetImageUrl = () => {
    try {
      // Load from uploaded PDF outlines
      const levels = JSON.parse(localStorage.getItem(`${category}-levels`) || '[]');
      const currentLevel = levels.find((l: any) => l.levelNumber === level);
      
      if (currentLevel && currentLevel.outlineUrl) {
        return currentLevel.outlineUrl;
      }
      
      // Fallback to placeholder
      return `https://via.placeholder.com/600x400/e5e7eb/6b7280?text=${category.toUpperCase()}+Level+${level}`;
    } catch (error) {
      console.error('Error loading level image:', error);
      return `https://via.placeholder.com/600x400/e5e7eb/6b7280?text=${category.toUpperCase()}+Level+${level}`;
    }
  };

  const getPointsForAttempt = (attempt: number) => {
    switch (attempt) {
      case 1: return 300;
      case 2: return 200;
      case 3: return 100;
      default: return 0;
    }
  };

  // 1. Three-column layout
  // 2. Large, centered canvas
  // 3. Compact block library with info at top
  // 4. Controls in right column
  // 5. Robust, game-like logic for all actions
  return (
    <div className="flex w-full h-[90vh]">
      {/* Left: Block Library */}
      <div className="w-1/5 min-w-[180px] bg-white border-r flex flex-col items-center py-6">
        <div className="mb-4 text-lg font-bold text-blue-700">Tangram Blocks</div>
        <FixedTangramBlocksLibrary onBlockSelect={addBlock} disabled={!!placedBlocks.length} />
      </div>
      {/* Center: Canvas */}
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 relative">
        <div
          className="relative w-[600px] h-[600px] bg-white border-2 border-gray-300 rounded-lg shadow-lg overflow-hidden"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                    linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
                  `,
            backgroundSize: '40px 40px',
          }}
        >
          {/* Background Question Image */}
          <img
            src={getQuestionImageUrl()}
            alt={`Level ${level} outline`}
            className="absolute inset-0 w-full h-full object-contain opacity-40 pointer-events-none"
            onError={e => (e.currentTarget.style.display = 'none')}
          />
          {/* Show answer overlay after 3 failed attempts */}
          {showAnswer && (
            <img
              src={getAnswerImageUrl()}
              alt={`Level ${level} answer`}
              className="absolute inset-0 w-full h-full object-contain opacity-80 pointer-events-none z-20"
              onError={e => (e.currentTarget.style.display = 'none')}
            />
          )}
          {/* Placed Blocks */}
          {placedBlocks.map(block => {
            const fixedBlock = FIXED_TANGRAM_BLOCKS.find(fb => fb.id === block.blockId);
            if (!fixedBlock) return null;
            const blockSize = (fixedBlock.sizePercent / 100) * CANVAS_SIZE;
            return (
              <div
                key={block.id}
                style={{
                  position: 'absolute',
                  left: block.x,
                  top: block.y,
                  width: blockSize,
                  height: blockSize,
                  cursor: isPlaying ? 'move' : 'not-allowed',
                  zIndex: 10,
                  transform: `rotate(${block.rotation || 0}deg)`
                }}
                title={fixedBlock.label}
                className={`transition-all duration-200 ${selectedBlock === block.id ? 'ring-4 ring-blue-400 shadow-xl' : 'hover:ring-2 hover:ring-blue-200'}`}
                onMouseDown={isPlaying ? (e) => handleMouseDown(e, block.id) : undefined}
                onClick={() => setSelectedBlock(block.id)}
              >
                <svg width={blockSize} height={blockSize} viewBox="0 0 100 100">
                  <path
                    d={fixedBlock.svgPath}
                    fill={fixedBlock.color}
                    stroke="#1F2937"
                    strokeWidth={3}
                    filter={'drop-shadow(0 4px 12px rgba(0,0,0,0.3))'}
                  />
                </svg>
                </div>
            );
          })}
          {/* Instructions Overlay */}
          {!placedBlocks.length && !showAnswer && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center text-gray-500 bg-white/80 rounded-lg p-6 shadow">
                <div className="text-lg font-semibold mb-2">Select and place a tangram block to match the outline</div>
                <div className="text-sm">Rotate and move the block to fit the background shape.</div>
                  </div>
                </div>
              )}
            </div>
        {/* Rotation Slider */}
        {isPlaying && selectedBlock && (
          <div className="flex flex-col items-center mt-4">
            <label className="text-sm font-medium text-gray-700 mb-1">Rotation</label>
            <input
              type="range"
              min={0}
              max={359}
              value={placedBlocks.find(b => b.id === selectedBlock)?.rotation || 0}
              onChange={e => {
                const angle = parseInt(e.target.value, 10);
                setPlacedBlocks(prev => prev.map(block =>
                  block.id === selectedBlock ? { ...block, rotation: angle } : block
                ));
              }}
              className="w-64"
            />
              </div>
            )}
      </div>
      {/* Right: Game Info and Controls */}
      <div className="w-1/5 min-w-[220px] bg-white border-l flex flex-col items-center py-6 gap-6">
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <Timer className="w-5 h-5 text-blue-600" />
            <span className="text-lg font-bold text-gray-700">{formatTime(timeLeft)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-orange-600" />
            <span className="text-md font-semibold text-gray-700">Attempt: {attempts}/3</span>
          </div>
          <div className="text-sm text-gray-600 font-semibold">Level {level}</div>
        </div>
        <div className="flex flex-col gap-3 w-full px-4">
          <button
            onClick={checkSolution}
            disabled={placedBlocks.length !== 7}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-semibold text-lg shadow transition-all duration-200 active:scale-95 ${placedBlocks.length !== 7 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <CheckCircle className="w-5 h-5" /> Finish
          </button>
          <button
            onClick={clearBlock}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium shadow transition-all duration-200 active:scale-95"
          >
            <Trash2 className="w-5 h-5" /> Remove Block
          </button>
          <button
            onClick={resetLevel}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-200 hover:bg-blue-300 text-blue-700 rounded-lg font-medium shadow transition-all duration-200 active:scale-95"
          >
            <RefreshCw className="w-5 h-5" /> Restart
          </button>
      </div>
        {/* Feedback always visible */}
        {feedback.open && (
          <div className={`mt-4 flex flex-col items-center gap-2 ${feedback.success ? 'text-green-700' : 'text-red-700'}`}> 
            {feedback.success ? <CheckCircle className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
            <div className="text-center font-semibold">{feedback.message}</div>
          </div>
        )}
      </div>
      {/* Summary Modal */}
      {showSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md flex flex-col items-center gap-4 border-2 border-blue-400">
            <div className="text-2xl font-bold mb-2">Level Summary</div>
            <table className="w-full text-sm mb-4">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-1">Attempt</th>
                  <th className="py-1">Result</th>
                  <th className="py-1">Time Used</th>
                  <th className="py-1">Points</th>
                </tr>
              </thead>
              <tbody>
                {attemptHistory.map(a => (
                  <tr key={a.number} className="border-b last:border-0">
                    <td className="py-1">{a.number}</td>
                    <td className="py-1">{a.correct ? 'Correct' : 'Incorrect'}</td>
                    <td className="py-1">{formatTime(a.timeUsed)}</td>
                    <td className="py-1">{a.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
              onClick={() => setShowSummary(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TangramGameplay;