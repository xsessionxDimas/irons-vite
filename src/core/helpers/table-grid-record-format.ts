// scope.$index to get current index of el-column row
export const recordNumberFormat = (
  currentPage: number,
  totalPageSize: number,
  input: number,
) => {
  const addition = (currentPage - 1) * totalPageSize + 1;
  return input + addition;
};
