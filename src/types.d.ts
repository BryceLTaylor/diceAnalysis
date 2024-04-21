type roll = {
  dice: number[];
  total: number;
  min: number;
  max: number;
  multiples: number[][];
}

type result = {
  success: boolean;
}

export { result, roll }