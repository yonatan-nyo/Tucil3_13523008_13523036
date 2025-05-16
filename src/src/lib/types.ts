// --- Types ---
export type Direction = "atas" | "bawah" | "kiri" | "kanan";

export type PieceOrientation = "horizontal" | "vertical" | "unknown";

export interface Position {
  row: number;
  col: number;
}

export interface PieceInfo {
  positions: Position[];
  symbol: string;
  size?: number;
  orientation?: PieceOrientation;
  primaryPosition?: Position;
  isPrimary?: boolean;
  isExit?: boolean;
}

export type PiecesMap = Record<string, PieceInfo>;

export interface BoardConfig {
  dimensions: { A: number; B: number };
  numPieces: number;
  boardConfig: string[];
  finishLocation: Position;
}

export interface Move {
  piece: string;
  direction: Direction;
}

export interface SolutionResult {
  solved: boolean;
  moves: Move[];
  nodesVisited: number;
  executionTime: number;
}

export interface Stats {
  nodesVisited: number;
  executionTime: string;
  moves: number;
}

export type Algorithm = "greedy" | "ucs" | "astar";
export type Heuristic = "manhattan" | "blockingVehicles" | "combined";
