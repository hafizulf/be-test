const matrixSubstracton = (matrix) => {
  const n = matrix.length;
  let firstDiagonalSum = 0;
  let secondDiagonalSum = 0;

  for (let i = 0; i < n; i++) {
    firstDiagonalSum += matrix[i][i];
    secondDiagonalSum += matrix[i][n - 1 - i];
  }

  return firstDiagonalSum - secondDiagonalSum;
}

const matrix = [
  [1, 2, 0],
  [4, 5, 6],
  [7, 8, 9]
]
console.log(matrixSubstracton(matrix));
