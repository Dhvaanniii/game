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

export const FIXED_10_BLOCKS: FixedBlock[] = [
  {
    id: 'small-triangle-1',
    name: 'Small Triangle 1',
    type: 'triangle',
    size: 'small',
    svgPath: 'M 50 10 L 90 90 L 10 90 Z',
    defaultSize: 60,
    canMirror: true,
    color: '#3B82F6'
  },
  {
    id: 'small-triangle-2',
    name: 'Small Triangle 2',
    type: 'triangle',
    size: 'small',
    svgPath: 'M 50 90 L 10 10 L 90 10 Z',
    defaultSize: 60,
    canMirror: true,
    color: '#EF4444'
  },
  {
    id: 'medium-triangle-1',
    name: 'Medium Triangle 1',
    type: 'triangle',
    size: 'medium',
    svgPath: 'M 50 5 L 95 95 L 5 95 Z',
    defaultSize: 80,
    canMirror: true,
    color: '#10B981'
  },
  {
    id: 'medium-triangle-2',
    name: 'Medium Triangle 2',
    type: 'triangle',
    size: 'medium',
    svgPath: 'M 50 95 L 5 5 L 95 5 Z',
    defaultSize: 80,
    canMirror: true,
    color: '#F59E0B'
  },
  {
    id: 'large-triangle',
    name: 'Large Triangle',
    type: 'triangle',
    size: 'large',
    svgPath: 'M 50 2 L 98 98 L 2 98 Z',
    defaultSize: 100,
    canMirror: false,
    color: '#8B5CF6'
  },
  {
    id: 'small-square',
    name: 'Small Square',
    type: 'square',
    size: 'small',
    svgPath: 'M 20 20 L 80 20 L 80 80 L 20 80 Z',
    defaultSize: 60,
    canMirror: false,
    color: '#F97316'
  },
  {
    id: 'medium-square',
    name: 'Medium Square',
    type: 'square',
    size: 'medium',
    svgPath: 'M 10 10 L 90 10 L 90 90 L 10 90 Z',
    defaultSize: 80,
    canMirror: false,
    color: '#EC4899'
  },
  {
    id: 'parallelogram-1',
    name: 'Parallelogram 1',
    type: 'parallelogram',
    size: 'medium',
    svgPath: 'M 20 10 L 80 10 L 90 90 L 30 90 Z',
    defaultSize: 75,
    canMirror: true,
    color: '#06B6D4'
  },
  {
    id: 'parallelogram-2',
    name: 'Parallelogram 2',
    type: 'parallelogram',
    size: 'medium',
    svgPath: 'M 80 10 L 20 10 L 10 90 L 70 90 Z',
    defaultSize: 75,
    canMirror: true,
    color: '#84CC16'
  },
  {
    id: 'diamond',
    name: 'Diamond',
    type: 'parallelogram',
    size: 'small',
    svgPath: 'M 50 10 L 80 50 L 50 90 L 20 50 Z',
    defaultSize: 65,
    canMirror: false,
    color: '#F43F5E'
  }
];