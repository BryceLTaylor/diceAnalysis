import { roll } from "./types";

// acceptable values d6 2d6 d6+d8 d8+2d12 
const interperetDiceString = (diceString: string) => {
  let dice: number[] = [];
  // interperet string
  let diceSets: string[] = diceString.split('+');
  if (diceSets.length === 0) {
    throw new Error('no dice provided in the dice String');
  }
  diceSets.forEach((diceGroup) => {
    for (let i=0; i<diceGroup.length; i++) {
      if (diceGroup[i] === 'd') {
        if (i === 0) {
          diceGroup = '1' + diceGroup;
        }
        break;
      } 
    }
    let splitDiceGroup = diceGroup.split('d');
    if (splitDiceGroup.length !== 2) throw new Error(`the dice group has the wrong number of elements: ${splitDiceGroup}`);
    const diceCount = parseInt(splitDiceGroup[0]);
    const diceValue = parseInt(splitDiceGroup[1]);
    if (typeof diceCount !== 'number') throw new Error(`the first part of a dice group, before the d, should be a number: ${diceCount}, type: ${typeof diceCount}`);
    if (typeof diceValue !== 'number') throw new Error(`the second part of a dice group, after the d, should be a number ${diceValue}, type ${typeof diceValue}`);
    for (let i = 0; i < diceCount; i++) {
      dice.push(diceValue);
    }
  });
  return dice;
}

const getDiceResults = (dice: number[]) => {
  let rolls: roll[] = [];
  // do some stuff
  
  return rolls;
}

const args = process.argv;
args.shift(); args.shift();

const dice = interperetDiceString(args[0]);
console.log(`dice: ${dice}`)
const results = getDiceResults(dice);
console.log(results)


