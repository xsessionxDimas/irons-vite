import { defineStore } from "pinia";
import { PinInput } from "@/core/types/entities/dma/pin/PinInput";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import ApiService from "@/core/services/ApiService";
import { CHANGE_PIN_URL, VALIDATE_PIN_URL } from "./urls";
import {
  useAuthenticationStore
} from "../../application/useAuthenticationStore";
import {
  updateLoggedInStatusFromAPIResponse
} from "@/core/helpers/authentication-handler";
import { sendErrorEvent } from "@/core/helpers/analytics";

export const usePINStore = defineStore({
  id: "dma-pin",
  state: () => {
    return {
      stateOldPin: new PinInput(),
      stateNewPin: new PinInput(),
      stateRetypeNewPin: new PinInput(),
      stateValidation: '',
      stateIsChangePinComplete: false
    }
  },
  getters: {
    oldPin: (state) => {
      return state.stateOldPin;
    },
    newPin: (state) => {
      return state.stateNewPin;
    },
    retypeNewPin: (state) => {
      return state.stateRetypeNewPin;
    },
    validaiton: (state) => {
      return state.stateValidation
    },
    isChangePinComplete: (state) => {
      return state.stateIsChangePinComplete
    }
  },
  actions: {
    setOldPin(pin) {
      this.stateOldPin.value = pin
    },
    setNewPin(pin) {
      this.stateNewPin.value = pin
    },
    setRetypeNewPin(pin) {
      this.stateRetypeNewPin.value = pin
    },
    setChangePin() {
      // this.stateValidation = 'New PIN not match'
      this.stateIsChangePinComplete = true
    },
    toggelIsChangePinComplete(status) {
      this.stateIsChangePinComplete = status
    },
    async validatePin(pin) {
      const params = {
        ver: 'v1'
      }
      const authStore = useAuthenticationStore()
      const body = {
        employeeId: authStore.user.EmployeeId,
        pinNumber: pin
      }
      try {
        const res: AxiosResponse<ApiResponse<any>> = await ApiService.post(`${VALIDATE_PIN_URL}?${new URLSearchParams(params).toString()}`, body as AxiosRequestConfig)
        if (res.status == 200 && res.data.result.message == 'Pin Number Valid') {
          return true
        } else {
          return false
        }
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error);
        return false
      }
    },
    setValidationMessage(message) {
      this.stateValidation = message
    },
    async changePIN() {
      const params = {
        ver: 'v1'
      }
      const authStore = useAuthenticationStore()
      const body = {
        employeeId: authStore.user.EmployeeId,
        pinNumber: this.stateNewPin.value
      }
      try {
        const res: AxiosResponse<ApiResponse<any>> = await ApiService.post(`${CHANGE_PIN_URL}?${new URLSearchParams(params).toString()}`, body as AxiosRequestConfig)
        if (res.status == 200 && res.data.result.message == 'Pin Number Valid') {
          return true
        } else {
          return false
        }
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error);
        this.stateValidation = error as string
        sendErrorEvent('IRONS', error);
        return false
      }
    },
    resetPIN() {
      this.stateOldPin.resetPIN()
      this.stateNewPin.resetPIN()
      this.stateRetypeNewPin.resetPIN()
      this.stateValidation = ''
    }
  }
});
