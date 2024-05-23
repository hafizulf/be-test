const countSameWords = (input, query) => {
  const result = [];

  for (let i = 0; i < query.length; i++) {
    const q = query[i];
    let count = 0;

    for (let j = 0; j < input.length; j++) {
      if (q === input[j]) {
        count++;
      }
    }

    result.push(count);
  }

  return result;
}

console.log(countSameWords(
  ['xc', 'dz', 'bbb', 'dz'],
  ['bbb', 'ac', 'dz'])
);
