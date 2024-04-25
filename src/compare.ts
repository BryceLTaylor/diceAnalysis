import { determineEquivalentFunction, determineResultFunction, diceList, result, roll } from "./types";
import { sumGreaterThanSeven, myGameDiceResult } from './rollComparisons';

// acceptable values d6 2d6 d6+d8 d8+2d12 
const interperetDiceString = (diceString: string) => {
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

const getDiceThrows = (diceList: diceList) => {
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
  console.log(possibilitiesByDie);

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

const getResultsFromRolls = (rolls: roll[], resultFunction: determineResultFunction) => {
  let results: result[] = [];
  for (let i = 0; i < rolls.length; i++) {
    let result: result = resultFunction(rolls[i]);
    let match: result = results.find((element) => {
      return element.value === result.value
    });
    if (match === undefined) {
      results.push(result)
    } else {
      match.count += result.count;
    }
  }
  return results;
};

const args = process.argv;
args.shift(); args.shift();

const dice = interperetDiceString(args[0]);
// console.log(`dice: ${dice.dice}`)
// console.log(`constant: ${dice.constant}`)
const diceThrows = getDiceThrows(dice);
// const condensedRolls = collectEquivalentRolls(diceThrows, detemineEqualSums);
const results = getResultsFromRolls(diceThrows, sumGreaterThanSeven);
results.forEach((result) => {
  console.log(result);
  // console.log(getSingleResultObjectFromDiceRolled(result))
});

// console.log(results)


