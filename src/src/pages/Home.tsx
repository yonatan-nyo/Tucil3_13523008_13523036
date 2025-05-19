import { useState, useEffect, useRef, type ChangeEvent, useCallback } from "react";
import algorithms from "../lib/algorithms";
import type { Algorithm, BoardConfig, Heuristic, PiecesMap, SolutionResult, Stats } from "../lib/types";
import applyMove from "../lib/helpers/applyMove";
import deepCopy from "../lib/helpers/deepCopy";
import getPiecesInfo from "../lib/helpers/getPiecesInfo";
import parseInputFile from "../lib/helpers/parseInputFile";
import { heuristics } from "../lib/heuristics";
import HomeHead from "./sections/HomeHead";
import SolutionControl from "./sections/SolutionControl";
import { pieceColors } from "../lib/constant";
import InputSection from "./sections/InputSection";
import Layout from "./components/Layout";

export default function RushHourGame() {
  const [boardConfig, setBoardConfig] = useState<BoardConfig | null>(null);
  const [board, setBoard] = useState<string[][]>([]);
  const [pieces, setPieces] = useState<PiecesMap>({});
  const [algorithm, setAlgorithm] = useState<Algorithm>("greedy");
  const [heuristic, setHeuristic] = useState<Heuristic>("manhattan");
  const [solution, setSolution] = useState<SolutionResult | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [displayBoard, setDisplayBoard] = useState<string[][]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playSpeed, setPlaySpeed] = useState<number>(500); // ms between moves
  const playTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Clear solution when algorithm or heuristic changes
  useEffect(() => {
    setSolution(null);
    setStats(null);
    setCurrentStep(-1);
    stopAnimation();
    if (board.length > 0) {
      setDisplayBoard(deepCopy(board));
    }
  }, [algorithm, board, heuristic]);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError("");
    setSolution(null);
    setStats(null);
    setCurrentStep(-1);
    stopAnimation();
    setBoard([]);
    setPieces({});
    setDisplayBoard([]);
    setBoardConfig(null);
    setAlgorithm("greedy");
    setHeuristic("manhattan");

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsedConfig = parseInputFile(content);
        const initialBoard = parsedConfig.boardConfig.map((row) => row.split(""));
        const piecesInfo = getPiecesInfo(parsedConfig.boardConfig);

        setBoardConfig(parsedConfig);
        setBoard(initialBoard);
        setPieces(piecesInfo);
        setDisplayBoard(initialBoard);

        setIsLoading(false);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError("Error parsing file: " + err?.message);
        } else {
          setError("An unknown error occurred");
        }
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      setError("Error reading file");
      setIsLoading(false);
    };

    reader.readAsText(file);

    e.target.value = "";
  };

  const solvePuzzle = () => {
    if (!board.length || !Object.keys(pieces).length) {
      setError("Please upload a valid board configuration first.");
      return;
    }

    setError("");
    setIsLoading(true);
    setSolution(null);
    setStats(null);
    setCurrentStep(-1);
    stopAnimation();

    // Use setTimeout to allow UI to update before computation starts
    setTimeout(() => {
      try {
        let result: SolutionResult;

        if (algorithm === "greedy") {
          result = algorithms.greedy(board, pieces, heuristics[heuristic]);
        } else if (algorithm === "ucs") {
          result = algorithms.ucs(board, pieces);
        } else if (algorithm === "astar") {
          result = algorithms.astar(board, pieces, heuristics[heuristic]);
        } else if (algorithm === "dijkstra") {
          result = algorithms.dijkstra(board, pieces);
        } else if (algorithm === "fringe") {
          result = algorithms.fringe(board, pieces, heuristics[heuristic]);
        } else {
          throw new Error("Invalid algorithm");
        }

        if (result.solved) {
          setSolution(result);
          setStats({
            nodesVisited: result.nodesVisited,
            executionTime: result.executionTime.toFixed(2),
            moves: result.moves.length,
          });
          setDisplayBoard(deepCopy(board));
        } else {
          setError("No solution found");
        }

        setIsLoading(false);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError("Error solving puzzle: " + err?.message);
        } else {
          setError("An unknown error occurred");
        }
        setIsLoading(false);
      }
    }, 50);
  };

  const applyStepMove = useCallback(
    (step: number) => {
      if (!solution || step < -1 || step >= solution.moves.length) return;

      let currentBoard = deepCopy(board);
      let currentPieces = { ...pieces };

      // If step is -1, just show initial board
      if (step === -1) {
        setDisplayBoard(deepCopy(board));
        setCurrentStep(-1);
        return;
      }

      // Apply all moves up to the desired step
      for (let i = 0; i <= step; i++) {
        const result = applyMove(currentBoard, currentPieces, solution.moves[i]);
        currentBoard = result.board;
        currentPieces = result.pieces;
      }

      setDisplayBoard(currentBoard);
      setCurrentStep(step);
    },
    [board, pieces, solution]
  );

  const resetBoard = () => {
    setBoardConfig(null);
    setBoard([]);
    setPieces({});
    setAlgorithm("greedy");
    setHeuristic("manhattan");
    setSolution(null);
    setStats(null);
    setCurrentStep(-1);
    setDisplayBoard([]);
    setError(null);
    stopAnimation();
  };

  const playAnimation = () => {
    if (!solution || solution.moves.length === 0) return;

    // If at the end, reset to beginning
    if (currentStep >= solution.moves.length - 1) {
      resetBoard();
    }

    setIsPlaying(true);
  };

  const stopAnimation = () => {
    setIsPlaying(false);
    if (playTimerRef.current) {
      clearTimeout(playTimerRef.current);
      playTimerRef.current = null;
    }
  };

  // Animation effect - runs when isPlaying changes or currentStep changes
  useEffect(() => {
    if (!isPlaying || !solution) return;

    // Clear any existing timers
    if (playTimerRef.current) {
      clearTimeout(playTimerRef.current);
    }

    // Calculate the next step
    const nextStep = currentStep + 1;

    // Check if we're done
    if (nextStep >= solution.moves.length) {
      setIsPlaying(false);
      return;
    }

    // Get the current move to determine animation speed based on steps
    const currentMove = solution.moves[nextStep];
    // Adjust animation speed based on number of steps (faster for multi-step moves)
    const moveSpeed = playSpeed / (currentMove.steps || 1);

    // Set a timer to apply the next step
    playTimerRef.current = setTimeout(() => {
      applyStepMove(nextStep);
    }, moveSpeed);

    // Cleanup when component unmounts or deps change
    return () => {
      if (playTimerRef.current) {
        clearTimeout(playTimerRef.current);
      }
    };
  }, [isPlaying, currentStep, solution, playSpeed, applyStepMove]);

  const moveOneStep = (forward: boolean) => {
    if (!solution) return;

    if (forward && currentStep < solution.moves.length - 1) {
      applyStepMove(currentStep + 1);
    } else if (!forward && currentStep > -1) {
      applyStepMove(currentStep - 1);
    }
  };

  // Cleanup effect for timers
  useEffect(() => {
    return () => {
      if (playTimerRef.current) {
        clearTimeout(playTimerRef.current);
      }
    };
  }, []);

  const getCellStyle = (value: string): string => {
    const darkModeBg = isDarkMode ? "bg-gray-800" : "bg-gray-200";

    if (value === "P") {
      return "bg-red-500 text-white shadow-md";
    }
    if (value === "K") {
      return "bg-green-500 text-white shadow-md";
    }
    if (solution && currentStep >= 0 && currentStep < solution.moves.length) {
      const currentMove = solution.moves[currentStep];
      if (currentMove && value === currentMove.piece) {
        return "bg-yellow-500 text-white shadow-md";
      }
    }
    return value !== "." ? `${pieceColors[value] || "bg-gray-500"} text-white shadow-md` : darkModeBg;
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const saveSolution = () => {
    if (!solution || !board.length) return;

    let outputText = "Papan Awal\n";
    const initialBoardString = board.map((row) => row.join("")).join("\n");
    outputText += initialBoardString + "\n\n\n";

    let currentBoard = deepCopy(board);
    let currentPieces = { ...pieces };

    solution.moves.forEach((move, idx) => {
      const result = applyMove(currentBoard, currentPieces, move);
      currentBoard = result.board;
      currentPieces = result.pieces;

      outputText += `Gerakan ${idx + 1}: ${move.piece}-${move.direction}\n`;

      const boardString = currentBoard.map((row) => row.join("")).join("\n");
      outputText += boardString + "\n\n\n";
    });

    // Create and download the file
    const blob = new Blob([outputText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rush_hour_solution.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <div className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"} transition-colors duration-300`}>
        <div className="container mx-auto px-4 py-8">
          <HomeHead isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

          {/* Input Section with Loading Overlay */}
          <div className="relative">
            {isLoading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-xl z-10">
                <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} p-6 rounded-lg shadow-xl flex flex-col items-center`}>
                  <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 rounded-full animate-spin mb-4"></div>
                  <p className="text-lg font-medium">Solving puzzle...</p>
                  <p className="text-sm opacity-75 mt-2">This may take a moment</p>
                </div>
              </div>
            )}

            <InputSection
              // board={board}
              setBoard={setBoard}
              boardConfig={boardConfig}
              setBoardConfig={setBoardConfig}
              algorithm={algorithm}
              setAlgorithm={setAlgorithm}
              heuristic={heuristic}
              setHeuristic={setHeuristic}
              solvePuzzle={solvePuzzle}
              isLoading={isLoading}
              resetBoard={resetBoard}
              error={error}
              setError={setError}
              stats={stats}
              isDarkMode={isDarkMode}
              handleFileUpload={handleFileUpload}
            />
          </div>

          {/* Game Board and Controls */}
          {displayBoard.length > 0 && (
            <div className={`mb-8 ${isDarkMode ? "bg-gray-800" : "bg-white"} p-6 rounded-xl shadow-md transition-colors duration-300`}>
              <h2 className="text-xl font-bold mb-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full ${isDarkMode ? "bg-blue-600" : "bg-blue-500"} flex items-center justify-center mr-2`}>
                    <span className="text-white">2</span>
                  </div>
                  Game Board
                </div>
              </h2>

              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                {/* Board */}
                <div className={`${isDarkMode ? "bg-gray-700" : "bg-gray-100"} p-4 rounded-lg shadow-inner inline-block`}>
                  {displayBoard.map((row, rowIdx) => (
                    <div key={`row-${rowIdx}`} className="flex">
                      {row.map((cell, colIdx) => (
                        <div
                          key={`cell-${rowIdx}-${colIdx}`}
                          className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center m-0.5 rounded-md text-lg font-bold ${getCellStyle(cell)} transition-all duration-300`}>
                          {cell !== "." ? cell : ""}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Controls */}
                {solution && (
                  <SolutionControl
                    isDarkMode={isDarkMode}
                    playSpeed={playSpeed}
                    setPlaySpeed={setPlaySpeed}
                    isPlaying={isPlaying}
                    playAnimation={playAnimation}
                    stopAnimation={stopAnimation}
                    moveOneStep={moveOneStep}
                    applyStepMove={applyStepMove}
                    currentStep={currentStep}
                    solution={solution}
                    saveSolution={saveSolution}
                  />
                )}
              </div>
            </div>
          )}

          {/* Move History */}
          {solution && solution.moves.length > 0 && (
            <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} p-6 rounded-xl shadow-md transition-colors duration-300`}>
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <div className={`w-8 h-8 rounded-full ${isDarkMode ? "bg-blue-600" : "bg-blue-500"} flex items-center justify-center mr-2`}>
                  <span className="text-white">3</span>
                </div>
                Solution Steps
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                <div
                  key="initial"
                  onClick={() => applyStepMove(-1)}
                  className={`cursor-pointer p-3 rounded-lg ${
                    currentStep === -1 ? (isDarkMode ? "bg-blue-900/40 border-blue-700" : "bg-blue-100 border-blue-300") : isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-50 hover:bg-gray-100"
                  } border transition-colors`}>
                  <div className="font-bold">Initial Board</div>
                  <div className="text-sm opacity-75">Starting position</div>
                </div>

                {solution.moves.map((move, idx) => (
                  <div
                    key={idx}
                    onClick={() => applyStepMove(idx)}
                    className={`cursor-pointer p-3 rounded-lg ${
                      currentStep === idx
                        ? isDarkMode
                          ? "bg-blue-900/40 border-blue-700"
                          : "bg-blue-100 border-blue-300"
                        : isDarkMode
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-gray-50 hover:bg-gray-100"
                    } border transition-colors`}>
                    <div className="font-bold flex justify-between">
                      <span>Move {idx + 1}</span>
                      <span className="text-sm opacity-75">Piece {move.piece}</span>
                    </div>
                    <div className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                      Direction: {move.direction} {move.steps > 1 ? `(${move.steps} steps)` : ""}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
