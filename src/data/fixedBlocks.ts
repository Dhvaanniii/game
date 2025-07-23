// Fixed 10 blocks for all puzzle levels
export interface FixedBlock {
  id: string;
  name: string;
  type: 'triangle' | 'square' | 'parallelogram';
  size: 'small' | 'medium' | 'large';
  svgPath: string;
  defaultSize: number;
  canMirror: boolean;
  color: string;
}

export const FIXED_TANGRAM_BLOCKS: FixedBlock[] = [
  {
    id: 'large-triangle-1',
    name: 'Large Triangle 1',
    type: 'triangle',
    size: 'large',
    svgPath: 'M 0 0 L 100 0 L 50 50 Z',
    defaultSize: 100,
    canMirror: false,
    color: '#F87171', // Red
  },
  {
    id: 'large-triangle-2',
    name: 'Large Triangle 2',
    type: 'triangle',
    size: 'large',
    svgPath: 'M 0 100 L 100 100 L 50 50 Z',
    defaultSize: 100,
    canMirror: false,
    color: '#60A5FA', // Blue
  },
  {
    id: 'medium-triangle',
    name: 'Medium Triangle',
    type: 'triangle',
    size: 'medium',
    svgPath: 'M 0 0 L 50 50 L 100 0 Z',
    defaultSize: 70,
    canMirror: false,
    color: '#34D399', // Green
  },
  {
    id: 'small-triangle-1',
    name: 'Small Triangle 1',
    type: 'triangle',
    size: 'small',
    svgPath: 'M 0 0 L 50 50 L 0 100 Z',
    defaultSize: 50,
    canMirror: false,
    color: '#FBBF24', // Yellow
  },
  {
    id: 'small-triangle-2',
    name: 'Small Triangle 2',
    type: 'triangle',
    size: 'small',
    svgPath: 'M 100 0 L 100 100 L 50 50 Z',
    defaultSize: 50,
    canMirror: false,
    color: '#A78BFA', // Purple
  },
  {
    id: 'square',
    name: 'Square',
    type: 'square',
    size: 'small',
    svgPath: 'M 0 0 L 50 0 L 50 50 L 0 50 Z',
    defaultSize: 50,
    canMirror: false,
    color: '#F472B6', // Pink
  },
  {
    id: 'parallelogram',
    name: 'Parallelogram',
    type: 'parallelogram',
    size: 'small',
    svgPath: 'M 0 0 L 60 0 L 50 50 L -10 50 Z',
    defaultSize: 60,
    canMirror: true,
    color: '#38BDF8', // Cyan
  },
];