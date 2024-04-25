import { determineResultFunction, result, roll } from './types';

// type determineResultFunction = (rolls: roll, comparison?: roll | number) => result;

const sumGreaterThanSeven = (roll: roll, compareNumber: number = 7): result =>  {
  if (roll.total > compareNumber) return {value: 'success', count: roll.count}
  return {value: 'failure', count: roll.count}
}

const myGameDiceResult = (playerRoll: roll, gmRoll: roll): result => {
  return {value: 'success', count: playerRoll.count}
}

export { sumGreaterThanSeven, myGameDiceResult };