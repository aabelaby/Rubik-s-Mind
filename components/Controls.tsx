import React from 'react';
import { ColorCode } from '../types';
import { COLORS, COLOR_NAMES } from '../constants';
import { RotateCcw, Play, CheckCircle2, Eraser, Check } from 'lucide-react';

interface ControlsProps {
  selectedColor: ColorCode;
  onSelectColor: (c: ColorCode) => void;
  onValidate: () => void;
  onSolve: () => void;
  onReset: () => void;
  isSolving: boolean;
  isValid: boolean;
  colorCounts: Record<string, number>;
}

const Controls: React.FC<ControlsProps> = ({
  selectedColor,
  onSelectColor,
  onValidate,
  onSolve,
  onReset,
  isSolving,
  isValid,
  colorCounts
}) => {
  const paletteColors: ColorCode[] = ['W', 'G', 'R', 'B', 'O', 'Y'];

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto mt-6 p-6 bg-slate-800/50 rounded-xl border border-slate-700 backdrop-blur-sm">
      
      {/* Color Palette */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center justify-between w-full px-2">
            <span className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Select Color</span>
            <span className="text-xs text-slate-500">Max 9 per color</span>
        </div>
        
        <div className="flex gap-3 sm:gap-4 flex-wrap justify-center">
          {paletteColors.map((c) => {
            const count = colorCounts[c as string] || 0;
            const isFull = count >= 9;
            const isSelected = selectedColor === c;
            const isOver = count > 9;

            return (
              <div key={c} className="flex flex-col items-center gap-1">
                <button
                  onClick={() => onSelectColor(c)}
                  className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-lg transition-all duration-200
                    ${isSelected ? 'scale-110 ring-2 ring-offset-2 ring-offset-slate-900 ring-white' : 'hover:scale-105 border-2 border-transparent'}
                    ${isFull && !isSelected ? 'opacity-60 grayscale-[0.3]' : ''}
                  `}
                  style={{ backgroundColor: COLORS[c as string] }}
                  title={`${COLOR_NAMES[c as string]} (${count}/9)`}
                >
                  {/* Full Indicator */}
                  {isFull && (
                    <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border border-slate-800 shadow-sm ${isOver ? 'bg-red-500' : 'bg-emerald-500'}`}>
                       {isOver ? <span className="text-white font-bold text-[10px]">!</span> : <Check size={12} className="text-white" strokeWidth={3} />}
                    </div>
                  )}
                </button>
                <span className={`text-[10px] sm:text-xs font-mono font-bold ${isFull ? (isOver ? 'text-red-400' : 'text-emerald-400') : 'text-slate-500'}`}>
                  {count}/9
                </span>
              </div>
            );
          })}
          
          <div className="w-px h-10 bg-slate-700 mx-1 self-center" />

          {/* Eraser */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => onSelectColor(null)}
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-lg flex items-center justify-center bg-slate-700 transition-all hover:scale-105 ${selectedColor === null ? 'scale-110 ring-2 ring-offset-2 ring-offset-slate-900 ring-slate-400' : 'border-2 border-transparent'}`}
              title="Erase Sticker"
            >
              <Eraser size={20} className="text-slate-300" />
            </button>
            <span className="text-[10px] sm:text-xs font-mono font-bold text-slate-500 opacity-0">-</span>
          </div>

        </div>
      </div>

      <div className="h-px bg-slate-700 w-full" />

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 sm:px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors text-sm sm:text-base"
        >
          <RotateCcw size={18} />
          Reset
        </button>

        <button
          onClick={onValidate}
          className="flex items-center gap-2 px-4 sm:px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-blue-900/20 text-sm sm:text-base"
        >
          <CheckCircle2 size={18} />
          Validate
        </button>

        <button
          onClick={onSolve}
          disabled={!isValid || isSolving}
          className={`flex items-center gap-2 px-6 sm:px-8 py-3 font-bold rounded-lg transition-all shadow-lg text-sm sm:text-base ${
            !isValid 
              ? 'bg-slate-600 text-slate-400 cursor-not-allowed opacity-50' 
              : isSolving 
                ? 'bg-emerald-700 text-emerald-200 cursor-wait' 
                : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-900/30'
          }`}
        >
          {isSolving ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Solving...
            </>
          ) : (
            <>
              <Play size={18} fill="currentColor" />
              SOLVE CUBE
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Controls;