export const maximumFiveDigitWithTwoFraction = (input: string) => {
  const regEx = /^\d{1,5}(\.\d{1,2})?$/;
  return regEx.test(input);
}

export const maximumFiveDigit = (input: string) => {
  let status = true
  if (input.length > 5) status = false
  return status
}

export const isDotTheLastDigit = (input: string) => {
  if (input.indexOf(".") > 0) {
    return input.indexOf(".") == input.length - 1
  }
}

const checkIndexOfDotFromRight = (input: string) => {
  if (input.indexOf(".") > 0) {
    return input.length - input.indexOf(".")
  }
  return -1
}

export const formatNumberWithComma = (input, decimal = 0) => {
  if (input) {
    input = String(input).replaceAll(',', '')
    const inputString = String(input)
    if (inputString == '0') return inputString
    if (inputString[1] == '.') {
      return inputString
    }
    const lastIndexIsDot = inputString.slice(-1) == '.'
    let formattedNumber = Number(inputString).toLocaleString('en-AU')
    if (formattedNumber == 'NaN') formattedNumber = ''
    if (lastIndexIsDot) formattedNumber = `${formattedNumber}.`

    if (decimal) {
      const index = checkIndexOfDotFromRight(formattedNumber)
      if (index > decimal + 1) {
        const split = formattedNumber.split(".")
        formattedNumber = split[0] + "." + split[1].slice(0, decimal)
      }
    }
    return formattedNumber
  } else {
    return input
  }
}

export const reformatNumberWithComma = (input) => {
  return String(input).replaceAll(',', '')
}
export const formatNumberInput = (input) => {
  if (input === "") {
    return input;
  }
  return formatNumberWithComma(reformatNumberWithComma(input))
}

export const validateDecimalNumber = (value) => {
  const val = value as string;
  if (isNaN(Number(val))) {
    return false;
  }
  if (val.length > 8 || (val.split(".").length - 1) > 1) {
    return false;
  }
  if (val.includes(".")) {
    const afterComma = val.split(".")[1];
    if (afterComma.length > 2) {
      return false;
    }
  }
  if (val.length > 5) {
    if (val.includes(".")) {
      const beforeComma = val.split(".")[0];
      if (beforeComma.length > 5 && val[5] !== ".") {
        return false;
      }
    }
  }
  if (val.startsWith('0') && val[1] == '0') {
    return false;
  }
  return true
}

export const formatNumberOnInput = (value) => {
  let val = value as string;
  if (val.length == 2 && val.startsWith('0') && val[1] != '.') {
    val = parseInt(value).toString();
  }
  return val;
}
