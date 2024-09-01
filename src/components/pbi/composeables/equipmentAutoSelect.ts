export default function useEquipmentSensorConfig() {
  const getDataSelection = (component: string, allOptions: string[]) => {
    const componentLowerCase = component.toLowerCase();

    if (allOptions.length < 1) {
      return [""]
    }

    const mappingResult: string[] = [
      ""
    ];

    if (componentLowerCase == "engine") {
      mappingResult[0] = checkMappingResultExistInOptions(allOptions, "Blow-By Press Max") ? "Blow-By Press Max" : allOptions[0];
    } else if (componentLowerCase == "transmission") {
      mappingResult[0] = checkMappingResultExistInOptions(allOptions, "Trn Slip Gear Change: 2-3 Ave") ? "Trn Slip Gear Change: 2-3 Ave" : allOptions[0];
    } else {
      mappingResult[0] = allOptions[0];
    }
    console.log(mappingResult)
    return mappingResult;
  }

  return {
    getDataSelection
  }
}

const checkMappingResultExistInOptions = (allOptions: string[], result: string) => {
  const temp = allOptions.find((e) => {
    return e == result;
  });

  return temp ? true : false;
};
