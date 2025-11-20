import { CubeState, FaceName, ValidationResult, ColorCode } from '../types';
import { INITIAL_SOLVED_STATE } from '../constants';

// Helper to copy state deeply
export const cloneState = (state: CubeState): CubeState => {
  return JSON.parse(JSON.stringify(state));
};

// Count colors in the state
export const getCubeColorCounts = (state: CubeState): Record<string, number> => {
  const counts: Record<string, number> = { W: 0, G: 0, R: 0, B: 0, O: 0, Y: 0 };
  Object.values(state).forEach((face) => {
    face.forEach((color) => {
      if (color && counts[color] !== undefined) counts[color]++;
    });
  });
  return counts;
};

// Validate the cube state
export const validateCube = (state: CubeState): ValidationResult => {
  const counts = getCubeColorCounts(state);
  let hasNull = false;

  Object.values(state).forEach((face) => {
    face.forEach((color) => {
      if (color === null) hasNull = true;
    });
  });

  const errors: string[] = [];
  if (hasNull) {
    errors.push("All stickers must be colored.");
  }

  Object.entries(counts).forEach(([color, count]) => {
    if (count !== 9) {
      errors.push(`Incorrect count for ${color}: found ${count}, expected 9.`);
    }
  });

  // Simple center check (assuming standard orientation)
  // U:W, L:O, F:G, R:R, B:B, D:Y
  if (state.U[4] !== 'W') errors.push("Center of Up face must be White.");
  if (state.F[4] !== 'G') errors.push("Center of Front face must be Green.");
  if (state.D[4] !== 'Y') errors.push("Center of Down face must be Yellow.");

  return { valid: errors.length === 0, errors };
};

// Rotate a face array 90 degrees clockwise
const rotateFaceArrayCW = (face: ColorCode[]): ColorCode[] => {
  // 0 1 2      6 3 0
  // 3 4 5  ->  7 4 1
  // 6 7 8      8 5 2
  return [
    face[6], face[3], face[0],
    face[7], face[4], face[1],
    face[8], face[5], face[2]
  ];
};

const rotateFaceArrayCCW = (face: ColorCode[]): ColorCode[] => {
  // 0 1 2      2 5 8
  // 3 4 5  ->  1 4 7
  // 6 7 8      0 3 6
  return [
    face[2], face[5], face[8],
    face[1], face[4], face[7],
    face[0], face[3], face[6]
  ];
};

const rotateFaceArray180 = (face: ColorCode[]): ColorCode[] => {
  return [...face].reverse();
};

// Apply a single move to the state
export const applyMove = (state: CubeState, moveStr: string): CubeState => {
  const nextState = cloneState(state);
  const face = moveStr[0] as FaceName;
  const modifier = moveStr.length > 1 ? moveStr[1] : '';

  // 1. Rotate the face itself
  if (modifier === "'") { // CCW
    nextState[face] = rotateFaceArrayCCW(nextState[face]);
  } else if (modifier === '2') { // 180
    nextState[face] = rotateFaceArray180(nextState[face]);
  } else { // CW
    nextState[face] = rotateFaceArrayCW(nextState[face]);
  }

  // 2. Rotate adjacent sides (Cyclic permutation)
  // This requires mapping indices.
  const cycles: Record<FaceName, { faces: FaceName[], indices: number[][] }> = {
    U: {
      faces: ['F', 'L', 'B', 'R'],
      indices: [[0, 1, 2], [0, 1, 2], [0, 1, 2], [0, 1, 2]]
    },
    D: {
      faces: ['F', 'R', 'B', 'L'],
      indices: [[6, 7, 8], [6, 7, 8], [6, 7, 8], [6, 7, 8]]
    },
    F: {
      faces: ['U', 'R', 'D', 'L'],
      indices: [[6, 7, 8], [0, 3, 6], [2, 1, 0], [8, 5, 2]] // Logic: U bottom -> R left -> D top (rev) -> L right (rev)
    },
    B: {
      faces: ['U', 'L', 'D', 'R'],
      indices: [[2, 1, 0], [0, 3, 6], [6, 7, 8], [8, 5, 2]]
    },
    L: {
      faces: ['U', 'F', 'D', 'B'],
      indices: [[0, 3, 6], [0, 3, 6], [0, 3, 6], [8, 5, 2]] // B is inverted relative to L ring
    },
    R: {
      faces: ['U', 'B', 'D', 'F'],
      indices: [[8, 5, 2], [0, 3, 6], [8, 5, 2], [8, 5, 2]]
    }
  };

  const cycle = cycles[face];
  const { faces, indices } = cycle;

  // Get current strips
  const strips = faces.map((f, i) => {
    return indices[i].map(idx => state[f][idx]);
  });

  // Shift strips
  let newStrips: ColorCode[][] = [];
  if (modifier === "'") {
    // CCW: Shift backward (0<-1<-2<-3<-0)
    newStrips = [strips[1], strips[2], strips[3], strips[0]];
  } else if (modifier === '2') {
     // 180: Swap opposites
     newStrips = [strips[2], strips[3], strips[0], strips[1]];
  } else {
    // CW: Shift forward (0->1->2->3->0 is standard for "moving pieces", 
    // but usually we describe face cycles as F->L->B->R for U. 
    // Actually, visualizing U turn CW: Front Top moves to Left Top.
    // So F -> L -> B -> R -> F.
    // Wait, U move: F row moves to L row?
    // If I turn U Clockwise, the stickers on F face move to L face.
    // So F->L->B->R->F. 
    // Let's verify:
    // strips[0] (F) goes to strips[1] (L).
    // So newStrips[1] = strips[0].
    // newStrips[2] = strips[1].
    // newStrips[3] = strips[2].
    // newStrips[0] = strips[3].
    newStrips = [strips[3], strips[0], strips[1], strips[2]];
  }

  // Apply back to state
  faces.forEach((f, i) => {
    indices[i].forEach((idx, j) => {
      nextState[f][idx] = newStrips[i][j];
    });
  });

  return nextState;
};

export const resetCube = (): CubeState => cloneState(INITIAL_SOLVED_STATE);