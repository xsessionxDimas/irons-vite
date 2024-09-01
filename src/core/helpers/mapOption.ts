type Option = {
  label: string,
  value: string,
}

const uniqueArray = (array: Array<Option>) => {
  return array.filter((value: Option, index, self) => {
    return index === self.findIndex((t: Option) => {
      if (t != null && value != null && t.value != null && value.value != null && t.label != null && value.label != null) {
        return (
          t.value === value.value && t.label === value.label
        )
      }
    })
  })
}

export const mapOption = (arrayOption: Array<any>): Array<Option> => {
  if (arrayOption) {
    return arrayOption.map((e) => {
      return {
        label: e ? e : "",
        value: e ? e : ""
      }
    });
  }
  return []
}

export const mapOptionFromApi = (arrayList: Array<any>, valueName: string, labelName: string): Array<Option> => {
  return arrayList.map((e) => {
    return {
      label: `${e[valueName]} | ${e[labelName]}`,
      value: e[valueName]
    }
  });
}

export const mapOptionFromLookupApi = (objectLookup, valueName: string, labelName: string | string[], isShownValue = true, divider = " | "): Array<Option> => {
  let array: Option[] = []
  let labelArray: string[] = []
  if (typeof labelName == 'string') {
    labelArray.push(labelName)
  } else {
    labelArray = labelName
  }
  let validLabel = true;
  labelArray.forEach((val) => {
    if (!(objectLookup[val] && objectLookup[val].length > 0)) {
      validLabel = false
    }
  })
  if (validLabel) {
    array = objectLookup[valueName].map((e, idx) => {
      if (e != null) {
        let label = ""
        if (isShownValue) {
          label = `${e}`
        }
        labelArray.forEach((val) => {
          label = (label == "" ? objectLookup[val][idx] : label + divider + objectLookup[val][idx])
        })
        return {
          label: label,
          value: e
        }
      }
    })
    return uniqueArray(array)
  }
  return []
}

export const mapOptionWithThreeLabelFromLookupApi = (objectLookup, valueName: string, labelOne: string, labelTwo: string): Array<Option> => {
  if (
    objectLookup[valueName].length &&
    objectLookup[labelOne].length &&
    objectLookup[labelTwo].length
  ) {
    return objectLookup[valueName].map((value, idx) => {
      return {
        label: `${value} | ${objectLookup[labelOne][idx]} | ${objectLookup[labelTwo][idx]}`,
        value: value
      }
    })
  }
  return []
}

export const mapOptionWithFourLabelFromLookupApi = (objectLookup, valueName: string, labelOne: string, labelTwo: string, labelThree: string): Array<Option> => {
  if (
    objectLookup[valueName].length &&
    objectLookup[labelOne].length &&
    objectLookup[labelTwo].length
  ) {
    return objectLookup[valueName].map((value, idx) => {
      return {
        label: `${value} | ${objectLookup[labelOne][idx]} | ${objectLookup[labelTwo][idx]} | ${objectLookup[labelThree][idx]}`,
        value: value
      }
    })
  }
  return []
}

export const mapOptionAsObjectFromLookupApi = (arrayOne, arrayTwo) => {
  if (arrayOne.length != arrayTwo.length) {
    return []
  }

  const optionObj = {}

  arrayOne.forEach((e, index) => {
    optionObj[e] = arrayTwo[index]
  })

  return optionObj
}

export const mapAllOptionsAsOneLabelAndValue = (objectLookup, divider = " | "): Array<Option> => {
  if (objectLookup != null) {
    const arrayOfOptionArrays = [] as any[];
    for (const arrayLookup in objectLookup) {
      arrayOfOptionArrays.push(objectLookup[arrayLookup]);
    }

    const concatedOption = [] as Option[];
    for (let i = 0; i < arrayOfOptionArrays.length; i++) {
      for (let j = 0; j < arrayOfOptionArrays[i].length; j++) {
        if (concatedOption[j]) {
          concatedOption[j].label = concatedOption[j].label + divider + arrayOfOptionArrays[i][j];
          concatedOption[j].value = concatedOption[j].value + divider + arrayOfOptionArrays[i][j];
        } else {
          concatedOption.push({
            label: arrayOfOptionArrays[i][j],
            value: arrayOfOptionArrays[i][j],
          });
        }
      }
    }

    return concatedOption;
  }
  return [];
}

interface OptionKey {
  [key: string]: string | number;
}

export const mapOptionObject = (
  resOptionArray: OptionKey[],
  customLabelFormat: (element: OptionKey) => string,
  optionValue: (element: OptionKey) => number,
) => {
  const resultOption = resOptionArray.map((element) => {
    return {
      label: customLabelFormat(element),
      value: optionValue(element),
    };
  });
  return resultOption;
}

export const generateOptionWithDefault = (arrayOption: string[], defaultCaption = 'All', defaultValue = ''): Option[] => {
  const options: Option[] = [
    {
      label: defaultCaption,
      value: defaultValue
    }
  ]
  if (!arrayOption) return options
  const transform: Option[] = arrayOption.map((opt) => {
    return {
      label: opt,
      value: opt
    }
  })
  return [...options, ...transform]
}
