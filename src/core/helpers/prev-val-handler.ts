export const checkPrevValFirstHandler = (prevObj): string => {
  const isLastValExists = prevObj["lastValue"] || prevObj["lastValue"] == ""
  const isPrevValExists = prevObj["previousValue"] || prevObj["previousValue"] == ""
  if (isLastValExists) {
    return prevObj["lastValue"]
  } else {
    return isPrevValExists ? prevObj["previousValue"] : prevObj["previousTandem"]
  }
}
