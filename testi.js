const obj = {
  1: 'null',
  2: 'null',
  3: null,
  4: null,
};

// let i;
// Object.keys(obj).forEach((k) => {
//   if (!obj[k] && !i) {
//     i = k;
//   }
// });
// Object.entries(obj).map((i) => console.log(i));
const i = Object.entries(obj).filter(([, val]) => !val)[0][0];
console.log(i);
