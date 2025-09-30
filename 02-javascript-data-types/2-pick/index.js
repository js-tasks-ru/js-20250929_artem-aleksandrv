/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */

export const pick = (obj, ...fields) => {
  const entries = Object.entries(obj);
  const res = entries.reduce((acc, val) => {
    if (fields.includes(val[0])) {
      const key = val[0];
      const value = val[1];
      acc = { ...acc, [key]: value };
    }
    return acc;
  }, {});
  return res;
};
