/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  let result = "";
  let count = 0;
  if (size === undefined) {
    return string;
  }
  if (size === 0) {
    return "";
  }
  for (let i = 0; i < string.length; i++) {
    if (i > 0 && string[i] === string[i - 1]) {
      count++;
    } else {
      count = 1;
    }
    if (count <= size) {
      result += string[i];
    }
  }

  return result;
}
