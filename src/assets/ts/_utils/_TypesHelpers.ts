function getObjectPropertyValueByKey(obj: any, key: string): any | undefined {
  const map = new Map(Object.entries(obj))
  if (obj.hasOwnProperty(key) && map) {
    return map.get(key)
  }
}

/**
 * Generates unique ID for give prefix.
 * @param {string} prefix Prefix for generated ID
 * @returns {boolean}
 */
function getUniqueIdWithPrefix(prefix: string | undefined): string {
  const crypto = window.crypto;
  var array = new Uint32Array(1); 
  const result = Math.floor(crypto.getRandomValues(array)[0]).toString()
  if (!prefix) {
    return result
  }

  return `${prefix}${result}`
}

/* eslint-disable no-useless-escape */
function stringSnakeToCamel(str: string): string {
  return str.replace(/(\-\w)/g, function (m) {
    return m[1].toUpperCase()
  })
}

function toJSON(value: string | JSON): JSON | undefined {
  if (typeof value !== 'string') {
    return value
  }

  if (!value) {
    return undefined
  }

  const result = value
    .toString()
    .split('')
    .map((el) => (el !== "'" ? el : '"'))
    .join('')
  try {
    return JSON.parse(result)
  } catch {
    return undefined
  }
}

export {getObjectPropertyValueByKey, getUniqueIdWithPrefix, stringSnakeToCamel, toJSON}
