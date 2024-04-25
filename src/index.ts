import { getDiceThrows, getResultsFromRolls, interperetDiceString } from "./compare";
import { sumGreaterThanNumber } from "./rollComparisons";

const args = process.argv;
args.shift(); args.shift();

const playerDice = interperetDiceString(args[0]);
const oppositionDice = interperetDiceString(args[1]);
const playerDiceThrows = getDiceThrows(playerDice);

const results = getResultsFromRolls(playerDiceThrows, sumGreaterThanNumber, oppositionDice.constant);
results.forEach((result) => {
  console.log(result);
});