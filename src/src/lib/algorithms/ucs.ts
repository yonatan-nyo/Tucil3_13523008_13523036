import { applyMove, getBoardStateString, getValidMoves, isSolved } from "../helpers";
import { PriorityQueue } from "../priorityQueue";
import type { Move, PiecesMap, SolutionResult } from "../types";

// Define state type for better type safety
interface SearchState {
  board: string[][];
  pieces: PiecesMap;
  stateString: string;
  cost: number;
  moves: Move[];
}

// Define internal solution type
interface Solution {
  cost: number;
  moves: Move[];
}

/**
 * Uniform Cost Search algorithm for finding the optimal solution
 */
const ucs = (initialBoard: string[][], initialPieces: PiecesMap): SolutionResult => {
  // Define a maximum cost to prevent infinite loops
  const MAX_COST = initialBoard.length * initialBoard[0].length * 5;

  const start = performance.now();
  const visitedStates = new Set<string>();
  const openList = new PriorityQueue<SearchState>((a, b) => a.cost - b.cost);
  let nodesVisited = 0;

  const initialState: SearchState = {
    board: initialBoard,
    pieces: initialPieces,
    stateString: getBoardStateString(initialBoard),
    cost: 0,
    moves: [],
  };

  openList.push(initialState);

  let bestSolution: Solution = {
    cost: Infinity,
    moves: [],
  };

  while (!openList.isEmpty()) {
    nodesVisited++;
    const currentState = openList.pop()!;

    if (visitedStates.has(currentState.stateString)) continue;
    visitedStates.add(currentState.stateString);

    if (isSolved(currentState.pieces)) {
      if (!bestSolution || currentState.cost < bestSolution.cost) {
        bestSolution = {
          cost: currentState.cost,
          moves: [...currentState.moves],
        };
      }

      const end = performance.now();
      return {
        solved: true,
        moves: currentState.moves,
        nodesVisited,
        executionTime: end - start,
      };
    }

    if (currentState.cost > MAX_COST) continue;

    const validMoves = getValidMoves(currentState.board, currentState.pieces);

    for (const move of validMoves) {
      const result = applyMove(currentState.board, currentState.pieces, move);
      const newStateString = getBoardStateString(result.board);

      if (visitedStates.has(newStateString)) continue;

      const newState: SearchState = {
        board: result.board,
        pieces: result.pieces,
        stateString: newStateString,
        cost: currentState.cost + 1,
        moves: [...currentState.moves, move],
      };

      openList.push(newState);
    }
  }

  const end = performance.now();
  return {
    solved: bestSolution !== null,
    moves: bestSolution?.moves ?? [],
    nodesVisited,
    executionTime: end - start,
  };
};

export default ucs;
