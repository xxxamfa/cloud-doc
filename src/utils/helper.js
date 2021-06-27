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
// 讓同一筆資料右鍵點擊顯示同個資料
export const getParentNode = (node, parentClassName) => {
  let current = node;
  while (current !== null) {
    if (current.classList.contains(parentClassName)) {
      return current;
    }
    current = current.parentNode;
  }
  return false;
};
