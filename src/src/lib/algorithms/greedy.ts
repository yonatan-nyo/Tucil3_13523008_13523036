import { applyMove, getBoardStateString, getValidMoves, isSolved } from "../helpers";
import type { Move, PiecesMap, SolutionResult } from "../types";

const greedy = (initialBoard: string[][], initialPieces: PiecesMap, heuristicFunc: (board: string[][], pieces: PiecesMap) => number): SolutionResult => {
  // Define a maximum cost to prevent infinite loops
  const MAX_COST = initialBoard.length * initialBoard[0].length * 5;

  const start = performance.now();
  const visitedStates = new Set<string>();
  const openList: Array<{
    board: string[][];
    pieces: PiecesMap;
    stateString: string;
    heuristic: number;
    moves: Move[];
    cost: number; // Add cost tracking
  }> = [];
  let nodesVisited = 0;
  let bestHeuristic = Infinity;
  let plateauCounter = 0;

  const initialState = {
    board: initialBoard,
    pieces: initialPieces,
    stateString: getBoardStateString(initialBoard),
    heuristic: heuristicFunc(initialBoard, initialPieces),
    moves: [],
    cost: 0, // Initialize cost at 0
  };

  openList.push(initialState);
  bestHeuristic = initialState.heuristic;

  while (openList.length > 0) {
    nodesVisited++;

    // Logger: Print current node info
    if (nodesVisited % 1000 === 0) {
      console.log(`[Greedy] Node #${nodesVisited} | OpenList: ${openList.length} | Heuristic: ${openList[0].heuristic} | Best: ${bestHeuristic} | Plateau: ${plateauCounter}`);
    }

    // Sort by heuristic value
    openList.sort((a, b) => a.heuristic - b.heuristic);
    const currentState = openList.shift()!;
    visitedStates.add(currentState.stateString);

    // Check if solved
    if (isSolved(currentState.pieces)) {
      const end = performance.now();
      return {
        solved: true,
        moves: currentState.moves,
        nodesVisited,
        executionTime: end - start,
      };
    }

    // Skip if we've exceeded the maximum cost
    if (currentState.cost > MAX_COST) {
      continue;
    }

    // Track if we're making progress
    if (currentState.heuristic < bestHeuristic) {
      bestHeuristic = currentState.heuristic;
      plateauCounter = 0;
    } else {
      plateauCounter++;

      // If stuck on a plateau for too long, occasionally explore less promising nodes
      // This helps greedy search avoid getting stuck in local minima
      if (plateauCounter > 50 && plateauCounter % 10 === 0) {
        // Introduce randomness by not always picking the best heuristic
        openList.sort(() => Math.random() - 0.5);
      }
    }

    const validMoves = getValidMoves(currentState.board, currentState.pieces);

    for (const move of validMoves) {
      const { board: newBoard, pieces: newPieces } = applyMove(currentState.board, currentState.pieces, move);
      const newStateString = getBoardStateString(newBoard);

      if (visitedStates.has(newStateString)) continue;

      const newState = {
        board: newBoard,
        pieces: newPieces,
        stateString: newStateString,
        heuristic: heuristicFunc(newBoard, newPieces),
        moves: [...currentState.moves, move],
        cost: currentState.cost + 1, // Increment cost for each move
      };

      // Only add if we haven't exceeded the maximum cost
      if (newState.cost <= MAX_COST) {
        openList.push(newState);
      }
    }

    // Safety mechanism: if the open list gets too large, trim it
    // This prevents memory issues in complex puzzles
    if (openList.length > 10000) {
      openList.sort((a, b) => a.heuristic - b.heuristic);
      openList.splice(1000); // Keep only the 1000 most promising states
    }
  }

  const end = performance.now();
  return {
    solved: false,
    moves: [],
    nodesVisited,
    executionTime: end - start,
  };
};

export default greedy;
