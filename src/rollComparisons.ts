import { determineResultFunction, result, roll } from './types';

// type determineResultFunction = (rolls: roll, comparison?: roll | number) => result;

const sumGreaterThanNumber = (roll: roll, compareNumber: number = 7): result =>  {
  if (roll.total > compareNumber) return {value: 'success', count: roll.count}
  return {value: 'failure', count: roll.count}
}

const myGameDiceResult = (playerRoll: roll, oppRoll: roll): result => {
  let resultString = '';
  let playerNumbers = [playerRoll.total, playerRoll.max];
  let oppNumbers = [oppRoll.total, oppRoll.max];
  while (playerNumbers.length > 0 || oppNumbers.length > 0){

    if (oppNumbers.length < 1 || playerNumbers[0] > oppNumbers[0]) {
      resultString = resultString + 'P';
      playerNumbers.shift();
    } else if (playerNumbers.length < 1 || playerNumbers[0] < oppNumbers[0]) {
      resultString = resultString + 'O';
      oppNumbers.shift();
    } else {
      resultString = resultString + 'T';
      playerNumbers.shift();
      oppNumbers.shift();
    }
  }
  return {value: resultString, count: playerRoll.count * oppRoll.count}
}

const myGameFirstAndSecond = (playerRoll: roll, oppRoll: roll): result => {
  let resultString = '';
  let playerNumbers = [playerRoll.total, playerRoll.max];
  let oppNumbers = [oppRoll.total, oppRoll.max];
  for (let i = 0; i < 2; i++){

    if (oppNumbers.length < 1 || playerNumbers[0] > oppNumbers[0]) {
      resultString = resultString + 'P';
      playerNumbers.shift();
    } else if (playerNumbers.length < 1 || playerNumbers[0] < oppNumbers[0]) {
      resultString = resultString + 'O';
      oppNumbers.shift();
    } else {
      resultString = resultString + 'T';
      playerNumbers.shift();
      oppNumbers.shift();
    }
  }
  return {value: resultString, count: playerRoll.count * oppRoll.count}
}

export { sumGreaterThanNumber, myGameDiceResult, myGameFirstAndSecond };