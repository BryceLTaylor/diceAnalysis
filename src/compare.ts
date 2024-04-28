import { determineEquivalentFunction, determineResultFunction, diceList, result, roll } from "./types";
import { bronzeNamedealer, bronzeNamedealerDemands, myGameDiceResult, myGameFirstAndSecond, risk, sumGreaterThanNumber } from "./rollComparisons";

// roll: the collection of faces as the result of rolling a set of dice

// result: the semantic meaning of a set roll based on a condition.  i.e. 'success' or
// 'both teams lose one army' 

// Takes a string representing dice and return an object representing the dice included 
// in the roll and a constant number to be added. 
// The diceList object contains an array of numbers, called dice, representing the 
// largest face on the die and a number, called constant, for the constant to be added.
// Acceptable input values d6 2d6 d6+d8 d8+2d12 
const interperetDiceString = (diceString: string): diceList => {
  let diceList: diceList = {dice: [], constant: 0};
  // interperet string
  let diceSets: string[] = diceString.split('+');
  if (diceSets.length === 0) {
    throw new Error('no dice provided in the dice String');
  }
  diceSets.forEach((diceGroup) => {
    let d_found = false;
    for (let i=0; i<diceGroup.length; i++) {
      if (diceGroup[i] === 'd') {
        d_found = true;
        if (i === 0) {
          diceGroup = '1' + diceGroup;
        }
        break;
      } 
    }
    if (d_found) {
      let splitDiceGroup = diceGroup.split('d');
      if (splitDiceGroup.length !== 2) throw new Error(`the dice group has the wrong number of elements: ${splitDiceGroup}`);
      const diceCount = parseInt(splitDiceGroup[0]);
      const diceValue = parseInt(splitDiceGroup[1]);
      if (typeof diceCount !== 'number') throw new Error(`the first part of a dice group, before the d, should be a number: ${diceCount}, type: ${typeof diceCount}`);
      if (typeof diceValue !== 'number') throw new Error(`the second part of a dice group, after the d, should be a number ${diceValue}, type ${typeof diceValue}`);
      for (let i = 0; i < diceCount; i++) {
        diceList.dice.push(diceValue);
      }
    } else {
      let constant: number = parseInt(diceGroup);
      if (typeof constant !== 'number') throw new Error(`an unknown, non-dice non-integer dice group was added: ${diceGroup}`)
      diceList.constant += constant;
    }
  });
  return diceList;
}

/*
type roll = {
  dice: number[];
  total: number;
  min: number;
  max: number;
  multiples: number[][];
  count: number;
}
*/

// don't sort dice yet.  Used to do .sort((a, b) => b - a)
const getSingleResultObjectFromDiceRolled = (roll: number[], constant: number): roll => {
  return {
    dice: roll,
    constant: constant,
    total: roll.reduce((sum: number, currentValue: number) => sum + currentValue, 0),
    min: roll.reduce((smallest, newValue) => Math.min(smallest, newValue)),
    max: roll.reduce((largest, newValue) => Math.max(largest, newValue)),
    multiples: [],
    count: 1
  }
}

// expands a list of possible rolls if another die is added.
// takes a list of possible rolls on a die and an existing list of rolls.
const expandRollsWithNewDie = (newDie: number[], rollSoFar: number[][]) => {
  let newRolls: number[][] = [];
  for (let i = 0; i < rollSoFar.length; i++) {
    let latestRoll: number[] = [...rollSoFar[i]];
    for (let j = 0; j < newDie.length; j++) {
      const brandNewRoll: number[] = [...latestRoll];
      brandNewRoll.push(newDie[j])
      newRolls.push(brandNewRoll);
    }
  }
  return newRolls;
}

// get list of all rolls from a list of dice to be rolled
const getDiceThrows = (diceList: diceList): roll[] | number => {
  const dice = diceList.dice;
  // console.log(dice)
  let rolls: roll[] = [];
  // build list of rolls per die
  let possibilitiesByDie: number[][] = [];
  for (let i = 0; i < dice.length; i++) {
    let rollsOnSingleDie: number[] = []; 
    for (let j = 1; j <= dice[i]; j++) {
      rollsOnSingleDie.push(j);
    }
    possibilitiesByDie.push(rollsOnSingleDie);
  }

  // if there are no dice, just return the constant
  if (possibilitiesByDie.length === 0) return diceList.constant;

  // get all possible rolls from possibilities per die
  // start with first die in the rollNumbers array
  let rollNumbers: number[][] = [];
  for (let i = 0; i < possibilitiesByDie[0].length; i++) rollNumbers.push([possibilitiesByDie[0][i]])
  for (let i = 1; i < possibilitiesByDie.length; i++) {
    rollNumbers = expandRollsWithNewDie(possibilitiesByDie[i], rollNumbers)
  }
  rollNumbers.forEach((rollNumber) => {
    let rollToAdd = getSingleResultObjectFromDiceRolled(rollNumber, diceList.constant);
    rollToAdd = findMultiples(rollToAdd)
    rolls.push(rollToAdd);
  });
  return rolls;
}

