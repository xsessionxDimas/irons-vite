// array of objects to object with key value pairs
export const arrayToObject = (array) => {
  const object = {};
  array.forEach(function (item) {
    for (const property in item) {
      if (!object[property]) {
        object[property] = [];
      }
      object[property].push(item[property]);
    }
  });
  return object;
};
