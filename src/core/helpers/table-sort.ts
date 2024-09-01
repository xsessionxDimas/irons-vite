import { toInteger } from "lodash";

export const dynamicSort = (property, order) => {
  const sortOrder = 1;

  return function (a, b) {
    let result = 0;
    const first =
      a[property] && !isNumeric(a[property])
        ? a[property].toLowerCase()
        : a[property];
    const second =
      b[property] && !isNumeric(b[property])
        ? b[property].toLowerCase()
        : b[property];
    if (order === "ascending") {
      const secondConditon = first > second ? 1 : 0;
      result = first < second ? -1 : secondConditon;
    } else {
      const secondConditon = first < second ? 1 : 0;
      result = first > second ? -1 : secondConditon;
    }
    return result * sortOrder;
  };
};

export const dynamicSortNumberAndStringCaseInsensitive = (wordOne, wordTwo, order, isReadAsString = true) => {
  // If some data still want to be considered as number, sort function will prioritize number first. Example ascending result: [ '1', '2', '101', 'a', 'b' ]
  // Else, all data will be considered as string. Example ascending result: [ '1', '101', '2', 'a', 'b' ]
  // Default isReadAsString true
  if (!isReadAsString) {
    if (!isNaN(wordOne) && isNaN(wordTwo)) {
      return -1;
    }
    if (isNaN(wordOne) && !isNaN(wordTwo)) {
      return 1;
    }
  }
  // If both are string
  if (isNaN(wordOne) && isNaN(wordTwo)) {
    return dynamicSortCaseInsensitive(wordOne, wordTwo, order)
  }
  // If both are numbers
  if (order == "ascending") {
    return toInteger(wordOne) > toInteger(wordTwo) ? 1 : -1;
  } else if (order == "descending") {
    return toInteger(wordTwo) > toInteger(wordOne) ? -1 : 1;
  }
};

export const dynamicSortNumber = (wordOne, wordTwo, order) => {
  if (order == "ascending") {
    return toInteger(wordOne) > toInteger(wordTwo) ? 1 : -1;
  } else if (order == "descending") {
    return toInteger(wordTwo) > toInteger(wordOne) ? -1 : 1;
  }
}

export const dynamicSortCaseInsensitive = (wordOne, wordTwo, order) => {
  // if word is null or empty
  if (!wordOne) wordOne = ''
  if (!wordTwo) wordTwo = ''
  const a = String(wordOne).toLowerCase();
  const b = String(wordTwo).toLowerCase();
  if (order == "ascending") {
    return a > b ? 1 : -1;
  } else if (order == "descending") {
    return b > a ? -1 : 1;
  }
};

function isNumeric(value) {
  if (!isNaN(Number(value))) {
    return !isNaN(Number(value));
  } else {
    return false;
  }
}

export const defaultSorting = (order) => {
  if (order == "ascending") {
    return 1
  } else if (order == "descending") {
    return -1
  }
}

export const camelCaseToSnakeCaseConverter = (camelCaseString: string) => {
  return camelCaseString.replace(/[\w]([A-Z])/g, function (m) {
    return m[0] + '_' + m[1].toLowerCase();
  }).toLowerCase();
}
