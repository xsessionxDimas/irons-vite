export const distinctData = (dataList, key) => {
  let distinctedData: Array<string> = [];
  if (dataList) {
    dataList.forEach((item) => {
      distinctedData.push(item[key] as string);
    });
  }
  distinctedData = [...new Set(distinctedData)];

  const dropdown: Array<unknown> = [];
  distinctedData.forEach((data) => {
    if (data && data != "") {
      dropdown.push({
        label: data,
        value: data,
      });
    }
  });

  return dropdown
}
