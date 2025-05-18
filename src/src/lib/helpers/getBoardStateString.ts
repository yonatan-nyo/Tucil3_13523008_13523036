const getBoardStateString = (board: string[][]): string => {
  return board.map((row) => row.join("")).join("");
};

export default getBoardStateString;
