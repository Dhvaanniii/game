import React, { useState, useRef, useCallback } from 'react';
import { RotateCw, Trash2, CheckCircle, Move, Layers, Eye, EyeOff, Target, Lightbulb } from 'lucide-react';
import ShapeLibrary from './ShapeLibrary';
import ColorPalette from './ColorPalette';
import { getTargetImageUrl } from '../utils/imageStorage';

interface Shape {
  id: string;
  type: 'triangle' | 'square' | 'circle' | 'hexagon' | 'diamond' | 'star' | 'heart';
  color: string;
  x: number;
  y: number;
  rotation: number;
  size: number;
  zIndex: number;
}

interface TanglePuzzleProps {
  level: number;
  onComplete: () => void;
  isPlaying: boolean;
}

const TanglePuzzle: React.FC<TanglePuzzleProps> = ({ level, onComplete, isPlaying }) => {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [draggedShape, setDraggedShape] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState('#3B82F6');
  const [showTarget, setShowTarget] = useState(true);
  const [targetOpacity, setTargetOpacity] = useState(0.5);
  const [showHint, setShowHint] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const [nextZIndex, setNextZIndex] = useState(1);

  const addShape = (type: Shape['type']) => {
    if (!isPlaying) return;
    
    const newShape: Shape = {
      id: `shape-${Date.now()}`,
      type,
      color: selectedColor,
      x: 50 + Math.random() * 100, // Start shapes in a smaller area
      y: 50 + Math.random() * 100,
      rotation: 0,
      size: 60,
      zIndex: nextZIndex,
    };
    setShapes(prev => [...prev, newShape]);
    setNextZIndex(prev => prev + 1);
  };

  const handleMouseDown = useCallback((e: React.MouseEvent, shapeId: string) => {
    if (!isPlaying) return;
    
    e.preventDefault();
    e.stopPropagation();
    setSelectedShape(shapeId);
    setDraggedShape(shapeId);
    
    const shape = shapes.find(s => s.id === shapeId);
    if (shape && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      dragOffset.current = {
        x: e.clientX - rect.left - shape.x,
        y: e.clientY - rect.top - shape.y,
      };
    }
  }, [shapes, isPlaying]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!draggedShape || !isPlaying || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const newX = e.clientX - rect.left - dragOffset.current.x;
    const newY = e.clientY - rect.top - dragOffset.current.y;
    
    setShapes(prev => prev.map(shape => 
      shape.id === draggedShape 
        ? { ...shape, x: Math.max(0, Math.min(newX, 540)), y: Math.max(0, Math.min(newY, 340)) }
        : shape
    ));
  }, [draggedShape, isPlaying]);

  const handleMouseUp = useCallback(() => {
    setDraggedShape(null);
  }, []);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedShape(null);
    }
  }, []);

  const rotateShape = (shapeId: string) => {
    if (!isPlaying) return;
    setShapes(prev => prev.map(shape => 
      shape.id === shapeId 
        ? { ...shape, rotation: (shape.rotation + 45) % 360 }
        : shape
    ));
  };

  const changeShapeColor = (shapeId: string, color: string) => {
    if (!isPlaying) return;
    setShapes(prev => prev.map(shape => 
      shape.id === shapeId 
        ? { ...shape, color }
        : shape
    ));
  };

  const changeShapeSize = (shapeId: string, delta: number) => {
    if (!isPlaying) return;
    setShapes(prev => prev.map(shape => 
      shape.id === shapeId 
        ? { ...shape, size: Math.max(20, Math.min(120, shape.size + delta)) }
        : shape
    ));
  };

  const bringToFront = (shapeId: string) => {
    if (!isPlaying) return;
    setShapes(prev => prev.map(shape => 
      shape.id === shapeId 
        ? { ...shape, zIndex: nextZIndex }
        : shape
    ));
    setNextZIndex(prev => prev + 1);
  };

  const sendToBack = (shapeId: string) => {
    if (!isPlaying) return;
    const minZ = Math.min(...shapes.map(s => s.zIndex));
    setShapes(prev => prev.map(shape => 
      shape.id === shapeId 
        ? { ...shape, zIndex: minZ - 1 }
        : shape
    ));
  };

  const deleteShape = (shapeId: string) => {
    if (!isPlaying) return;
    setShapes(prev => prev.filter(shape => shape.id !== shapeId));
    setSelectedShape(null);
  };

  const clearAll = () => {
    if (!isPlaying) return;
    setShapes([]);
    setSelectedShape(null);
  };

  const renderShape = (shape: Shape) => {
    const baseStyle = {
      position: 'absolute' as const,
      left: shape.x,
      top: shape.y,
      width: shape.size,
      height: shape.size,
      transform: `rotate(${shape.rotation}deg)`,
      cursor: isPlaying ? 'move' : 'default',
      transition: draggedShape === shape.id ? 'none' : 'all 0.2s ease',
      zIndex: selectedShape === shape.id ? 1000 : shape.zIndex,
    };

    const shapeStyle = {
      width: '100%',
      height: '100%',
      backgroundColor: shape.color,
      border: selectedShape === shape.id ? '3px solid #1F2937' : '2px solid rgba(0,0,0,0.1)',
      boxShadow: selectedShape === shape.id ? '0 4px 12px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.1)',
    };

    let shapeElement;
    switch (shape.type) {
      case 'circle':
        shapeElement = <div style={{ ...shapeStyle, borderRadius: '50%' }} />;
        break;
      case 'triangle':
        shapeElement = (
          <div style={{
            ...shapeStyle,
            backgroundColor: 'transparent',
            border: 'none',
            width: 0,
            height: 0,
            borderLeft: `${shape.size/2}px solid transparent`,
            borderRight: `${shape.size/2}px solid transparent`,
            borderBottom: `${shape.size}px solid ${shape.color}`,
            filter: selectedShape === shape.id ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
          }} />
        );
        break;
      case 'hexagon':
        shapeElement = (
          <div style={{
            ...shapeStyle,
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          }} />
        );
        break;
      case 'diamond':
        shapeElement = (
          <div style={{
            ...shapeStyle,
            transform: 'rotate(45deg)',
            borderRadius: '4px',
          }} />
        );
        break;
      case 'star':
        shapeElement = (
          <svg 
            width={shape.size} 
            height={shape.size} 
            viewBox="0 0 100 100"
            style={{
              filter: selectedShape === shape.id ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
            }}
          >
            <polygon 
              points="50,5 61,35 95,35 69,57 79,91 50,70 21,91 31,57 5,35 39,35"
              fill={shape.color}
              stroke={selectedShape === shape.id ? '#1F2937' : 'rgba(0,0,0,0.1)'}
              strokeWidth={selectedShape === shape.id ? 3 : 2}
            />
          </svg>
        );
        break;
      case 'heart':
        shapeElement = (
          <svg 
            width={shape.size} 
            height={shape.size} 
            viewBox="0 0 24 24"
            style={{
              filter: selectedShape === shape.id ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
            }}
          >
            <path 
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill={shape.color}
              stroke={selectedShape === shape.id ? '#1F2937' : 'rgba(0,0,0,0.1)'}
              strokeWidth={selectedShape === shape.id ? 1 : 0.5}
            />
          </svg>
        );
        break;
      default:
        shapeElement = <div style={{ ...shapeStyle, borderRadius: '4px' }} />;
    }

    return (
      <div
        key={shape.id}
        style={baseStyle}
        onMouseDown={(e) => handleMouseDown(e, shape.id)}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedShape(shape.id);
        }}
      >
        {shapeElement}
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Toolbar */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Shape Tools */}
          <div>
            <span className="text-sm font-medium text-gray-700">Add Shapes:</span>
            <div className="mt-2">
              <ShapeLibrary onShapeSelect={addShape} disabled={!isPlaying} />
            </div>
          </div>

          {/* Color Palette */}
          <div>
            <span className="text-sm font-medium text-gray-700">Colors:</span>
            <div className="mt-2">
              <ColorPalette 
                selectedColor={selectedColor}
                onColorSelect={setSelectedColor}
                disabled={!isPlaying}
              />
            </div>
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
          <div className="flex flex-wrap items-center gap-2 ml-auto">
            {selectedShape && (
              <>
                <button
                  onClick={() => rotateShape(selectedShape)}
                  disabled={!isPlaying}
                  className="flex items-center space-x-1 px-3 py-2 bg-yellow-100 hover:bg-yellow-200 rounded-lg transition-colors disabled:opacity-50"
                >
                  <RotateCw className="w-4 h-4" />
                  <span className="text-sm">Rotate</span>
                </button>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => changeShapeSize(selectedShape, -10)}
                    disabled={!isPlaying}
                    className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="text-xs text-gray-600">Size</span>
                  <button
                    onClick={() => changeShapeSize(selectedShape, 10)}
                    disabled={!isPlaying}
                    className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => bringToFront(selectedShape)}
                  disabled={!isPlaying}
                  className="flex items-center space-x-1 px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Layers className="w-4 h-4" />
                  <span className="text-sm">Front</span>
                </button>
                <button
                  onClick={() => sendToBack(selectedShape)}
                  disabled={!isPlaying}
                  className="flex items-center space-x-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Layers className="w-4 h-4" />
                  <span className="text-sm">Back</span>
                </button>
                <button
                  onClick={() => deleteShape(selectedShape)}
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
              onClick={onComplete}
              disabled={!isPlaying || shapes.length === 0}
              className="flex items-center space-x-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Complete</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex gap-4">
        {/* Target Image Panel */}
        <div className="w-1/3">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-800">Target Pattern</h3>
              <span className="text-sm text-gray-500">Level {level}</span>
            </div>
            <div className="relative bg-gray-50 rounded-lg overflow-hidden">
              <img
                src={getTargetImageUrl(level)}
                alt={`Target pattern for level ${level}`}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  // Fallback to a placeholder if image fails to load
                  e.currentTarget.src = `https://via.placeholder.com/300x200/e5e7eb/6b7280?text=Level+${level}`;
                }}
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
                  <strong>Hint:</strong> Try using different shapes and colors to recreate the pattern above. 
                  Use the opacity slider to see through the target image while you work.
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
                    src={getTargetImageUrl(level)}
                    alt="Target overlay"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `https://via.placeholder.com/600x400/e5e7eb/6b7280?text=Level+${level}`;
                    }}
                  />
                </div>
              )}

              {/* Working Area Instructions */}
              {shapes.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center text-gray-500">
                    <div className="text-lg font-medium mb-2">Working Canvas</div>
                    <div className="text-sm">Add shapes and drag them to match the target pattern</div>
                  </div>
                </div>
              )}

              {/* Shapes */}
              {shapes.map(renderShape)}
            </div>

            {/* Selected Shape Controls */}
            {selectedShape && (
              <div className="p-4 bg-gray-50 border-t">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="text-sm font-medium text-gray-700">Selected Shape:</span>
                    <ColorPalette 
                      selectedColor={shapes.find(s => s.id === selectedShape)?.color || selectedColor}
                      onColorSelect={(color) => changeShapeColor(selectedShape, color)}
                      disabled={!isPlaying}
                      size="sm"
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    <Move className="inline w-4 h-4 mr-1" />
                    Drag to move • Rotate • Resize • Layer • Change colors
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
              <li>• Look at the target pattern on the left</li>
              <li>• Add shapes using the shape library</li>
              <li>• Drag shapes to position them correctly</li>
              <li>• Use rotation and sizing tools to match exactly</li>
            </ul>
          </div>
          <div>
            <ul className="space-y-1">
              <li>• Toggle target overlay to see through it</li>
              <li>• Adjust opacity to work more easily</li>
              <li>• Use layers to control which shapes are on top</li>
              <li>• Click "Complete" when your pattern matches!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TanglePuzzle;