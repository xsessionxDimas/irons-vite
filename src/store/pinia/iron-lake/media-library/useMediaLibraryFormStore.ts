import {
  UPDATE_API_URL,
  LOOKUP_API_URL,
} from "./urls";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  UpsertItem
} from "@entities/iron-lake/media-library/UpsertItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import { OptionIronlake } from "@/core/types/misc/Option";
import { mapOptionObject } from "@/core/helpers/mapOption";
import {
  swalAlertSuccessTitle,
  swalAlertErrorTitle,
} from "@/core/helpers/sweet-alert";
import {
  useMediaLibraryListStore
} from "@/store/pinia/iron-lake/media-library/useMediaLibraryListStore";
import {
  useAuthenticationStore
} from "../../application/useAuthenticationStore";

class InitialFormItem {
  Code = ""
  Description = ""
  FileType = ""
  Files = null
  AttachmentId = 0
  IsActive = true
}

type ContentError = {
  totalData: number;
  dailyOutstandingServiceList: [
    {
      validationReason: string;
    },
  ];
};

export const useMediaLibraryFormStore = defineStore({
  id: "mediaLibraryForm",
  state: () => {
    return {
      stateLoading: false,
      stateLoadingMessage: "",

      stateFormToggle: false,
      stateIsNewForm: true,
      stateFormItem: new InitialFormItem() as unknown as UpsertItem,

      stateIsError: false,
      stateError: "",
      stateErrors: [] as string[],

      stateFileTypeOption: [] as OptionIronlake[],
    };
  },
  getters: {
    formToggle: (state) => {
      return state.stateFormToggle;
    },
    isNewForm: (state) => {
      return state.stateIsNewForm;
    },
    error: (state) => {
      return state.stateError;
    },
    errors: (state) => {
      return state.stateErrors;
    },
    isError: (state) => {
      return state.stateIsError;
    },
    loading: (state) => {
      return state.stateLoading;
    },
    fileTypeOption: (state) => {
      return state.stateFileTypeOption;
    },
    lastId: () => {
      const mediaLibraryListStore = useMediaLibraryListStore()
      return mediaLibraryListStore.lastId + 1
    }
  },
  actions: {
    async getFileTypeLookup() {
      const params = {
        ver: "v1",
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> =
          await ApiService.get(
            LOOKUP_API_URL,
            "",
            new URLSearchParams(params).toString(),
          );

        const labelFormat = (element) => {
          return element;
        };
        const valueFormat = (element) => {
          return element;
        };
        this.stateFileTypeOption = mapOptionObject(
          response.data.result.content.fileType,
          labelFormat,
          valueFormat
        );
      } catch (error) {
        console.log(error);
      }
    },
    async insertData() {
      this.stateLoading = true;
      this.stateLoadingMessage = "Submitting Data";
      const authStore = useAuthenticationStore();
      try {
        const params = {
          ver: "v1",
          userAccount: authStore.user.Email
        };

        const formData = new FormData()
        for (const key in this.stateFormItem) {
          if (this.stateFormItem.hasOwnProperty.call(this.stateFormItem, key)) {
            // when add new, didn't send AttachmentId
            if (key !== 'AttachmentId' || (key === 'AttachmentId' && this.stateFormItem[key] !== 0)) {
              if (key == 'Description' && this.stateFormItem[key] == null) {
                this.stateFormItem[key] = ''
              }
              formData.append(key, this.stateFormItem[key]);
            }
          }
        }

        const response: AxiosResponse<SingleApiResponse<ContentError>> =
          await ApiService.post(
            `${UPDATE_API_URL}?${new URLSearchParams(params).toString()}`,
            formData as AxiosRequestConfig,
          );
        if (!response.data.result.isError) {
          const alertMessage = "Record has been submitted successfully";
          swalAlertSuccessTitle(alertMessage, "", "Ok");
        } else {
          this.setErrors(
            response.data.result.content.dailyOutstandingServiceList[0].validationReason.split(
              ",",
            ),
          );
          swalAlertErrorTitle("Failed to Submit", "", "Ok");
        }
        this.stateLoading = false;
        return response.data.result.isError;
      } catch (error: any) {
        this.setErrors([error.response.data.result.message]);
        this.stateLoading = false;
        return error.response.data.result.isError;
      }
    },
    setErrors(errors: string[]) {
      this.stateErrors = errors;
      this.stateIsError = this.stateErrors.length > 0;
    },
    resetFormItem() {
      this.stateFormItem = new InitialFormItem() as unknown as UpsertItem;
      this.stateIsNewForm = true;
    },
  },
});
