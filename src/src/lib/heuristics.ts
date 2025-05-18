import type { Heuristic, PiecesMap } from "./types";

export const heuristics: Record<Heuristic, (board: string[][], pieces: PiecesMap) => number> = {
  manhattan: (_board, pieces) => {
    const primaryPiece = Object.values(pieces).find((p) => p.isPrimary)!;
    const exitPos = pieces["K"].positions[0];

    // For horizontal primary piece 
    if (primaryPiece.orientation === "horizontal") {
      // If exit is on the left, use leftmost position of primary piece
      if (exitPos.col < primaryPiece.positions[0].col) {
        const leftPos = primaryPiece.positions[0];
        return Math.abs(leftPos.row - exitPos.row) + Math.abs(leftPos.col - exitPos.col - 1);
      }
      // If exit is on the right, use rightmost position
      else {
        const rightPos = primaryPiece.positions[primaryPiece.positions.length - 1];
        return Math.abs(rightPos.row - exitPos.row) + Math.abs(rightPos.col + 1 - exitPos.col);
      }
    }
    // For vertical primary piece
    else {
      const distances = primaryPiece.positions.map((pos) => Math.abs(pos.row - exitPos.row) + Math.abs(pos.col - exitPos.col));
      return Math.min(...distances);
    }
  },

  blockingVehicles: (board, pieces) => {
    const primaryPiece = Object.values(pieces).find((p) => p.isPrimary)!;
    const exitPos = pieces["K"].positions[0];

    // For horizontal primary piece
    if (primaryPiece.orientation === "horizontal") {
      const row = primaryPiece.positions[0].row;

      // Exit on the left side
      if (exitPos.col < primaryPiece.positions[0].col) {
        const leftmostCol = primaryPiece.positions[0].col;
        let count = 0;
        // Count pieces between primary piece and exit
        for (let col = exitPos.col + 1; col < leftmostCol; col++) {
          if (board[row][col] !== "." && board[row][col] !== "K") {
            count++;
          }
        }
        return count;
      }
      // Exit on the right side
      else {
        const rightmostCol = primaryPiece.positions[primaryPiece.positions.length - 1].col;
        let count = 0;
        for (let col = rightmostCol + 1; col <= exitPos.col; col++) {
          if (board[row][col] !== "." && board[row][col] !== "K") {
            count++;
          }
        }
        return count;
      }
    }

    // For vertical primary piece
    const col = primaryPiece.positions[0].col;
    // Exit above primary piece
    if (exitPos.row < primaryPiece.positions[0].row) {
      const topmostRow = primaryPiece.positions[0].row;
      let count = 0;
      for (let row = exitPos.row + 1; row < topmostRow; row++) {
        if (board[row][col] !== "." && board[row][col] !== "K") {
          count++;
        }
      }
      return count;
    }
    // Exit below primary piece
    else {
      const bottommostRow = primaryPiece.positions[primaryPiece.positions.length - 1].row;
      let count = 0;
      for (let row = bottommostRow + 1; row <= exitPos.row; row++) {
        if (board[row][col] !== "." && board[row][col] !== "K") {
          count++;
        }
      }
      return count;
    }
  },

  combined: (board, pieces) => {
    return heuristics.manhattan(board, pieces) + 3 * heuristics.blockingVehicles(board, pieces);
  },
};
