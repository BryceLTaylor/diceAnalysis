import { getDiceThrows, getResultsFromRolls, interperetDiceString } from "./compare";
import { sumGreaterThanSeven } from "./rollComparisons";

const args = process.argv;
args.shift(); args.shift();

const playerDice = interperetDiceString(args[0]);
const diceThrows = getDiceThrows(playerDice);

const results = getResultsFromRolls(diceThrows, sumGreaterThanSeven);
results.forEach((result) => {
  console.log(result);
});