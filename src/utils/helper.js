// 將陣列用id當key轉為MAP
export const flattenArr = (arr) => {
  return arr.reduce((map, item) => {
    map[item.id] = item;
    return map;
  }, {});
};
// MAP或物件轉陣列(不要key)
export const objToArr = (obj) => {
  return Object.keys(obj).map((key) => {
    return obj[key];
  });
};
