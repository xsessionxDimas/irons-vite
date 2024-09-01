const MachineSMUEnum = {
  STATUS_IN_RANGE: "In range",
  STATUS_NOT_IN_RANGE: "Not in range",
  STATUS_NOT_IN_RANGE_LOWERCASE: "not in range",
  STATUS_OUT_OF_RANGE: "Out of range",
  MACHINESMUTITLE: () => {
    return `Machine SMU`
  },
  TITLE: (status) => {
    return `Machine SMU - ${status}`
  },
  VIEW_DIALOG_LABEL: (statusInRange) => {
    return `Machine SMU ${statusInRange ? '' : ` ${MachineSMUEnum.STATUS_NOT_IN_RANGE_LOWERCASE}`}`
  },
};

export { MachineSMUEnum };
