import type { Direction, Move, PiecesMap, Position } from "../types";
import deepCopy from "./deepCopy";

const applyMove = (board: string[][], pieces: PiecesMap, move: Move): { board: string[][]; pieces: PiecesMap } => {
  const { piece, direction, steps = 1 } = move;
  const newBoard = deepCopy(board);
  const newPieces = { ...pieces };
  const pieceInfo = newPieces[piece];

  if (!pieceInfo) {
    throw new Error(`Piece ${piece} not found`);
  }

  // Get updated positions after clearing the current piece
  const positions = [...pieceInfo.positions];

  // Clear current piece positions on the board
  for (const pos of positions) {
    newBoard[pos.row][pos.col] = ".";
  }

  // Calculate new positions based on direction and steps
  let newPositions: Position[] = [];

  for (let i = 0; i < steps; i++) {
    if (i === 0) {
      // First step uses the original positions
      newPositions = calculateNewPositions(positions, direction);
    } else {
      // Further steps use the updated positions
      newPositions = calculateNewPositions(newPositions, direction);
    }

    // Check if any of the new positions would be off the board or collide with other pieces
    if (!arePositionsValid(newPositions, newBoard)) {
      // If invalid, revert to the last valid step
      if (i > 0) {
        // Use the last valid positions
        break;
      } else {
        // If even the first step is invalid, revert to original
        newPositions = positions;
        break;
      }
    }
  }

  // Update the piece information with new positions
  newPieces[piece] = {
    ...pieceInfo,
    positions: newPositions,
  };

  // Place the piece at its new positions
  for (const pos of newPositions) {
    newBoard[pos.row][pos.col] = piece;
  }

  return { board: newBoard, pieces: newPieces };
};

/**
 * Calculate new positions based on a direction
 */
function calculateNewPositions(positions: Position[], direction: Direction): Position[] {
  return positions.map((pos) => {
    const newPos = { ...pos };

    switch (direction) {
      case "atas":
        newPos.row -= 1;
        break;
      case "bawah":
        newPos.row += 1;
        break;
      case "kiri":
        newPos.col -= 1;
        break;
      case "kanan":
        newPos.col += 1;
        break;
    }

    return newPos;
  });
}

/**
 * Check if positions are valid (on the board and not occupied)
 */
function arePositionsValid(positions: Position[], board: string[][]): boolean {
  return positions.every((pos) => {
    // Check bounds
    if (pos.row < 0 || pos.row >= board.length || pos.col < 0 || pos.col >= board[0].length) {
      return false;
    }

    // Check if position is empty (or an exit 'K')
    return board[pos.row][pos.col] === "." || board[pos.row][pos.col] === "K";
  });
}

export default applyMove;
