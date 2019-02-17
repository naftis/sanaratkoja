import chunk from 'lodash/chunk';
import wordlist from '../assets/words.json';

type IBoard = string[][];

function organizeWordsByFirstLetter(words: string[]) {
  const groups: {
    [letter: string]: string[];
  } = {};

  for (const word of words) {
    const firstLetter = word[0];

    if (!/^[a-zäöå]$/.test(firstLetter)) {
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

export interface ICoordinate {
  x: number;
  y: number;
}

export interface IResult {
  path: ICoordinate[];
  word: string;
}

function findWords(
  foundWordsReference: IResult[],
  board: IBoard,
  words: string[],
  y: number,
  x: number,
  currentWord: string = '',
  usedCoordinates: ICoordinate[] = []
) {
  const stringToTest = currentWord + board[y][x];

  if (!words.length || stringToTest.length > 10) {
    return;
  }

  const possibleWords = words.filter(word => word.startsWith(stringToTest));
  const coordinates: Array<{ x: number; y: number }> = [
    ...usedCoordinates,
    { y, x }
  ];

  const locationOfWord = words.indexOf(stringToTest);

  if (locationOfWord > -1) {
    delete words[locationOfWord];

    foundWordsReference.push({
      path: coordinates,
      word: stringToTest
    });
  }

  const isUsedCoordinate = (yy: number, xx: number) =>
    coordinates.some(numbers => numbers.y === yy && numbers.x === xx);

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
      foundWordsReference,
      board,
      possibleWords,
      y,
      x + 1,
      stringToTest,
      coordinates
    );
  }

  if (isLeftPossible) {
    findWords(
      foundWordsReference,
      board,
      possibleWords,
      y,
      x - 1,
      stringToTest,
      coordinates
    );
  }

  if (isDownPossible) {
    findWords(
      foundWordsReference,
      board,
      possibleWords,
      y + 1,
      x,
      stringToTest,
      coordinates
    );
  }

  if (isUpPossible) {
    findWords(
      foundWordsReference,
      board,
      possibleWords,
      y - 1,
      x,
      stringToTest,
      coordinates
    );
  }

  if (isUpRightPossible) {
    findWords(
      foundWordsReference,
      board,
      possibleWords,
      y - 1,
      x + 1,
      stringToTest,
      coordinates
    );
  }

  if (isUpLeftPossible) {
    findWords(
      foundWordsReference,
      board,
      possibleWords,
      y - 1,
      x - 1,
      stringToTest,
      coordinates
    );
  }

  if (isDownRightPossible) {
    findWords(
      foundWordsReference,
      board,
      possibleWords,
      y + 1,
      x + 1,
      stringToTest,
      coordinates
    );
  }

  if (isDownLeftPossible) {
    findWords(
      foundWordsReference,
      board,
      possibleWords,
      y + 1,
      x - 1,
      stringToTest,
      coordinates
    );
  }
}

export function solveForBoard(board: IBoard) {
  const wordsOrganizedByFirstLetter = organizeWordsByFirstLetter(wordlist);

  const foundWords: IResult[] = [];

  for (const y of Object.keys(board)) {
    for (const x of Object.keys(board[Number(y)])) {
      const letter = board[Number(y)][Number(x)];

      findWords(
        foundWords,
        board,
        wordsOrganizedByFirstLetter[letter.toLocaleLowerCase()],
        Number(y),
        Number(x)
      );
    }
  }

  return foundWords;
}

export function lowerCaseFlatBoard(letters: string[]) {
  return letters.map(letter => letter.toLocaleLowerCase());
}
