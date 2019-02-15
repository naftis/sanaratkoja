import * as fs from 'fs';
import { performance } from 'perf_hooks';

// prettier-ignore
const rows = [
  ['l', 'u', 'e', 'c'],
  ['a', 's', 'd', 'i'],
  ['t', 'j', 'a', 'l'],
  ['u', 'r', 'p', 'a']
];

const wordFile = fs.readFileSync('./assets/kotus_sanat.txt').toString();

const words = wordFile.split('\n');

const organizedWords = organizeWordsByFirstLetter(words);

function organizeWordsByFirstLetter(words: string[]) {
  const groups: {
    [letter: string]: string[];
  } = {};

  const lastLetter = '';

  for (const word of words) {
    const firstLetter = word[0];

    if (lastLetter !== firstLetter) {
      groups[firstLetter] = [word];
    } else {
      groups[firstLetter].push(word);
    }
  }

  return groups;
}

function findWords(
  words: string[],
  y: number,
  x: number,
  currentWord: string = '',
  usedCoordinates: Array<[number, number]> = []
): void {
  if (!words.length) {
    return;
  }

  const stringToTest = currentWord + rows[y][x];

  if (stringToTest.length > 10) {
    return;
  }

  const possibleWords = words.filter(word => word.startsWith(stringToTest));
  const coordinates: Array<[number, number]> = [...usedCoordinates, [y, x]];

  const locationOfWord = words.indexOf(stringToTest);

  if (locationOfWord > -1) {
    delete words[locationOfWord];

    console.log({
      path: coordinates,
      word: stringToTest
    });
  }

  const isUsedCoordinate = (y: number, x: number) =>
    coordinates.some(numbers => numbers[0] === y && numbers[1] === x);

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
    findWords(possibleWords, y, x + 1, stringToTest, coordinates);
  }

  if (isLeftPossible) {
    findWords(possibleWords, y, x - 1, stringToTest, coordinates);
  }

  if (isDownPossible) {
    findWords(possibleWords, y + 1, x, stringToTest, coordinates);
  }

  if (isUpPossible) {
    findWords(possibleWords, y - 1, x, stringToTest, coordinates);
  }

  if (isUpRightPossible) {
    findWords(possibleWords, y - 1, x + 1, stringToTest, coordinates);
  }

  if (isUpLeftPossible) {
    findWords(possibleWords, y - 1, x - 1, stringToTest, coordinates);
  }

  if (isDownRightPossible) {
    findWords(possibleWords, y + 1, x + 1, stringToTest, coordinates);
  }

  if (isDownLeftPossible) {
    findWords(possibleWords, y + 1, x - 1, stringToTest, coordinates);
  }
}

const t1 = performance.now();

for (const y of Object.keys(rows)) {
  for (const x of Object.keys(rows)) {
    const letter = rows[Number(y)][Number(x)];

    console.log(organizedWords[letter]);

    findWords(organizedWords[letter], Number(y), Number(x));
  }
}

const t2 = performance.now();

console.log(`It took ${t2 - t1}ms`);
