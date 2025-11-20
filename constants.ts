import { CubeState, FaceName, ColorCode } from './types';

export const COLORS: Record<string, string> = {
  W: '#ffffff', // White
  G: '#22c55e', // Green (Tailwind green-500)
  R: '#ef4444', // Red (Tailwind red-500)
  B: '#3b82f6', // Blue (Tailwind blue-500)
  O: '#f97316', // Orange (Tailwind orange-500)
  Y: '#eab308', // Yellow (Tailwind yellow-500)
  null: '#334155', // Empty/Slate-700
};

export const COLOR_NAMES: Record<string, string> = {
  W: 'White',
  G: 'Green',
  R: 'Red',
  B: 'Blue',
  O: 'Orange',
  Y: 'Yellow',
};

export const FACE_ORDER: FaceName[] = ['U', 'L', 'F', 'R', 'B', 'D'];

// Standard Western Color Scheme: White Top, Green Front
export const INITIAL_SOLVED_STATE: CubeState = {
  U: Array(9).fill('W'),
  L: Array(9).fill('O'),
  F: Array(9).fill('G'),
  R: Array(9).fill('R'),
  B: Array(9).fill('B'),
  D: Array(9).fill('Y'),
};

export const EMPTY_STATE: CubeState = {
  U: Array(9).fill(null),
  L: Array(9).fill(null),
  F: Array(9).fill(null),
  R: Array(9).fill(null),
  B: Array(9).fill(null),
  D: Array(9).fill(null),
};
