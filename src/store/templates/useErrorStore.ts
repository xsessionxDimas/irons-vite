import { defineStore } from 'pinia';
import { ErrorFormPayload } from "../../core/types/misc/ErrorFormPayload";
import { ErrorPayload } from "../../core/types/misc/ErrorPayload";
import { ErrorResponse } from "../../core/types/misc/ErrorResponse";
import { Actions, Mutations } from "../enums/ErrorHandleEnum";
import { swalAlertError, swalAlertErrorBulk } from "../../core/helpers/sweet-alert";

interface ErrorHandleState {
  isError: boolean;
  errorResponse: ErrorResponse;
  errorPages: Record<string, any>;
  isFromSubmitError: boolean;
  formSubmitErrorMessages: string[];
}

export const useErrorHandleStore = defineStore('errorHandle', {
  state: (): ErrorHandleState => ({
    isError: false,
    errorResponse: {} as ErrorResponse,
    errorPages: {},
    isFromSubmitError: false,
    formSubmitErrorMessages: []
  }),
  getters: {
    getIsError: (state) => state.isError,
    getErrorResponse: (state) => state.errorResponse,
    getErrorPages: (state) => state.errorPages,
    getformSubmitErrorMessages: (state) => state.formSubmitErrorMessages,
    getIsFromSubmitError: (state) => state.isFromSubmitError
  },
  actions: {
    [Mutations.SET_IS_ERROR](payload: boolean) {
      this.isError = payload;
    },
    [Mutations.SET_ERROR_RESPONSE](payload: ErrorResponse) {
      this.errorResponse = payload;
    },
    [Mutations.SET_ERROR_PAGES](payload: string) {
      this.errorPages[payload] = {};
    },
    [Mutations.SET_ERROR_ON_PAGES](payload: { page: string, name: string, message: string, status?: string }) {
      if (!this.errorPages[payload.page]) {
        this.errorPages[payload.page] = {};
      }
      this.errorPages[payload.page][payload.name] = {
        message: payload.message,
        status: payload.status !== undefined ? payload.status : "",
      };
    },
    async [Actions.UPDATE_ERROR_TO_PAGE](payload: { page: string, name: string, message: string, status?: string, type: string }) {
      this[Mutations.SET_ERROR_ON_PAGES](payload);
      if (payload.type === "unhandledError" && (typeof payload.status == 'undefined' || payload.status)) {
        this[Actions.TRIGGER_SWAL_ERROR_RESPONSE](payload.message);
      } else if (payload.type === "unhandledErrorBulk" && (typeof payload.status == 'undefined' || payload.status)) {
        this[Actions.TRIGGER_SWAL_ERROR_BULK_RESPONSE](payload.message);
      }
    },
    async [Actions.UPDATE_ERROR](payload: ErrorPayload) {
      // reset current error state
      await this[Actions.RESET_ERROR]();
      // update error message
      this[Mutations.SET_IS_ERROR](payload.status);
      this[Mutations.SET_ERROR_RESPONSE](payload.errorResponse);
      // call error modal showing error message
      this[Actions.TRIGGER_SWAL_ERROR_RESPONSE](this.getErrorResponse.message);
    },
    [Actions.TRIGGER_SWAL_ERROR_RESPONSE](payload: string) {
      swalAlertError(payload, "OK");
    },
    [Actions.TRIGGER_SWAL_ERROR_BULK_RESPONSE](payload: string) {
      swalAlertErrorBulk(payload);
    },
    [Actions.RESET_ERROR]() {
      this[Mutations.SET_IS_ERROR](false);
      this[Mutations.SET_ERROR_RESPONSE]({} as ErrorResponse);
    },
    [Mutations.SET_FORM_INPUT_ERROR_MESSAGES](payload: string[]) {
      this.formSubmitErrorMessages = payload;
    },
    [Mutations.SET_IS_FORM_INPUT_ERROR](payload: boolean) {
      this.isFromSubmitError = payload;
    },
    async [Actions.UPDATE_FORM_INPUT_ERROR](payload: ErrorFormPayload) {
      this[Actions.RESET_FORM_INPUT_ERROR]();
      this[Mutations.SET_IS_FORM_INPUT_ERROR](payload.status);
      this[Mutations.SET_FORM_INPUT_ERROR_MESSAGES](payload.errorMessages);
    },
    [Actions.RESET_FORM_INPUT_ERROR]() {
      this[Mutations.SET_IS_FORM_INPUT_ERROR](false);
      this[Mutations.SET_FORM_INPUT_ERROR_MESSAGES]([]);
    }
  }
});