// given a roll, find sets of doubles, tripples, etc. that can be found among
// the dice faces.  Updates the roll object with the multiples
const findMultiples = (originalRoll: roll): roll => {
  let rollList: number[] = [...originalRoll.dice]
  let multipleList: number[][] = [];
  for (let i = rollList.length - 1; i >= 0; i--) {
    let value: number = rollList[i];
    let count: number = 1;
    rollList.splice(i, 1);
    for (let j = rollList.length - 1; j >= 0; j--) {
      if (rollList[j] === value) {
        count += 1;
        rollList.splice(j, 1);
        i--;
      }
    }
    if (count > 1) multipleList.push([value, count]);
  }
  originalRoll.multiples = multipleList;
  return originalRoll;
}

const detemineEqualSums = (currentRoll: roll, nextRoll: roll): boolean => {
  if (currentRoll.total === nextRoll.total) return true
  return false;
}

const collectEquivalentRolls = (rolls: roll[], equivalentFunction: determineEquivalentFunction) => {
  let newRolls: roll[] = [];
  for (let i = rolls.length - 1; i >= 0; i--) {
    const currentRoll = rolls[i];
    rolls.splice(i, 1);
    for (let j = rolls.length - 1; j >= 0; j--) {
      if (equivalentFunction(currentRoll, rolls[j])) {
        currentRoll.count++;
        rolls.splice(j, 1);
        i--;
      }
    }
    newRolls.push(currentRoll);
  }
  return newRolls;
};

// adds a result to an array of results, incrementing a count if the result 
// already exists in the array
const addResultToResults = (result: result, allResults: result[]) => {
  let match: result = allResults.find((element) => {
    return element.value === result.value
  });
  if (match === undefined) {
    allResults.push(result)
  } else {
    match.count += result.count;
  }
}

// takes a list of rolls and a function that outputs a result object and returns 
// a list of results.
const getResultsFromRolls = (playerRolls: roll[], resultFunction: determineResultFunction, oppositionRoll?: roll[] | number | undefined) => { // need to be able to pass in gm rolls optionally
  let results: result[] = [];
  for (let i = 0; i < playerRolls.length; i++) {
    if (oppositionRoll === undefined) {
      let result: result = resultFunction(playerRolls[i]);
      addResultToResults(result, results);
      // , oppositionRoll[i]
    } else if (typeof oppositionRoll === 'number') {
      let result: result = resultFunction(playerRolls[i], oppositionRoll);
      addResultToResults(result, results);
    } else {
      for (let j = 0; j < oppositionRoll.length; j++) {
        let result: result = resultFunction(playerRolls[i], oppositionRoll[j]); 
        addResultToResults(result, results);
      }
    }
  }
  return results;
};

const getComparisonFunctionFromString = (comparisonModeString: string): determineResultFunction => {
  switch (comparisonModeString) {
    case 'myGame':
      return myGameDiceResult;
    case 'myGameFirstSecond':
      return myGameFirstAndSecond;
    case 'sumGreater':
      return sumGreaterThanNumber;
    case 'bronze:namedealer':
      return bronzeNamedealer;
    case 'bronze:namedealer:demands':
      return bronzeNamedealerDemands;
    case 'risk':
      return risk;
    default:
      const badCommandError: string = `the first argument to calling this should be a command
      indicating a comparison method.  Acceptable options include:
      bronze:namedealer, bronze:namedealer:demands, myGame, myGameFirstSecond, risk, and sumGreater`;
      throw new Error(`${badCommandError}

      command found: ${comparisonModeString}
      `);
  }
}

const compareDice = (comparisonModeString: string, playerDiceString: string, oppositionDiceString: string): result[] => {
  const comparisonFunction: determineResultFunction = getComparisonFunctionFromString(comparisonModeString);
  const playerDice: diceList = interperetDiceString(playerDiceString);
  const oppositionDice: diceList = interperetDiceString(oppositionDiceString);
  const playerDiceThrows: roll[] | number = getDiceThrows(playerDice);
  if (typeof playerDiceThrows === 'number') {
    throw new Error(`The second argument of this tool must contain at least one die.  Your argument: ${comparisonModeString} `)
  }
  const oppositionDiceThrows: roll[] | number = getDiceThrows(oppositionDice);
  const results = getResultsFromRolls(playerDiceThrows, comparisonFunction, oppositionDiceThrows);
  let total = results.reduce((currentTotal, newValue) => currentTotal + newValue.count, 0);
  console.log(`total rolls: ${total}`);
  
  results.forEach((result) => {
    result.percentage = Math.floor(result.count / total * 10000) / 100;
  });
  return results;
}

export { compareDice, getDiceThrows, getResultsFromRolls, interperetDiceString }
