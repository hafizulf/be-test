const longestWord = (str) => {
  let arr = str.split(" ");
  let longest = arr[0];

  for (let i = 0; i < arr.length; i++){
    if (arr[i].length > longest.length) {
      longest = arr[i];
    }
  }

  return longest;
}

console.log(longestWord('Saya sangat senang mengerjakan soal algoritma'));
