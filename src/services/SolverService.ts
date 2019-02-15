import words from '../assets/words.json';

type IBoard = string[][];

interface IResult {
  word: string;
  path: Array<{
    x: number;
    y: number;
  }>;
}

export function solveForBoard(board: IBoard) {
  return words;
}

function convertFlatBoardTo2D(letters: string[]): IBoard {
  return letters.reduce(
    (prev, curr, index) => {
      const chunk = Math.floor(index / 4);

      prev[chunk] = [...(prev[chunk] || []), curr];
      return prev;
    },
    [] as IBoard
  );
}
