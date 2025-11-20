import React from 'react';
import { FaceGrid as FaceGridType, ColorCode, FaceName } from '../types';
import { COLORS } from '../constants';

interface FaceGridProps {
  faceName: FaceName;
  colors: FaceGridType;
  onCellClick: (face: FaceName, index: number) => void;
  highlight?: boolean;
  readOnly?: boolean;
}

const FaceGrid: React.FC<FaceGridProps> = ({ faceName, colors, onCellClick, highlight, readOnly }) => {
  return (
    <div className={`flex flex-col items-center gap-1 ${highlight ? 'scale-105 transition-transform' : ''}`}>
      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{faceName}</span>
      <div className="grid grid-cols-3 gap-1 p-1 bg-slate-800 rounded-md shadow-lg border border-slate-700">
        {colors.map((color, idx) => (
          <button
            key={idx}
            onClick={() => !readOnly && onCellClick(faceName, idx)}
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-sm transition-all duration-150 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white/50 ${readOnly ? 'cursor-default' : 'cursor-pointer active:scale-90'}`}
            style={{ backgroundColor: COLORS[color as string] || COLORS.null }}
            aria-label={`Face ${faceName} Cell ${idx} Color ${color}`}
          >
            {/* Center piece identifier dot */}
            {idx === 4 && <div className="w-1 h-1 bg-black/20 rounded-full mx-auto" />}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FaceGrid;