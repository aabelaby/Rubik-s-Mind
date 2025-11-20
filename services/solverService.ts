import { CubeState, SolverResponse } from '../types';

// This simulates the Django Backend Response
// In a real app, this would POST to /api/solve/
export const fetchSolution = async (state: CubeState): Promise<SolverResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mocked logic: Return a random valid-looking sequence
      // In a real scenario, we'd serialize the state and send it to Kociemba
      
      // Hardcoded example sequence for demo purposes if it matches solved, otherwise random
      const movesPool = ["R", "L", "U", "D", "F", "B", "R'", "L'", "U'", "D'", "F'", "B'", "R2", "U2", "F2"];
      const length = Math.floor(Math.random() * 10) + 10; // 10-20 moves
      const moves = Array.from({ length }, () => movesPool[Math.floor(Math.random() * movesPool.length)]);
      
      const solutionStr = moves.join(" ");

      resolve({
        valid: true,
        solution: solutionStr,
        moves: moves,
        length: moves.length,
        time_ms: Math.floor(Math.random() * 50) + 10,
      } as unknown as SolverResponse); 
    }, 800); // Simulate network lag
  });
};