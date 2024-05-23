const reverse = (str) => {
  let newStr = [];

  for (let i=0; i<str.length; i++) {
    if(isNaN(parseInt(str[i]))) {
      newStr.unshift(str[i]);
    } else {
      newStr.push(str[i]);
    }
  }

  return newStr;
};
console.log(reverse('NEGIE1'));
