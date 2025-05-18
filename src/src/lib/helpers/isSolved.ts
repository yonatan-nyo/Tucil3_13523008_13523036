import type { PiecesMap } from "../types";

const isSolved = (pieces: PiecesMap): boolean => {
  const primaryPiece = Object.values(pieces).find((p) => p.isPrimary);
  if (!primaryPiece) return false;
  const exitPiece = pieces["K"];
  if (!exitPiece) return false;
  const exitPos = exitPiece.positions[0];

  // For a typical Rush Hour puzzle with horizontal primary piece:
  if (primaryPiece.orientation === "horizontal") {
    // Get leftmost position of primary piece
    const leftmostPos = primaryPiece.positions[0];

    // If exit is on the left side, primary piece should be adjacent to exit
    if (exitPos.col < leftmostPos.col) {
      return leftmostPos.row === exitPos.row && leftmostPos.col === exitPos.col + 1;
    }
    // If exit is on the right side
    else if (exitPos.col > primaryPiece.positions[primaryPiece.positions.length - 1].col) {
      const rightmostPos = primaryPiece.positions[primaryPiece.positions.length - 1];
      return rightmostPos.row === exitPos.row && rightmostPos.col + 1 === exitPos.col;
    }
  }
  // For vertical primary piece (less common but possible)
  else if (primaryPiece.orientation === "vertical") {
    const topmostPos = primaryPiece.positions[0];
    const bottommostPos = primaryPiece.positions[primaryPiece.positions.length - 1];

    // Exit at the top
    if (exitPos.row < topmostPos.row) {
      return topmostPos.col === exitPos.col && topmostPos.row === exitPos.row + 1;
    }
    // Exit at the bottom
    else if (exitPos.row > bottommostPos.row) {
      return bottommostPos.col === exitPos.col && bottommostPos.row + 1 === exitPos.row;
    }
  }

  // Special case: If the primary piece is already at the exit position
  // (This could happen in some puzzle variations)
  return primaryPiece.positions.some((pos) => pos.row === exitPos.row && pos.col === exitPos.col);
};

export default isSolved;
