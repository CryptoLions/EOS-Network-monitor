/* eslint-disable no-param-reassign */

const pickFromObj = (object, fields) =>
  Object.keys(fields).reduce((acc, key) => {
    if (typeof fields[key] === 'function') {
      acc[key] = fields[key]();
    }
    if (object[fields[key]] !== undefined) {
      acc[key] = object[fields[key]];
    }
    return acc;
  }, Object.create(null));

const pickAs = (object, fields) => {
  if (!Array.isArray(fields)) {
    return pickFromObj(object, fields);
  }
  return fields.reduce((result, field) => {
    if (typeof field === 'string') {
      if (object[field] !== undefined) {
        result[field] = object[field];
      }
    } else {
      Object.assign(result, pickFromObj(object, field));
    }
    return result;
  }, Object.create(null));
};


module.exports = pickAs;
