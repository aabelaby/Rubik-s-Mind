import React from 'react';
import { CubeState, FaceName, ColorCode } from '../types';
import FaceGrid from './FaceGrid';

interface CubeInputNetProps {
  state: CubeState;
  onCellClick: (face: FaceName, index: number) => void;
  readOnly?: boolean;
}

const CubeInputNet: React.FC<CubeInputNetProps> = ({ state, onCellClick, readOnly = false }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 overflow-x-auto p-4">
      {/* Top Row: U */}
      <div className="grid grid-cols-4 gap-4">
        <div className="col-start-2">
          <FaceGrid faceName="U" colors={state.U} onCellClick={onCellClick} readOnly={readOnly} />
        </div>
      </div>

      {/* Middle Row: L, F, R, B */}
      <div className="grid grid-cols-4 gap-4">
        <FaceGrid faceName="L" colors={state.L} onCellClick={onCellClick} readOnly={readOnly} />
        <FaceGrid faceName="F" colors={state.F} onCellClick={onCellClick} readOnly={readOnly} />
        <FaceGrid faceName="R" colors={state.R} onCellClick={onCellClick} readOnly={readOnly} />
        <FaceGrid faceName="B" colors={state.B} onCellClick={onCellClick} readOnly={readOnly} />
      </div>

      {/* Bottom Row: D */}
      <div className="grid grid-cols-4 gap-4">
        <div className="col-start-2">
          <FaceGrid faceName="D" colors={state.D} onCellClick={onCellClick} readOnly={readOnly} />
        </div>
      </div>
    </div>
  );
};

export default CubeInputNet;