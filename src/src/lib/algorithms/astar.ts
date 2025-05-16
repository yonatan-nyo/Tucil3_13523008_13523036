import { applyMove, getBoardStateString, getValidMoves, isSolved } from "../helpers";
import { PriorityQueue } from "../priorityQueue";
import type { Move, PiecesMap, SolutionResult } from "../types";

interface SearchState {
  board: string[][];
  pieces: PiecesMap;
  stateString: string;
  cost: number;
  heuristic: number;
  f: number;
  moves: Move[];
}

const astar = (initialBoard: string[][], initialPieces: PiecesMap, heuristicFunc: (board: string[][], pieces: PiecesMap) => number): SolutionResult => {
  // Define a maximum cost based on board dimensions
  const MAX_COST = initialBoard.length * initialBoard[0].length * 5;

  const start = performance.now();
  const visitedStates = new Set<string>();

  const openList = new PriorityQueue<SearchState>((a, b) => a.f - b.f);

  let nodesVisited = 0;

  const initialState: SearchState = {
    board: initialBoard,
    pieces: initialPieces,
    stateString: getBoardStateString(initialBoard),
    cost: 0,
    heuristic: heuristicFunc(initialBoard, initialPieces),
    f: heuristicFunc(initialBoard, initialPieces),
    moves: [],
  };

  openList.push(initialState);

  while (!openList.isEmpty()) {
    nodesVisited++;
    const currentState = openList.pop()!;

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

      const newState: SearchState = {
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
