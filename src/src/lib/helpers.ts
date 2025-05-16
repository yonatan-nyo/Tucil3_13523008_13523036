import { DIRECTIONS } from "./constant";
import type { BoardConfig, Move, PiecesMap } from "./types";

export const deepCopy = <T>(arr: T[][]): T[][] => arr.map((row) => [...row]);

export const parseInputFile = (content: string): BoardConfig => {
  const lines = content.replace(/\r/g, "").trim().split("\n");
  if (lines.length < 2) {
    throw new Error("Input file must have at least 2 lines (dimensions and numPieces).");
  }

  const [dimensions, numPieces, ...boardConfig] = lines;
  const [width, height] = dimensions.split(" ").map(Number);
  const N = parseInt(numPieces);

  if (!Number.isInteger(width) || !Number.isInteger(height) || width <= 0 || height <= 0) {
    throw new Error("Invalid board dimensions.");
  }
  if (!Number.isInteger(N) || N < 0) {
    throw new Error("Invalid number of pieces.");
  }
  const kLocation = { col: -1, row: -1 };
  for (let i = 0; i < boardConfig.length; i++) {
    const row = boardConfig[i];
    if (row.includes("K")) {
      if (kLocation.col !== -1) {
        throw new Error("There should be only one K in the board.");
      }
      kLocation.row = i;
      kLocation.col = row.indexOf("K");
    }
  }
  if (kLocation.col === -1 || kLocation.row === -1) {
    throw new Error("There should be one K in the board.");
  }
  const isKOnTheLeft = kLocation.col === 0 && kLocation.col < height;
  const isKOnTheTop = kLocation.col <= width && kLocation.row === 0;
  const isKOnTheRight = kLocation.col === width && kLocation.row < height;
  const isKOnTheBottom = kLocation.col < width && kLocation.row === height;

  if (!isKOnTheLeft && !isKOnTheTop && !isKOnTheRight && !isKOnTheBottom) {
    throw new Error("K shouldnt be in the middle of the board.");
  }

  // Validate boardConfig
  if (boardConfig.length !== height + (isKOnTheTop || isKOnTheBottom ? 1 : 0)) {
    throw new Error(`Expected ${height} rows in boardConfig, got ${boardConfig.length}.`);
  }
  boardConfig.forEach((row, idx) => {
    if (isKOnTheLeft) {
      if (row.length !== width + 1) {
        throw new Error(`Each row must have ${width + 1} columns.`);
      }
    } else if (isKOnTheRight) {
      if (row.includes("K")) {
        if (row.length !== width + 1) {
          throw new Error(`Each row must have ${width + 1} columns.`);
        }
      } else {
        if (row.length !== width && row.length !== width + 1) {
          throw new Error(`Each row must have ${width} or ${width + 1} columns.`);
        }
      }
    } else if (isKOnTheTop) {
      if (idx != 0) {
        if (row.length !== width) {
          throw new Error(`Each row must have ${width} columns.`);
        }
      }
    } else if (isKOnTheBottom) {
      if (idx != height) {
        if (row.length !== width) {
          throw new Error(`Each row must have ${width} columns.`);
        }
      }
    } else {
      throw new Error(`Unknown K location.`);
    }
  });

  return {
    dimensions: { A: width, B: height },
    numPieces: N,
    boardConfig,
    finishLocation: { col: kLocation.col, row: kLocation.row },
  };
};

