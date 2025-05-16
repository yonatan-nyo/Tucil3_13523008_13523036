import { applyMove, getBoardStateString, getValidMoves, isSolved } from "../helpers";
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
 * Generic type-safe priority queue implementation
 */
class PriorityQueue<T> {
  private items: T[] = [];
  private readonly comparator: (a: T, b: T) => number;

  constructor(comparator: (a: T, b: T) => number) {
    this.comparator = comparator;
  }

  push(item: T): void {
    let index = this.items.length;
    this.items.push(item);

    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.comparator(this.items[parentIndex], this.items[index]) <= 0) break;
      [this.items[parentIndex], this.items[index]] = [this.items[index], this.items[parentIndex]];
      index = parentIndex;
    }
  }

  pop(): T | undefined {
    if (this.isEmpty()) return undefined;

    const result = this.items[0];
    const last = this.items.pop()!;

    if (this.items.length > 0) {
      this.items[0] = last;
      this.heapify(0);
    }

    return result;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }

  private heapify(index: number): void {
    const left = 2 * index + 1;
    const right = 2 * index + 2;
    let smallest = index;

    if (left < this.items.length && this.comparator(this.items[left], this.items[smallest]) < 0) {
      smallest = left;
    }

    if (right < this.items.length && this.comparator(this.items[right], this.items[smallest]) < 0) {
      smallest = right;
    }

    if (smallest !== index) {
      [this.items[index], this.items[smallest]] = [this.items[smallest], this.items[index]];
      this.heapify(smallest);
    }
  }
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
