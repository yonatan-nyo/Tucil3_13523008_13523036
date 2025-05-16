import { applyMove, getBoardStateString, getValidMoves, isSolved } from "../helpers";
import { PriorityQueue } from "../priorityQueue";
import type { Move, PiecesMap, SolutionResult } from "../types";

interface SearchState {
  board: string[][];
  pieces: PiecesMap;
  stateString: string;
  heuristic: number;
  moves: Move[];
  cost: number;
}

const greedy = (initialBoard: string[][], initialPieces: PiecesMap, heuristicFunc: (board: string[][], pieces: PiecesMap) => number): SolutionResult => {
  // Define a maximum cost to prevent infinite loops
  const MAX_COST = initialBoard.length * initialBoard[0].length * 5;

  const start = performance.now();
  const visitedStates = new Set<string>();

  // Use priority queue for efficient state selection
  const openList = new PriorityQueue<SearchState>((a, b) => a.heuristic - b.heuristic);

  let nodesVisited = 0;

  const initialState: SearchState = {
    board: initialBoard,
    pieces: initialPieces,
    stateString: getBoardStateString(initialBoard),
    heuristic: heuristicFunc(initialBoard, initialPieces),
    moves: [],
    cost: 0,
  };

  openList.push(initialState);

  while (!openList.isEmpty()) {
    nodesVisited++;

    // Get the state with the lowest heuristic value
    const currentState = openList.pop()!;

    // Skip if already visited
    if (visitedStates.has(currentState.stateString)) continue;
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

    const validMoves = getValidMoves(currentState.board, currentState.pieces);

    for (const move of validMoves) {
      const { board: newBoard, pieces: newPieces } = applyMove(currentState.board, currentState.pieces, move);
      const newStateString = getBoardStateString(newBoard);

      // Skip already visited states
      if (visitedStates.has(newStateString)) continue;

      const newHeuristic = heuristicFunc(newBoard, newPieces);
      const newCost = currentState.cost + 1;

      // Only add if we haven't exceeded the maximum cost
      if (newCost <= MAX_COST) {
        const newState: SearchState = {
          board: newBoard,
          pieces: newPieces,
          stateString: newStateString,
          heuristic: newHeuristic,
          moves: [...currentState.moves, move],
          cost: newCost,
        };

        openList.push(newState);
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

export default greedy;
