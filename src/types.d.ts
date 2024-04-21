type roll = {
  dice: number[];
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

export { diceList, result, roll }