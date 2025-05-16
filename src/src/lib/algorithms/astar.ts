import { applyMove, getBoardStateString, getValidMoves, isSolved } from "../helpers";
import type { Move, PiecesMap, SolutionResult } from "../types";

const astar = (initialBoard: string[][], initialPieces: PiecesMap, heuristicFunc: (board: string[][], pieces: PiecesMap) => number): SolutionResult => {
  // Define a maximum cost based on board dimensions
  const MAX_COST = initialBoard.length * initialBoard[0].length * 5;

  const start = performance.now();
  const visitedStates = new Set<string>();
  const openList: Array<{
    board: string[][];
    pieces: PiecesMap;
    stateString: string;
    cost: number;
    heuristic: number;
    f: number;
    moves: Move[];
  }> = [];
  let nodesVisited = 0;

  const initialState = {
    board: initialBoard,
    pieces: initialPieces,
    stateString: getBoardStateString(initialBoard),
    cost: 0,
    heuristic: heuristicFunc(initialBoard, initialPieces),
    f: heuristicFunc(initialBoard, initialPieces),
    moves: [],
  };

  openList.push(initialState);

  while (openList.length > 0) {
    nodesVisited++;
    openList.sort((a, b) => a.f - b.f);
    const currentState = openList.shift()!;

    // Skip already visited states
    if (visitedStates.has(currentState.stateString)) continue;
    visitedStates.add(currentState.stateString);

    // Check if we have a solution
    if (isSolved(currentState.pieces)) {
      const end = performance.now();
      return {
        solved: true,
        moves: currentState.moves,
        nodesVisited,
        executionTime: end - start,
      };
    }

    // Skip if we've exceeded the maximum cost based on board dimensions
    if (currentState.cost > MAX_COST) continue;

    const validMoves = getValidMoves(currentState.board, currentState.pieces);

    for (const move of validMoves) {
      const { board: newBoard, pieces: newPieces } = applyMove(currentState.board, currentState.pieces, move);
      const newStateString = getBoardStateString(newBoard);

      // Skip already visited states
      if (visitedStates.has(newStateString)) continue;

      const newHeuristic = heuristicFunc(newBoard, newPieces);
      const newCost = currentState.cost + 1;

      // Skip if we'll exceed the maximum cost
      if (newCost > MAX_COST) continue;

      const newState = {
        board: newBoard,
        pieces: newPieces,
        stateString: newStateString,
        cost: newCost,
        heuristic: newHeuristic,
        f: newCost + newHeuristic,
        moves: [...currentState.moves, move],
      };

      openList.push(newState);
    }

    // Limit search space by node count for safety
    if (nodesVisited > 100000) {
      const end = performance.now();
      return {
        solved: false,
        moves: [],
        nodesVisited,
        executionTime: end - start,
      };
    }

    // Add periodic time check to prevent very long runs
    if (nodesVisited % 10000 === 0) {
      const currentTime = performance.now();
      if (currentTime - start > 30000) {
        // 30 second timeout
        const end = performance.now();
        return {
          solved: false,
          moves: [],
          nodesVisited,
          executionTime: end - start,
        };
      }
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

export default astar;
