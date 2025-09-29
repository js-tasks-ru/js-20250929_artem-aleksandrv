/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) => {
  const entries = Object.entries(obj);
  let res = {};
  entries.forEach((val) => {
    if (!fields.includes(val[0])) {
      let key = val[0];
      let value = val[1];
      res = { ...res, [key]: value };
    }
  });
  return res;
};
