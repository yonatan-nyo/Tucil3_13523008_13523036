import applyMove from "../helpers/applyMove";
import getBoardStateString from "../helpers/getBoardStateString";
import getValidMoves from "../helpers/getValidMoves";
import isSolved from "../helpers/isSolved";
import { heuristics } from "../heuristics";
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

const fringe = (
  initialBoard: string[][],
  initialPieces: PiecesMap,
  heuristicFunc: (board: string[][], pieces: PiecesMap) => number
): SolutionResult => {
  const MAX_COST = initialBoard.length * initialBoard[0].length * 50;
  const start = performance.now();
  let nodesVisited = 0;

  const useHybridHeuristic = heuristicFunc === heuristics.blockingVehicles || heuristicFunc === heuristics.combined;

  const getH = (board: string[][], pieces: PiecesMap) => {
    if (useHybridHeuristic) {
      return Math.max(1, Math.min(heuristics.manhattan(board, pieces), heuristicFunc(board, pieces)));
    }
    return heuristicFunc(board, pieces);
  };

  const gValues = new Map<string, number>();
  const initialState: SearchState = {
    board: initialBoard,
    pieces: initialPieces,
    stateString: getBoardStateString(initialBoard),
    cost: 0,
    heuristic: getH(initialBoard, initialPieces),
    f: getH(initialBoard, initialPieces),
    moves: [],
  };
  gValues.set(initialState.stateString, 0);

  let now: SearchState[] = [initialState];
  let later: SearchState[] = [];
  let fLimit = initialState.f;

  while (now.length > 0 || later.length > 0) {
    if (now.length === 0) {
      if (later.length === 0) break;

      let nextF = Infinity;
      for (const state of later) {
        nextF = Math.min(nextF, state.f);
      }

      now = later.filter((state) => state.f === nextF);
      later = later.filter((state) => state.f > nextF);

      fLimit = nextF;

      if (fLimit >= MAX_COST) break;
    }

    const state = now.shift()!;
    nodesVisited++;

    if (isSolved(state.pieces)) {
      const end = performance.now();
      return {
        solved: true,
        moves: state.moves,
        nodesVisited,
        executionTime: end - start,
      };
    }

    if (state.cost >= MAX_COST) continue;

    const validMoves = getValidMoves(state.board, state.pieces);
    for (const move of validMoves) {
      const { board: newBoard, pieces: newPieces } = applyMove(state.board, state.pieces, move);
      const newStateString = getBoardStateString(newBoard);
      const newG = state.cost + 1;

      const existingG = gValues.get(newStateString);
      if (existingG !== undefined && existingG <= newG) continue;
      gValues.set(newStateString, newG);

      const newH = getH(newBoard, newPieces);
      const newF = newG + newH;
      const newState: SearchState = {
        board: newBoard,
        pieces: newPieces,
        stateString: newStateString,
        cost: newG,
        heuristic: newH,
        f: newF,
        moves: [...state.moves, move],
      };

      if (newF <= fLimit) {
        now.unshift(newState);
      } else {
        later.push(newState);
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

export default fringe;
