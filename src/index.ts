import { getDiceThrows, getResultsFromRolls, interperetDiceString } from "./compare";
import { myGameDiceResult, myGameFirstAndSecond, sumGreaterThanNumber } from "./rollComparisons";

const args = process.argv;
args.shift(); args.shift();

const playerDice = interperetDiceString(args[0]);
const oppositionDice = interperetDiceString(args[1]);
const playerDiceThrows = getDiceThrows(playerDice);
const oppositionDiceThrows = getDiceThrows(oppositionDice);

const results = getResultsFromRolls(playerDiceThrows, myGameFirstAndSecond, oppositionDiceThrows);
let total = results.reduce((currentTotal, newValue) => currentTotal + newValue.count, 0);
console.log(total);
results.forEach((result) => {
  result.percentage = Math.floor(result.count / total * 10000) / 100;
  console.log(result);
});