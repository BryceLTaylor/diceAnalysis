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
  value: string;
  count: number;
  percentage?: number;
}

type determineEquivalentFunction = (rollA: roll, rollB: roll) => boolean;

type determineResultFunction = (rolls: roll, comparison?: roll | number) => result;

export { determineEquivalentFunction, determineResultFunction, diceList, result, roll }
