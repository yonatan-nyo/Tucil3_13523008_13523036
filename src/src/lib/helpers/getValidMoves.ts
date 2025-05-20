import { DIRECTIONS } from "../constant";
import type { Move, PiecesMap } from "../types";

const getValidMoves = (board: string[][], pieces: PiecesMap): Move[] => {
  if (isPrimaryPieceAdjacentToExit(pieces)) {
    return [];
  }

  const moves: Move[] = [];
  const boardHeight = board.length;
  const boardWidth = board[0].length;

  // Find exit location
  const exitPiece = pieces["K"];
  const exitPos = exitPiece?.positions[0];

  const isExitOnLeft = exitPos?.col === 0 && exitPos.row < boardHeight;
  const isExitOnTop = exitPos?.row === 0 && exitPos.col < boardWidth;
  const isExitOnRight = exitPos?.col === boardWidth - 1 && exitPos.row < boardHeight;
  const isExitOnBottom = exitPos?.row === boardHeight - 1 && exitPos.col < boardWidth;

  Object.values(pieces).forEach((piece) => {
    if (piece.isExit) return;
    const { orientation, symbol } = piece;
    if (!orientation) return;

    if (orientation === "horizontal") {
      const leftmostPos = piece.positions[0];

      // Check left moves - with multiple steps
      if (leftmostPos.col > 0 && !(isExitOnLeft && leftmostPos.col === 1 && !piece.isPrimary)) {
        // Check how many consecutive empty spaces to the left
        let stepsLeft = 0;
        let canMove = true;

        while (canMove && leftmostPos.col - stepsLeft - 1 >= 0) {
          const leftCell = board[leftmostPos.row][leftmostPos.col - stepsLeft - 1];

          if (leftCell === ".") {
            stepsLeft++;
            // Add a move for each valid step count
            moves.push({
              piece: symbol,
              direction: DIRECTIONS.LEFT,
              steps: stepsLeft,
            });
          } else {
            canMove = false;
          }
        }
      }

      // Check right moves - with multiple steps
      const rightmostPos = piece.positions[piece.positions.length - 1];
      if (rightmostPos.col < boardWidth - 1 && !(isExitOnRight && rightmostPos.col === boardWidth - 2 && !piece.isPrimary)) {
        // Check how many consecutive empty spaces to the right
        let stepsRight = 0;
        let canMove = true;

        while (canMove && rightmostPos.col + stepsRight + 1 < boardWidth) {
          const rightCell = board[rightmostPos.row][rightmostPos.col + stepsRight + 1];

          if (rightCell === ".") {
            stepsRight++;
            // Add a move for each valid step count
            moves.push({
              piece: symbol,
              direction: DIRECTIONS.RIGHT,
              steps: stepsRight,
            });
          } else {
            canMove = false;
          }
        }
      }
    } else if (orientation === "vertical") {
      const topmostPos = piece.positions[0];

      // Check up moves - with multiple steps
      if (topmostPos.row > 0 && !(isExitOnTop && topmostPos.row === 1 && !piece.isPrimary)) {
        // Check how many consecutive empty spaces upwards
        let stepsUp = 0;
        let canMove = true;

        while (canMove && topmostPos.row - stepsUp - 1 >= 0) {
          const topCell = board[topmostPos.row - stepsUp - 1][topmostPos.col];

          if (topCell === ".") {
            stepsUp++;
            // Add a move for each valid step count
            moves.push({
              piece: symbol,
              direction: DIRECTIONS.UP,
              steps: stepsUp,
            });
          } else {
            canMove = false;
          }
        }
      }

      // Check down moves - with multiple steps
      const bottommostPos = piece.positions[piece.positions.length - 1];
      if (bottommostPos.row < boardHeight - 1 && !(isExitOnBottom && bottommostPos.row === boardHeight - 2 && !piece.isPrimary)) {
        // Check how many consecutive empty spaces downwards
        let stepsDown = 0;
        let canMove = true;

        while (canMove && bottommostPos.row + stepsDown + 1 < boardHeight) {
          const bottomCell = board[bottommostPos.row + stepsDown + 1][bottommostPos.col];

          if (bottomCell === ".") {
            stepsDown++;
            // Add a move for each valid step count
            moves.push({
              piece: symbol,
              direction: DIRECTIONS.DOWN,
              steps: stepsDown,
            });
          } else {
            canMove = false;
          }
        }
      }
    }
  });

  return moves;
};

// Helper function to check if primary piece is adjacent to exit
function isPrimaryPieceAdjacentToExit(pieces: PiecesMap): boolean {
  const primaryPiece = Object.values(pieces).find(p => p.isPrimary);
  const exitPiece = pieces["K"];
  
  if (!primaryPiece || !exitPiece) return false;
  
  const exitPos = exitPiece.positions[0];
  const primaryPositions = primaryPiece.positions;
  
  if (primaryPiece.orientation === "horizontal") {
    const leftPos = primaryPositions[0];
    const rightPos = primaryPositions[primaryPositions.length - 1];
    
    // Check if exit is to the left or right of the primary piece
    return (
      // Exit is to the left
      (exitPos.row === leftPos.row && exitPos.col === leftPos.col - 1) ||
      // Exit is to the right
      (exitPos.row === rightPos.row && exitPos.col === rightPos.col + 1)
    );
  } else { // vertical
    const topPos = primaryPositions[0];
    const bottomPos = primaryPositions[primaryPositions.length - 1];
    
    // Check if exit is above or below the primary piece
    return (
      // Exit is above
      (exitPos.col === topPos.col && exitPos.row === topPos.row - 1) ||
      // Exit is below
      (exitPos.col === bottomPos.col && exitPos.row === bottomPos.row + 1)
    );
  }
}

export default getValidMoves;
