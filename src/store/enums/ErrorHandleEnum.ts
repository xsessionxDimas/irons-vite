enum Actions {
  UPDATE_ERROR = "updateError",
  RESET_ERROR = "resetError",
  UPDATE_FORM_INPUT_ERROR = "updateFormInputError",
  RESET_FORM_INPUT_ERROR = "resetFormInputError",
  TRIGGER_SWAL_ERROR_RESPONSE = "triggerSwalErrorResponse",
  TRIGGER_SWAL_ERROR_BULK_RESPONSE = "triggerSwalErrorBulkResponse",
  UPDATE_ERROR_TO_PAGE = "updateErrorToPage",
}

enum Mutations {
  SET_IS_ERROR = "setIsError",
  SET_ERROR_RESPONSE = "setErrorResponse",
  SET_FORM_INPUT_ERROR_MESSAGES = "setformSubmitErrorMessages",
  SET_IS_FORM_INPUT_ERROR = "setIsFormInputError",
  SET_ERROR_PAGES = "setErrorPages",
  SET_ERROR_ON_PAGES = "setErrorOnPages",
}

export { Actions, Mutations };
