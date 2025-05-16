import { ChevronRight, FastForward, Pause, Play, Rewind } from "lucide-react";
import type { SolutionResult } from "../../lib/types";

const SolutionControl = ({
  isDarkMode,
  playSpeed,
  setPlaySpeed,
  isPlaying,
  playAnimation,
  stopAnimation,
  moveOneStep,
  applyStepMove,
  currentStep,
  solution,
  saveSolution,
}: {
  isDarkMode: boolean;
  playSpeed: number;
  setPlaySpeed: (speed: number) => void;
  isPlaying: boolean;
  playAnimation: () => void;
  stopAnimation: () => void;
  moveOneStep: (forward: boolean) => void;
  applyStepMove: (step: number) => void;
  currentStep: number;
  solution: SolutionResult;
  saveSolution: () => void;
}) => {
  return (
    <div className="w-full md:w-auto">
      <div className={`${isDarkMode ? "bg-gray-700" : "bg-gray-100"} p-4 rounded-lg shadow-inner`}>
        <h3 className="font-bold text-lg mb-3">Playback Controls</h3>

        <div className="mb-4">
          <div className="text-sm mb-1 opacity-75">Animation Speed</div>
          <input type="range" min="100" max="1000" step="100" value={playSpeed} onChange={(e) => setPlaySpeed(parseInt(e.target.value))} className="w-full" />
          <div className="flex justify-between text-xs opacity-75">
            <span>Fast</span>
            <span>Slow</span>
          </div>
        </div>

        <div className="flex justify-center space-x-3">
          <button
            onClick={() => applyStepMove(-1)}
            className={`p-2 rounded-full ${isDarkMode ? "bg-gray-600 hover:bg-gray-500" : "bg-gray-200 hover:bg-gray-300"} transition-colors`}
            title="Go to start">
            <Rewind size={18} />
          </button>

          <button
            onClick={() => moveOneStep(false)}
            className={`p-2 rounded-full ${isDarkMode ? "bg-gray-600 hover:bg-gray-500" : "bg-gray-200 hover:bg-gray-300"} transition-colors`}
            disabled={currentStep < 0}
            title="Previous step">
            <ChevronRight size={18} className="transform rotate-180" />
          </button>

          <button
            onClick={isPlaying ? stopAnimation : playAnimation}
            className={`p-3 rounded-full ${
              isPlaying ? (isDarkMode ? "bg-red-600 hover:bg-red-700" : "bg-red-500 hover:bg-red-600") : isDarkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
            } text-white transition-colors`}
            title={isPlaying ? "Pause" : "Play"}>
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>

          <button
            onClick={() => moveOneStep(true)}
            className={`p-2 rounded-full ${isDarkMode ? "bg-gray-600 hover:bg-gray-500" : "bg-gray-200 hover:bg-gray-300"} transition-colors`}
            disabled={currentStep >= (solution?.moves.length || 0) - 1}
            title="Next step">
            <ChevronRight size={18} />
          </button>

          <button
            onClick={() => applyStepMove(solution.moves.length - 1)}
            className={`p-2 rounded-full ${isDarkMode ? "bg-gray-600 hover:bg-gray-500" : "bg-gray-200 hover:bg-gray-300"} transition-colors`}
            title="Go to end">
            <FastForward size={18} />
          </button>
        </div>

        <div className="mt-4">
          <div className="text-sm mb-1 opacity-75">Progress</div>
          <div className="relative h-2 bg-gray-300 rounded-full overflow-hidden">
            <div className={`absolute top-0 left-0 h-full ${isDarkMode ? "bg-blue-600" : "bg-blue-500"}`} style={{ width: `${((currentStep + 1) / solution.moves.length) * 100}%` }}></div>
          </div>
          <div className="flex justify-between mt-1 text-sm">
            <span>Step {currentStep === -1 ? "Start" : currentStep + 1}</span>
            <span>Total: {solution.moves.length}</span>
          </div>
        </div>
      </div>

      {/* Added Save Solution button */}
      {saveSolution && (
        <button
          onClick={saveSolution}
          className={`px-3 py-2 ${
            isDarkMode ? "bg-purple-600 hover:bg-purple-700" : "bg-purple-500 hover:bg-purple-600"
          } text-white rounded-md text-sm font-medium w-full transition-colors shadow-sm flex items-center justify-center gap-1 mt-2`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Simpan Solusi ke File
        </button>
      )}

      <div className="mt-4 text-sm">
        <div className="flex items-center mb-1">
          <div className="w-4 h-4 rounded-sm bg-red-500 mr-2"></div>
          <span>Red (P): Player's vehicle</span>
        </div>

        {currentStep >= 0 && currentStep < solution.moves.length && (
          <div className="flex items-center mb-1">
            <div className="w-4 h-4 rounded-sm bg-yellow-500 mr-2"></div>
            <span>Yellow: Current moving piece</span>
          </div>
        )}

        <div className="flex items-center">
          <div className="w-4 h-4 rounded-sm bg-green-500 mr-2"></div>
          <span>Green (K): Exit/Goal</span>
        </div>
      </div>
    </div>
  );
};

export default SolutionControl;
