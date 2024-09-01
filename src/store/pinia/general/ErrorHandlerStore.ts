import {
  swalAlertError,
  swalAlertErrorBulk
} from "@/core/helpers/sweet-alert";
import { defineStore } from "pinia"

const useErrorHandlerStore = defineStore({
  id: "general-error-handler",
  state: () => {
    return {
      errorPages: {}
    }
  },
  actions: {
    handleSetErrorPage(page) {
      this.errorPages[page] = {}
    },
    handleSetErrorOnPage({ page, name, message, status }) {
      this.errorPages[page][name] = {
        message: message,
        status: typeof status !== undefined ? status : "",
      };
    },
    handleUpdateErrorOnPage(payload) {
      this.handleSetErrorOnPage(payload)
      if (payload.type === "unhandledError" && (typeof payload.status == 'undefined' || payload.status)) {
        swalAlertError(payload.message, "OK");
      } else if (payload.type === "unhandledErrorBulk" && (typeof payload.status == 'undefined' || payload.status)) {
        swalAlertErrorBulk(payload.message)
      }
    }
  }
})

export default useErrorHandlerStore
