import { compareDice } from "./compare";
import { result } from "./types";

const args = process.argv;
args.shift(); args.shift();

const comparisonMode: string = args[0];
const playerDiceString: string = args[1];
const oppositionDiceString: string = args[2];

const finalResult: result[] = compareDice(comparisonMode, playerDiceString, oppositionDiceString);

finalResult.forEach((result) => {
  console.log(result);
});