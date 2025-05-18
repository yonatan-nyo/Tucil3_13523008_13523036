import type { PiecesMap } from "../types";

const getPiecesInfo = (boardConfig: string[]): PiecesMap => {
  const pieces: PiecesMap = {};
  const boardMatrix = boardConfig.map((row) => row.split(""));
  const visited = new Set<string>();
  const usedSymbols = new Set<string>();
  let pieceCount = 0;

  const MAX_PIECES = 24;

  // Helper function to check if a cell should be ignored
  const isIgnoredCell = (cell: string) => cell === "." || cell === " ";

  // Helper function to check if two cells should be considered part of the same piece
  const isSamePiece = (cell1: string, cell2: string) => {
    // If either cell is to be ignored, they're not the same piece
    if (isIgnoredCell(cell1) || isIgnoredCell(cell2)) return false;

    // Only compare alphabetic characters
    const isAlphaChar = (char: string) => /^[A-Za-z]$/.test(char);

    if (isAlphaChar(cell1) && isAlphaChar(cell2)) {
      return cell1 === cell2;
    }

    return false;
  };

  // find all pieces and their positions
  for (let i = 0; i < boardMatrix.length; i++) {
    for (let j = 0; j < boardMatrix[i].length; j++) {
      const cell = boardMatrix[i][j];
      const posKey = `${i},${j}`;

      if (visited.has(posKey)) continue;

      // Skip periods and spaces
      if (isIgnoredCell(cell)) {
        visited.add(posKey);
        continue;
      }

      if (cell !== "K") {
        if (usedSymbols.has(cell)) {
          throw new Error(`Duplicate piece symbol '${cell}' detected. Each letter can only be used once.`);
        }

        if (pieceCount >= MAX_PIECES) {
          throw new Error(`Maximum number of pieces (${MAX_PIECES}) exceeded.`);
        }

        const contiguousCells: { row: number; col: number }[] = [];
        const queue: { row: number; col: number }[] = [{ row: i, col: j }];
        const cellVisited = new Set<string>();
        cellVisited.add(posKey);

        while (queue.length > 0) {
          const current = queue.shift()!;
          contiguousCells.push(current);
          visited.add(`${current.row},${current.col}`);

          const directions = [
            [-1, 0],
            [1, 0],
            [0, -1],
            [0, 1],
          ];
          for (const [dx, dy] of directions) {
            const newRow = current.row + dx;
            const newCol = current.col + dy;
            const newPosKey = `${newRow},${newCol}`;

            if (newRow >= 0 && newRow < boardMatrix.length && newCol >= 0 && newCol < boardMatrix[newRow].length && isSamePiece(boardMatrix[newRow][newCol], cell) && !cellVisited.has(newPosKey)) {
              queue.push({ row: newRow, col: newCol });
              cellVisited.add(newPosKey);
            }
          }
        }

        pieces[cell] = {
          positions: contiguousCells,
          symbol: cell,
        };
        usedSymbols.add(cell);
        pieceCount++;
      } else if (cell === "K") {
        pieces["K"] = { positions: [{ row: i, col: j }], symbol: "K", isExit: true };
        visited.add(posKey);
      }
    }
  }

  // Rest of the function remains the same
  Object.values(pieces).forEach((piece) => {
    if (piece.isExit) return;
    const { positions } = piece;
    piece.size = positions.length;

    // Determine orientation
    if (positions.length > 1) {
      const sameRow = positions.every((pos) => pos.row === positions[0].row);
      piece.orientation = sameRow ? "horizontal" : "vertical";

      // Additional check to ensure the piece is truly contiguous
      if (piece.orientation === "horizontal") {
        positions.sort((a, b) => a.col - b.col);
        for (let i = 1; i < positions.length; i++) {
          if (positions[i].col !== positions[i - 1].col + 1) {
            throw new Error(`Piece ${piece.symbol} has non-contiguous horizontal positions. Each piece must form a continuous line.`);
          }
        }
      } else {
        positions.sort((a, b) => a.row - b.row);
        for (let i = 1; i < positions.length; i++) {
          if (positions[i].row !== positions[i - 1].row + 1) {
            throw new Error(`Piece ${piece.symbol} has non-contiguous vertical positions. Each piece must form a continuous line.`);
          }
        }
      }
    } else {
      piece.orientation = "unknown";
    }

    piece.primaryPosition = positions[0];
    piece.isPrimary = piece.symbol === "P";
  });

  return pieces;
};

export default getPiecesInfo;
