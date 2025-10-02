/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const mappedPath = path.split(".");
  return function (object) {
    let result = object;
    for (let key of mappedPath) {
      if (!result?.hasOwnProperty(key)) {
        return undefined;
      }
      result = result[key];
    }
    return result;
  };
}
