type roll = {
  dice: number[];
  constant: number;
  total: number;
  min: number;
  max: number;
  multiples: number[][];
  count: number;
}

type diceList = {
  dice: number[],
  constant: number
}

type result = {
  success: boolean;
}

type determineEquivalentFunction = (rollA: roll, rollB: roll) => boolean;

export { determineEquivalentFunction, diceList, result, roll }