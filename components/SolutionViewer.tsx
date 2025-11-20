import React from 'react';
import { SolverResponse } from '../types';
import { Play, Pause, SkipBack, SkipForward, ChevronLeft, ChevronRight, Copy, Info } from 'lucide-react';

interface SolutionViewerProps {
  solution: SolverResponse;
  currentStep: number;
  isPlaying: boolean;
  onPlayPause: () => void;
  onStepForward: () => void;
  onStepBack: () => void;
  onResetPlayback: () => void;
}

const SolutionViewer: React.FC<SolutionViewerProps> = ({
  solution,
  currentStep,
  isPlaying,
  onPlayPause,
  onStepForward,
  onStepBack,
  onResetPlayback
}) => {
  
  const progressPercent = (currentStep / solution.length) * 100;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(solution.solution);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-2xl">
      {/* Header Stats */}
      <div className="bg-slate-900 p-4 border-b border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="text-lg font-bold text-emerald-400">Solution Found!</h3>
          <p className="text-sm text-slate-400">{solution.length} moves calculated in {solution.time_ms}ms</p>
        </div>
        <button 
          onClick={copyToClipboard}
          className="text-xs flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded border border-slate-600 transition-colors"
        >
          <Copy size={14} /> Copy Sequence
        </button>
      </div>

      {/* Orientation Guide */}
      <div className="bg-blue-900/20 p-3 border-b border-slate-700 flex items-start gap-3">
        <Info className="text-blue-400 shrink-0 mt-0.5" size={18} />
        <div className="text-sm text-blue-100">
          <span className="font-bold text-blue-300 uppercase text-xs tracking-wider block mb-1">Starting Orientation</span>
          Hold the cube with <span className="font-bold text-white">White Center on Top</span> and <span className="font-bold text-green-400">Green Center Facing You</span>.
        </div>
      </div>

      {/* Moves List (Scrollable) */}
      <div className="p-4 bg-slate-900/50">
        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 custom-scrollbar">
          {solution.moves.map((move, idx) => (
            <span 
              key={idx}
              className={`px-3 py-1 rounded text-sm font-mono font-bold transition-all ${
                idx === currentStep 
                  ? 'bg-blue-500 text-white scale-110 shadow-lg shadow-blue-500/50 ring-2 ring-blue-300' 
                  : idx < currentStep 
                    ? 'bg-slate-700 text-slate-400'
                    : 'bg-slate-800 text-slate-300 border border-slate-600'
              }`}
            >
              {move}
            </span>
          ))}
           {currentStep === solution.length && (
            <span className="px-3 py-1 rounded text-sm font-bold bg-emerald-500 text-white animate-pulse">
              SOLVED
            </span>
           )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-slate-700 w-full relative">
        <div 
          className="absolute top-0 left-0 h-full bg-emerald-500 transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Controls */}
      <div className="p-4 flex items-center justify-center gap-4 bg-slate-800">
        <button onClick={onResetPlayback} className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition">
          <SkipBack size={20} />
        </button>
        <button onClick={onStepBack} disabled={currentStep === 0} className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition disabled:opacity-30">
          <ChevronLeft size={24} />
        </button>
        
        <button 
          onClick={onPlayPause}
          className="w-14 h-14 flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg shadow-blue-900/40 transition-transform active:scale-95"
        >
          {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
        </button>

        <button onClick={onStepForward} disabled={currentStep === solution.length} className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition disabled:opacity-30">
          <ChevronRight size={24} />
        </button>
        <button onClick={() => { /* Optional jump to end */ }} className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition opacity-50 cursor-not-allowed">
          <SkipForward size={20} />
        </button>
      </div>
    </div>
  );
};

export default SolutionViewer;