export const filterAllOption = (array) => {
  return array.filter((item) => {
    return item !== "all";
  });
};

export const optionFinalisCheckStatus = (tempArray, selectedOption) => {
  let allChecked = false;
  if (selectedOption.value === "all") {
    allChecked = tempArray[0].isChecked === true ? false : true;
    tempArray.forEach((element) => {
      if (element.value != "null") element.isChecked = allChecked;
    });
  } else {
    tempArray.forEach((element) => {
      if (element.value === "all") {
        element.isChecked = false;
      } else if (element.value === selectedOption.value) {
        element.isChecked = !element.isChecked;
      }
    });
  }
  return tempArray;
};
