export type ColorCode = 'W' | 'G' | 'R' | 'B' | 'O' | 'Y' | null;

export type FaceName = 'U' | 'L' | 'F' | 'R' | 'B' | 'D';

// A face is a 1D array of 9 colors (0-8)
// 0 1 2
// 3 4 5
// 6 7 8
export type FaceGrid = ColorCode[];

export interface CubeState {
  U: FaceGrid;
  L: FaceGrid;
  F: FaceGrid;
  R: FaceGrid;
  B: FaceGrid;
  D: FaceGrid;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface SolverResponse {
  solution: string;
  moves: string[];
  length: number;
  time_ms: number;
}

export interface Move {
  face: FaceName;
  direction: 'CW' | 'CCW' | 'DOUBLE'; // Clockwise, Counter-Clockwise, 180
  notation: string;
}