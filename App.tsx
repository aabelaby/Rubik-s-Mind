import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { CubeState, FaceName, ColorCode, ValidationResult, SolverResponse } from './types';
import { INITIAL_SOLVED_STATE, EMPTY_STATE, COLOR_NAMES } from './constants';
import { validateCube, resetCube, cloneState, applyMove, getCubeColorCounts } from './services/cubeLogic';
import { fetchSolution } from './services/solverService';
import CubeInputNet from './components/CubeInputNet';
import Controls from './components/Controls';
import SolutionViewer from './components/SolutionViewer';
import { Box, AlertCircle, XCircle, Info } from 'lucide-react';

function App() {
  // --- State ---
  const [cubeState, setCubeState] = useState<CubeState>(() => cloneState(INITIAL_SOLVED_STATE));
  const [selectedColor, setSelectedColor] = useState<ColorCode>('R'); // Default tool color
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Solving State
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isSolving, setIsSolving] = useState(false);
  const [solution, setSolution] = useState<SolverResponse | null>(null);
  
  // Playback State
  const [playbackStep, setPlaybackStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [visualState, setVisualState] = useState<CubeState>(() => cloneState(INITIAL_SOLVED_STATE)); // State shown during playback

  // Derived State
  const colorCounts = useMemo(() => getCubeColorCounts(cubeState), [cubeState]);

  // Clear toast after 3s
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // --- Handlers ---

  // Coloring the cube
  const handleCellClick = useCallback((face: FaceName, index: number) => {
    // Prevent editing during playback or solving
    if (solution || isSolving) return;

    // Center pieces are fixed
    if (index === 4) {
      setToastMessage("Center stickers cannot be changed.");
      return;
    }

    // Logic to apply color
    setCubeState((prev) => {
      const oldColor = prev[face][index];

      // 1. If no change needed, return previous state
      if (oldColor === selectedColor) return prev;

      // 2. If Erasing, always allowed
      if (selectedColor === null) {
        const newState = cloneState(prev);
        newState[face][index] = null;
        return newState;
      }

      // 3. Enforce Limit: Check if target color is already at max (9)
      // We recalculate counts from 'prev' to ensure thread safety against rapid clicks
      const currentCounts = getCubeColorCounts(prev);
      const count = currentCounts[selectedColor] || 0;

      if (count >= 9) {
        // Return previous state effectively blocking the update
        return prev;
      }

      // 4. Apply Change
      const newState = cloneState(prev);
      newState[face][index] = selectedColor;
      return newState;
    });

    // UI Feedback: Show toast if the user tried to exceed limit.
    // We check if the limit was already hit for the selected color.
    if (selectedColor !== null) {
      const currentCount = colorCounts[selectedColor] || 0;
      const cellColor = cubeState[face][index];
      
      // Warning if we are adding a new sticker (not replacing same color) and we are at limit
      if (currentCount >= 9 && cellColor !== selectedColor) {
        setToastMessage(`Limit reached! Max 9 ${COLOR_NAMES[selectedColor]} stickers.`);
      }
    }

    // Clear validation on edit
    setValidationResult(null);
  }, [selectedColor, solution, isSolving, colorCounts, cubeState]);

  // Actions
  const handleReset = () => {
    setCubeState(resetCube());
    setVisualState(resetCube());
    setSolution(null);
    setValidationResult(null);
    setPlaybackStep(0);
    setIsPlaying(false);
  };

  const handleValidate = () => {
    const result = validateCube(cubeState);
    setValidationResult(result);
    return result.valid;
  };

  const handleSolve = async () => {
    const isValid = handleValidate();
    if (!isValid) return;

    setIsSolving(true);
    try {
      const result = await fetchSolution(cubeState);
      setSolution(result);
      // Initialize visual state for playback
      setVisualState(cloneState(cubeState)); 
      setPlaybackStep(0);
    } catch (e) {
      console.error("Solve failed", e);
      setToastMessage("Failed to connect to solver service.");
    } finally {
      setIsSolving(false);
    }
  };

  // --- Playback Logic ---

  // Effect to update Visual State based on Step
  useEffect(() => {
    if (!solution) return;
    
    // Reconstruct state from initial cubeState up to current step
    let tempState = cloneState(cubeState);
    for (let i = 0; i < playbackStep; i++) {
      const move = solution.moves[i];
      tempState = applyMove(tempState, move);
    }
    setVisualState(tempState);

  }, [playbackStep, solution, cubeState]);

  // Timer for Auto-Play
  useEffect(() => {
    let interval: number;
    if (isPlaying && solution && playbackStep < solution.length) {
      interval = window.setInterval(() => {
        setPlaybackStep((prev) => {
          if (prev >= solution.length) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 600); // Speed of animation
    } else {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, solution, playbackStep]);


  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-20 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-4 z-50 bg-rose-600 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-right-8 duration-300 border border-rose-400">
          <XCircle size={20} />
          <span className="font-semibold text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Navbar */}
      <nav className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Box className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Rubik's Mind</h1>
            <span className="text-xs text-slate-500 font-mono">SOLVER V1.0</span>
          </div>
        </div>
        <div className="hidden sm:block text-sm text-slate-500">
          {solution ? 'Mode: Solution View' : 'Mode: Input State'}
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        
        {/* Validation Errors */}
        {validationResult && !validationResult.valid && (
          <div className="max-w-4xl mx-auto mb-6 p-4 bg-red-900/20 border border-red-700/50 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-4">
            <AlertCircle className="text-red-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-red-400">Invalid Cube State</h4>
              <ul className="list-disc list-inside text-sm text-red-300/80 mt-1 space-y-1">
                {validationResult.errors.map((err, i) => <li key={i}>{err}</li>)}
              </ul>
            </div>
          </div>
        )}

        {/* Main Cube View */}
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          
          {/* Left Column: Cube Visualization */}
          <div className="w-full lg:w-auto flex-1 flex flex-col items-center">
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 shadow-2xl backdrop-blur-sm">
              <CubeInputNet 
                state={solution ? visualState : cubeState} 
                onCellClick={handleCellClick} 
                readOnly={!!solution}
              />
            </div>
            
            <p className="mt-4 text-slate-500 text-sm text-center max-w-md">
              {solution 
                ? "Watch the solution playback above." 
                : "Tap colors in the palette below, then paint the faces to match your scrambled cube. Centers are fixed."}
            </p>
          </div>

          {/* Right Column: Controls & Solution */}
          <div className="w-full lg:max-w-lg flex flex-col gap-4">
            
            {solution ? (
               <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
                  <div className="flex justify-between items-center mb-4">
                     <h2 className="text-2xl font-bold text-white">Solution Sequence</h2>
                     <button 
                       onClick={() => { setSolution(null); setIsPlaying(false); setPlaybackStep(0); }}
                       className="text-sm text-blue-400 hover:text-blue-300 underline underline-offset-4"
                     >
                       Back to Edit
                     </button>
                  </div>
                  <SolutionViewer 
                    solution={solution}
                    currentStep={playbackStep}
                    isPlaying={isPlaying}
                    onPlayPause={() => setIsPlaying(!isPlaying)}
                    onStepForward={() => setPlaybackStep(s => Math.min(s + 1, solution.length))}
                    onStepBack={() => setPlaybackStep(s => Math.max(s - 1, 0))}
                    onResetPlayback={() => setPlaybackStep(0)}
                  />
               </div>
            ) : (
              <Controls 
                selectedColor={selectedColor}
                onSelectColor={setSelectedColor}
                onValidate={handleValidate}
                onReset={handleReset}
                onSolve={handleSolve}
                isSolving={isSolving}
                isValid={validationResult?.valid ?? true}
                colorCounts={colorCounts}
              />
            )}

            {/* Legend / Help */}
            {!solution && (
              <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-800 mt-4">
                <h4 className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-2">
                  <Info size={14} /> Orientation & Guide
                </h4>
                <div className="text-xs text-slate-400 space-y-2">
                  <p>Hold cube with <strong className="text-white">White Top</strong> and <strong className="text-green-500">Green Front</strong> when entering colors.</p>
                  <div className="grid grid-cols-2 gap-y-1 pl-2 border-l-2 border-slate-700">
                    <span>• U = Up (White)</span>
                    <span>• D = Down (Yellow)</span>
                    <span>• F = Front (Green)</span>
                    <span>• B = Back (Blue)</span>
                    <span>• L = Left (Orange)</span>
                    <span>• R = Right (Red)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;