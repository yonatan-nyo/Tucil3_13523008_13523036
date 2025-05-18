import { Check, ChevronRight, Upload } from "lucide-react";
import type { Algorithm, BoardConfig, Heuristic, Stats } from "../../lib/types";
import ResultStat from "./ResultStat";

const InputSection = ({
  board,
  boardConfig,
  algorithm,
  setAlgorithm,
  heuristic,
  setHeuristic,
  solvePuzzle,
  isLoading,
  error,
  setError,
  stats,
  isDarkMode,
  handleFileUpload,
}: {
  board: string[][];
  setBoard: (board: string[][]) => void;
  boardConfig: BoardConfig | null;
  setBoardConfig: (config: BoardConfig | null) => void;
  algorithm: Algorithm;
  setAlgorithm: (algorithm: Algorithm) => void;
  heuristic: Heuristic;
  setHeuristic: (heuristic: Heuristic) => void;
  solvePuzzle: () => void;
  isLoading: boolean;
  resetBoard: () => void;
  error: string | null;
  setError: (error: string | null) => void;
  stats: Stats | null;
  isDarkMode: boolean;
  handleFileUpload?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div className={`mb-8 ${isDarkMode ? "bg-gray-800" : "bg-white"} p-6 rounded-xl shadow-md transition-colors duration-300`}>
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <div className={`w-8 h-8 rounded-full ${isDarkMode ? "bg-blue-600" : "bg-blue-500"} flex items-center justify-center mr-2`}>
          <span className="text-white">1</span>
        </div>
        Configure Solver
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* File Upload */}
        <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
          <label className="block text-sm font-medium mb-2">Board Configuration</label>
          <div className="flex items-center">
            <label className={`cursor-pointer ${isDarkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} text-white py-2 px-4 rounded-md flex items-center transition-colors`}>
              <Upload size={16} className="mr-2" />
              Upload File
              <input
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                onClick={() => {
                  if (error) {
                    setError(null);
                  }
                }}
                className="hidden"
              />
            </label>
            {boardConfig && (
              <span className="ml-3 text-green-500">
                <Check size={18} />
              </span>
            )}
          </div>
          {boardConfig && (
            <div className="mt-2 text-sm opacity-75">
              Board size: {board.length}x{board[0]?.length || 0}
            </div>
          )}
        </div>

        {/* Algorithm Selection */}
        <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
          <label className="block text-sm font-medium mb-2">Algorithm</label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value as Algorithm)}
            className={`w-full border ${isDarkMode ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300"} rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}>
            <option value="greedy">Greedy Best First Search</option>
            <option value="ucs">Uniform Cost Search (UCS)</option>
            <option value="astar">A* Search</option>
            <option value="dijkstra">Dijkstra's Algorithm</option>
          </select>
          <p className="mt-2 text-sm opacity-75">
            {algorithm === "greedy"
              ? "Optimizes for quick solutions using heuristics"
              : algorithm === "ucs"
              ? "Finds the shortest path by exploring all options"
              : algorithm === "dijkstra"
              ? "Finds the shortest path in weighted graphs"
              : "Combines heuristics with path cost for efficiency"}
          </p>
        </div>

        {/* Heuristic Selection (for Greedy and A*) */}
        {algorithm !== "ucs" && algorithm !== "dijkstra" && (
          <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
            <label className="block text-sm font-medium mb-2">Heuristic</label>
            <select
              value={heuristic}
              onChange={(e) => setHeuristic(e.target.value as Heuristic)}
              className={`w-full border ${
                isDarkMode ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300"
              } rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}>
              <option value="manhattan">Manhattan Distance</option>
              <option value="blockingVehicles">Blocking Vehicles</option>
              <option value="combined">Combined Heuristic</option>
            </select>
            <p className="mt-2 text-sm opacity-75">
              {heuristic === "manhattan"
                ? "Measures direct distance to exit"
                : heuristic === "blockingVehicles"
                ? "Counts vehicles blocking the path"
                : "Combines multiple metrics for better estimates"}
            </p>
          </div>
        )}
      </div>

      {/* Solve Button */}
      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={solvePuzzle}
          disabled={isLoading || !boardConfig}
          className={`${
            isDarkMode ? "bg-green-600 hover:bg-green-700" : "bg-green-500 hover:bg-green-600"
          } text-white py-3 px-6 rounded-md flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm`}>
          {isLoading ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              Solving...
            </>
          ) : (
            <>
              Solve Puzzle
              <ChevronRight size={16} className="ml-1" />
            </>
          )}
        </button>

        {/* {boardConfig && (
          <button
            onClick={resetBoard}
            className={`${
              isDarkMode ? "bg-gray-600 hover:bg-gray-700" : "bg-gray-300 hover:bg-gray-400"
            } py-3 px-6 rounded-md flex items-center transition-colors shadow-sm`}>
            <RotateCcw size={16} className="mr-1" />
            Reset
          </button>
        )} */}
      </div>

      {error && (
        <div className={`mt-4 ${isDarkMode ? "bg-red-900/30" : "bg-red-50"} border ${isDarkMode ? "border-red-800" : "border-red-200"} text-red-600 p-3 rounded-md`}>
          <p className="font-medium">Error</p>
          <p>{error}</p>
        </div>
      )}

      {/* Results/Stats Section */}
      {stats && <ResultStat stats={stats} isDarkMode={isDarkMode} />}
    </div>
  );
};

export default InputSection;
