import type { BoardConfig } from "../types";

const parseInputFile = (content: string): BoardConfig => {
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
    console.log(isKOnTheLeft, isKOnTheTop, isKOnTheRight, isKOnTheBottom);
    if (isKOnTheLeft && isKOnTheTop) {
      if (!row.includes("K")) {
        if (row.length !== width) {
          throw new Error(`Each row without K must have exactly ${width} columns.`);
        }
      }
    } else if (isKOnTheLeft && isKOnTheBottom) {
      if (!row.includes("K")) {
        if (row.length !== width) {
          throw new Error(`Each row without K must have exactly ${width} columns.`);
        }
      }
    } else if (isKOnTheRight && isKOnTheTop) {
      if (!row.includes("K")) {
        if (row.length !== width) {
          throw new Error(`Each row without K must have exactly ${width} columns.`);
        }
      }
    } else if (isKOnTheRight && isKOnTheBottom) {
      if (!row.includes("K")) {
        if (row.length !== width) {
          throw new Error(`Each row without K must have exactly ${width} columns.`);
        }
      }
    } else if (isKOnTheLeft) {
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
  let primaryPieceCol = -1;
  for (let i = 0; i < boardConfig.length; i++) {
    const pIndex = boardConfig[i].indexOf("P");
    if (pIndex !== -1) {
      primaryPieceCol = pIndex;
      break;
    }
  }

  if (primaryPieceCol === -1) {
    throw new Error("Primary piece (P) not found on the board.");
  }

  if (isKOnTheBottom || isKOnTheTop) {
    const kRow = isKOnTheBottom ? height : 0;
    const bottomRow = boardConfig[kRow];
    const kIndex = bottomRow.indexOf("K");

    if (kIndex !== primaryPieceCol) {
      throw new Error("Exit (K) must be aligned with the primary piece (P).");
    }
  }
  const uniquePieceSymbols = new Set<string>();
  boardConfig.forEach((row) => {
    for (const char of row) {
      if (char !== "." && char !== " " && char !== "K" && char !== "P") {
        uniquePieceSymbols.add(char);
      }
    }
  });

  const actualPieceCount = uniquePieceSymbols.size;
  if (actualPieceCount !== N) {
    throw new Error(
      `Mismatch in piece count: Input specifies ${N} pieces, but ${actualPieceCount} unique pieces found on board.`
    );
  }

  const piecePositions: Record<string, { row: number; col: number }[]> = {};

  boardConfig.forEach((row, rowIdx) => {
    for (let colIdx = 0; colIdx < row.length; colIdx++) {
      const char = row[colIdx];
      if (char !== "." && char !== " " && char !== "K") {
        if (!piecePositions[char]) {
          piecePositions[char] = [];
        }
        piecePositions[char].push({ row: rowIdx, col: colIdx });
      }
    }
  });

  for (const [piece, positions] of Object.entries(piecePositions)) {
    const minRow = Math.min(...positions.map((p) => p.row));
    const maxRow = Math.max(...positions.map((p) => p.row));
    const minCol = Math.min(...positions.map((p) => p.col));
    const maxCol = Math.max(...positions.map((p) => p.col));

    const height = maxRow - minRow + 1;
    const width = maxCol - minCol + 1;
    const expectedPositions = height * width;

    if (positions.length !== expectedPositions) {
      throw new Error(`Piece ${piece} is not a solid rectangle.`);
    }

    if (width === 1 && height === 1) {
      throw new Error(`Piece ${piece} is a single square. It should be at least 2x1 or 1x2.`);
    }

    if (width !== 1 && height !== 1) {
      throw new Error(`Piece ${piece} has invalid dimensions (${width}x${height}). At least one dimension must be 1.`);
    }

    for (let r = minRow; r <= maxRow; r++) {
      for (let c = minCol; c <= maxCol; c++) {
        if (!positions.some((p) => p.row === r && p.col === c)) {
          throw new Error(`Piece ${piece} is not solid (missing position at row ${r}, col ${c}).`);
        }
      }
    }
  }

  return {
    dimensions: { A: width, B: height },
    numPieces: N,
    boardConfig,
    finishLocation: { col: kLocation.col, row: kLocation.row },
  };
};

export default parseInputFile;