export const getPiecesInfo = (boardConfig: string[]): PiecesMap => {
  const pieces: PiecesMap = {};
  const boardMatrix = boardConfig.map((row) => row.split(""));
  const visited = new Set<string>();
  const usedSymbols = new Set<string>();
  let pieceCount = 0;
  
  const MAX_PIECES = 24;

  // find all pieces and their positions
  for (let i = 0; i < boardMatrix.length; i++) {
    for (let j = 0; j < boardMatrix[i].length; j++) {
      const cell = boardMatrix[i][j];
      const posKey = `${i},${j}`;

      if (visited.has(posKey)) continue;

      if (cell !== "." && cell !== "K") {
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

            if (
              newRow >= 0 &&
              newRow < boardMatrix.length &&
              newCol >= 0 &&
              newCol < boardMatrix[newRow].length &&
              boardMatrix[newRow][newCol] === cell &&
              !cellVisited.has(newPosKey)
            ) {
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

  // compute piece properties
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

export const getBoardStateString = (board: string[][]): string => {
  return board.map((row) => row.join("")).join("");
};

export const getValidMoves = (board: string[][], pieces: PiecesMap): Move[] => {
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

      // Check left move - special case for primary piece and exit on left
      if (leftmostPos.col > 0 && !(isExitOnLeft && leftmostPos.col === 1 && !piece.isPrimary)) {
        const leftCell = board[leftmostPos.row][leftmostPos.col - 1];
        if (leftCell === ".") {
          moves.push({ piece: symbol, direction: DIRECTIONS.LEFT });
        } else if (leftCell === "K" && piece.isPrimary) {
          // Allow primary piece to move left into exit
          moves.push({ piece: symbol, direction: DIRECTIONS.LEFT });
        }
      }

      // Check right move
      const rightmostPos = piece.positions[piece.positions.length - 1];
      const rightPos = rightmostPos.col + 1;
      if (rightPos < boardWidth && !(isExitOnRight && rightPos === boardWidth - 1 && !piece.isPrimary)) {
        const rightCell = board[rightmostPos.row][rightPos];
        if (rightCell === ".") {
          moves.push({ piece: symbol, direction: DIRECTIONS.RIGHT });
        } else if (rightCell === "K" && piece.isPrimary) {
          // Allow primary piece to move right into exit
          moves.push({ piece: symbol, direction: DIRECTIONS.RIGHT });
        }
      }
    } else if (orientation === "vertical") {
      const topmostPos = piece.positions[0];

      // Check up move
      if (topmostPos.row > 0 && !(isExitOnTop && topmostPos.row === 1 && !piece.isPrimary)) {
        const topCell = board[topmostPos.row - 1][topmostPos.col];
        if (topCell === ".") {
          moves.push({ piece: symbol, direction: DIRECTIONS.UP });
        } else if (topCell === "K" && piece.isPrimary) {
          // Allow primary piece to move up into exit if exit is at the top
          moves.push({ piece: symbol, direction: DIRECTIONS.UP });
        }
      }

      // Check down move
      const bottommostPos = piece.positions[piece.positions.length - 1];
      if (bottommostPos.row + 1 < boardHeight && !(isExitOnBottom && bottommostPos.row === boardHeight - 2 && !piece.isPrimary)) {
        const bottomCell = board[bottommostPos.row + 1][bottommostPos.col];
        if (bottomCell === ".") {
          moves.push({ piece: symbol, direction: DIRECTIONS.DOWN });
        } else if (bottomCell === "K" && piece.isPrimary) {
          // Allow primary piece to move down into exit if exit is at the bottom
          moves.push({ piece: symbol, direction: DIRECTIONS.DOWN });
        }
      }
    }
  });

  return moves;
};

export const applyMove = (board: string[][], pieces: PiecesMap, move: Move): { board: string[][]; pieces: PiecesMap } => {
  const newBoard = deepCopy(board);
  const { piece: pieceSymbol, direction } = move;
  const piece = pieces[pieceSymbol];
  if (!piece.orientation) return { board: newBoard, pieces: { ...pieces } };
  const { orientation, positions } = piece;
  const newPositions = [...positions];

  if (orientation === "horizontal") {
    if (direction === DIRECTIONS.LEFT) {
      const rightmostPos = positions[positions.length - 1];
      newBoard[rightmostPos.row][rightmostPos.col] = ".";
      const newLeftPos = { row: positions[0].row, col: positions[0].col - 1 };
      newBoard[newLeftPos.row][newLeftPos.col] = pieceSymbol;
      newPositions.pop();
      newPositions.unshift(newLeftPos);
    } else if (direction === DIRECTIONS.RIGHT) {
      const leftmostPos = positions[0];
      newBoard[leftmostPos.row][leftmostPos.col] = ".";
      const newRightPos = {
        row: positions[positions.length - 1].row,
        col: positions[positions.length - 1].col + 1,
      };
      if (newBoard[newRightPos.row][newRightPos.col] === "K") {
        // keep K visible
      } else {
        newBoard[newRightPos.row][newRightPos.col] = pieceSymbol;
      }
      newPositions.shift();
      newPositions.push(newRightPos);
    }
  } else if (orientation === "vertical") {
    if (direction === DIRECTIONS.UP) {
      const bottommostPos = positions[positions.length - 1];
      newBoard[bottommostPos.row][bottommostPos.col] = ".";
      const newTopPos = { row: positions[0].row - 1, col: positions[0].col };
      newBoard[newTopPos.row][newTopPos.col] = pieceSymbol;
      newPositions.pop();
      newPositions.unshift(newTopPos);
    } else if (direction === DIRECTIONS.DOWN) {
      const topmostPos = positions[0];
      newBoard[topmostPos.row][topmostPos.col] = ".";
      const newBottomPos = {
        row: positions[positions.length - 1].row + 1,
        col: positions[positions.length - 1].col,
      };
      newBoard[newBottomPos.row][newBottomPos.col] = pieceSymbol;
      newPositions.shift();
      newPositions.push(newBottomPos);
    }
  }

  const newPieces = { ...pieces };
  newPieces[pieceSymbol] = {
    ...piece,
    positions: newPositions,
    primaryPosition: newPositions[0],
  };

  return { board: newBoard, pieces: newPieces };
};

// Fixed isSolved function for Rush Hour puzzles
export const isSolved = (pieces: PiecesMap): boolean => {
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
