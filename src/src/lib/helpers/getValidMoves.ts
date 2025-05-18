import { DIRECTIONS } from "../constant";
import type { Move, PiecesMap } from "../types";

const getValidMoves = (board: string[][], pieces: PiecesMap): Move[] => {
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
          } else if (leftCell === "K" && piece.isPrimary) {
            // Allow primary piece to move left into exit
            stepsLeft++;
            moves.push({
              piece: symbol,
              direction: DIRECTIONS.LEFT,
              steps: stepsLeft,
            });
            canMove = false;
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
          } else if (rightCell === "K" && piece.isPrimary) {
            // Allow primary piece to move right into exit
            stepsRight++;
            moves.push({
              piece: symbol,
              direction: DIRECTIONS.RIGHT,
              steps: stepsRight,
            });
            canMove = false;
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
          } else if (topCell === "K" && piece.isPrimary) {
            // Allow primary piece to move up into exit
            stepsUp++;
            moves.push({
              piece: symbol,
              direction: DIRECTIONS.UP,
              steps: stepsUp,
            });
            canMove = false;
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
          } else if (bottomCell === "K" && piece.isPrimary) {
            // Allow primary piece to move down into exit
            stepsDown++;
            moves.push({
              piece: symbol,
              direction: DIRECTIONS.DOWN,
              steps: stepsDown,
            });
            canMove = false;
          } else {
            canMove = false;
          }
        }
      }
    }
  });

  return moves;
};

export default getValidMoves;
