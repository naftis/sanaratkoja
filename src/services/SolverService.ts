import wordlist from '../assets/words.json';

type IBoard = string[][];

interface IResult {
  word: string;
  path: Array<{
    x: number;
    y: number;
  }>;
}

function organizeWordsByFirstLetter(words: string[]) {
  const groups: {
    [letter: string]: string[];
  } = {};

  for (const word of words) {
    const firstLetter = word[0];

    if (!/^[a-z]$/.test(firstLetter)) {
      continue;
    }

    if (Array.isArray(groups[firstLetter])) {
      groups[firstLetter].push(word);
    } else {
      groups[firstLetter] = [word];
    }
  }

  return groups;
}

function findWords(
  board: IBoard,
  words: string[],
  y: number,
  x: number,
  currentWord: string = '',
  usedCoordinates: Array<[number, number]> = [],
  foundWords: any[]
): any[] | void {
  const stringToTest = currentWord + board[y][x];

  if (!words.length || stringToTest.length > 10) {
    console.log(foundWords);

    return foundWords;
  }

  const possibleWords = words.filter(word => word.startsWith(stringToTest));
  const coordinates: Array<[number, number]> = [...usedCoordinates, [y, x]];

  const locationOfWord = words.indexOf(stringToTest);

  if (locationOfWord > -1) {
    delete words[locationOfWord];

    foundWords.push({
      path: coordinates,
      word: stringToTest
    });
  }

  const isUsedCoordinate = (yy: number, xx: number) =>
    coordinates.some(numbers => numbers[0] === yy && numbers[1] === xx);

  const doesRightExist = x + 1 <= 3;
  const isRightPossible = doesRightExist && !isUsedCoordinate(y, x + 1);

  const doesLeftExist = x - 1 >= 0;
  const isLeftPossible = doesLeftExist && !isUsedCoordinate(y, x - 1);

  const doesDownExist = y + 1 <= 3;
  const isDownPossible = doesDownExist && !isUsedCoordinate(y + 1, x);

  const doesUpExist = y - 1 >= 0;
  const isUpPossible = doesUpExist && !isUsedCoordinate(y - 1, x);

  const isUpRightPossible =
    doesRightExist && doesUpExist && !isUsedCoordinate(y - 1, x + 1);
  const isUpLeftPossible =
    doesLeftExist && doesUpExist && !isUsedCoordinate(y - 1, x - 1);
  const isDownRightPossible =
    doesRightExist && doesDownExist && !isUsedCoordinate(y + 1, x + 1);
  const isDownLeftPossible =
    doesLeftExist && doesDownExist && !isUsedCoordinate(y + 1, x - 1);

  if (isRightPossible) {
    findWords(
      board,
      possibleWords,
      y,
      x + 1,
      stringToTest,
      coordinates,
      foundWords
    );
  }

  if (isLeftPossible) {
    findWords(
      board,
      possibleWords,
      y,
      x - 1,
      stringToTest,
      coordinates,
      foundWords
    );
  }

  if (isDownPossible) {
    findWords(
      board,
      possibleWords,
      y + 1,
      x,
      stringToTest,
      coordinates,
      foundWords
    );
  }

  if (isUpPossible) {
    findWords(
      board,
      possibleWords,
      y - 1,
      x,
      stringToTest,
      coordinates,
      foundWords
    );
  }

  if (isUpRightPossible) {
    findWords(
      board,
      possibleWords,
      y - 1,
      x + 1,
      stringToTest,
      coordinates,
      foundWords
    );
  }

  if (isUpLeftPossible) {
    findWords(
      board,
      possibleWords,
      y - 1,
      x - 1,
      stringToTest,
      coordinates,
      foundWords
    );
  }

  if (isDownRightPossible) {
    findWords(
      board,
      possibleWords,
      y + 1,
      x + 1,
      stringToTest,
      coordinates,
      foundWords
    );
  }

  if (isDownLeftPossible) {
    findWords(
      board,
      possibleWords,
      y + 1,
      x - 1,
      stringToTest,
      coordinates,
      foundWords
    );
  }
}

export function solveForBoard(board: IBoard) {
  const wordsOrganizedByFirstLetter = organizeWordsByFirstLetter(wordlist);

  const foundWords = [];

  for (const y of Object.keys(board)) {
    for (const x of Object.keys(board[Number(y)])) {
      const letter = board[Number(y)][Number(x)];

      const words = findWords(
        board,
        wordsOrganizedByFirstLetter[letter.toLocaleLowerCase()],
        Number(y),
        Number(x),
        undefined,
        undefined,
        []
      );

      foundWords.push(words);
    }
  }

  return foundWords;
}

export function convertFlatBoardTo2D(letters: string[]): IBoard {
  return letters.reduce(
    (prev, curr, index) => {
      const chunk = Math.floor(index / 4);

      prev[chunk] = [...(prev[chunk] || []), curr];
      return prev;
    },
    [] as IBoard
  );
}

export function lowerCaseFlatBoard(letters: string[]) {
  return letters.map(letter => letter.toLocaleLowerCase());
}
