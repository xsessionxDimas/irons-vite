const ServiceSheetErrorMessages = {
  SUBMITTED: 'Failed to update data, service sheet status is Submited',
  CLOSE: 'Failed to update data, service sheet status is Close',
  TASK_UPDATED_BY_OTHER: 'Task already updated by other mechanic!',
  CHANGE_NOT_APPLICABLE_WITHOUT_REASON: 'You cannot change Not Applicable without a reason, please retry!',
  MODIFY_DEFECT_AFTER_SUPERVISOR_APPROVAL: 'You cannot modify the defect once already approved or declined by Supervisor'
};

const ApprovalErrorMessages = {
  INCOMPLETE_DATA: 'Some data need to be acknowledged or completed.',
  SERVICE_SHEET_NEED_TO_BE_SUBMITED: 'Service sheet status should be submited.',
  INTERIM_NEED_TO_BE_SUBMITED: 'Interim engine status should be submited.',
  INTERVENTION_NEED_TO_BE_SUBMITED: 'Intervention status should be submited.',
}

const NoNetworkMessages = {
  NO_NETWORK: "Error: Network Error",
  NO_NETWORK_VIEW: "You cannot perform approval when the connection is lost. Make sure your network is online before performing it.",
}

export { ServiceSheetErrorMessages, ApprovalErrorMessages, NoNetworkMessages };
