import {
  LOOKUP_PS_TYPE_API_URL,
  DOS_LOOKUP_STATUS,
  LOOKUP_SHIFT_API_URL,
  DOS_UPSERT_API_URL,
  DOS_CRUD_API_URL,
  DOS_LOOKUP_EQUIPMENT,
  EQP_CRUD_API_URL
} from "./urls";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  UpsertItem
} from "@entities/iron-lake/task/daily-schedule/UpsertItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import { normalizeDate } from "@/core/helpers/date-format";
import { Option, OptionIronlake } from "@/core/types/misc/Option";
import { mapOption, mapOptionObject } from "@/core/helpers/mapOption";
import {
  swalAlertSuccessTitle,
  swalAlertErrorTitle,
} from "@/core/helpers/sweet-alert";
import { useDailyScheduleBulkStore } from "./useDailyScheduleBulkStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";

class InitialFormItem {
  dailyScheduleId = null;
  unitNumber = "";
  smuDue = "";
  workOrder = "";
  psType = "";
  dateService = "";
  shift = "Day";
  startDate = normalizeDate(new Date());
  endDate = normalizeDate(new Date("12/31/9999"));
  isActive = true;
}

type ContentError = {
  totalData: number;
  dailyOutstandingServiceList: [
    {
      validationReason: string;
    },
  ];
};

interface OptionKey {
  [key: string]: string;
}

const bulkStore = useDailyScheduleBulkStore();
const authStore = useAuthenticationStore();

export const useDailyScheduleFormStore = defineStore({
  id: "dailyScheduleForm",
  state: () => {
    return {
      stateLoading: false,
      stateLoadingMessage: "",

      stateFormToggle: false,
      stateIsNewForm: true,
      stateIsDraftForm: false,
      stateIsDeleteList: false,
      stateFormItem: [new InitialFormItem()] as UpsertItem[],

      stateIsError: false,
      stateError: "",
      stateErrors: [] as string[],

      stateSiteOption: [] as OptionIronlake[],
      stateUnitNumberOption: [] as OptionIronlake[],
      stateFilterServiceSizeOpt: [] as Option[],
      statePsTypeOption: [] as Option[],
      stateStatusOption: [] as OptionIronlake[],
      stateShiftOption: [] as Option[],
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
    siteOption: (state) => {
      return state.stateSiteOption;
    },
    filterServiceSizeOpt: (state) => {
      return state.stateFilterServiceSizeOpt;
    },
    psTypeOption: (state) => {
      return state.statePsTypeOption;
    },
    statusOption: (state) => {
      return state.stateStatusOption;
    },
    shiftOption: (state) => {
      return state.stateShiftOption;
    },
    unitNumberOption: (state) => {
      return state.stateUnitNumberOption;
    },
  },
  actions: {
    async getLookupSite() {
      const url = `${EQP_CRUD_API_URL}/lookup_site`;
      const params = new URLSearchParams({ ver: "v1" }).toString();
      try {
        const response: AxiosResponse<SingleApiResponse<any>> =
          await ApiService.get(url, "", params);

        const labelFormat = (element) => {
          return element.siteName;
        };
        const valueFormat = (element) => {
          return element.siteId;
        };
        this.stateSiteOption = mapOptionObject(
          response.data.result.content,
          labelFormat,
          valueFormat
        );
      } catch (error) {
        console.log(error);
      }
    },
    async getEquipmentNumberLookup() {
      const params = {
        ver: "v1",
        status: "",
        siteId: authStore.user.isHO === 1 ? "" : authStore.user.SiteId
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> =
          await ApiService.get(
            DOS_LOOKUP_EQUIPMENT,
            "",
            new URLSearchParams(params).toString(),
          );

        const labelFormat = (element) => {
          return element.equipmentNo + " | " + element.equipmentNoDescription;
        };
        const valueFormat = (element) => {
          return element.equipmentNoId;
        };
        this.stateUnitNumberOption = mapOptionObject(
          response.data.result.content,
          labelFormat,
          valueFormat
        );
      } catch (error) {
        console.log(error);
      }
    },
    // for filter form
    async getPsTypeLookup() {
      const params = {
        ver: "v1",
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> =
          await ApiService.get(
            LOOKUP_PS_TYPE_API_URL,
            "",
            new URLSearchParams(params).toString(),
          );
        this.stateFilterServiceSizeOpt = mapOption(response.data.result.content.psType);
      } catch (error) {
        console.log(error);
      }
    },
    // for spesific equipment no
    async lookupServiceSize(equipmentNo: string) {
      const url = `${DOS_CRUD_API_URL}/lookup_service_size`;
      const params = {
        ver: "v1",
      };
      const reqBody = {
        equipmentNo: equipmentNo,
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> =
          await ApiService.post(
            `${url}?${new URLSearchParams(params).toString()}`,
            reqBody as AxiosRequestConfig,
          );
        this.statePsTypeOption = mapOption(response.data.result.content);
      } catch (error) {
        console.log(error);
      }
    },
    async getStatusLookup() {
      const params = {
        ver: "v1",
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> =
          await ApiService.get(
            DOS_LOOKUP_STATUS,
            "",
            new URLSearchParams(params).toString(),
          );

        const labelFormat = (element) => {
          return element.status;
        };
        const valueFormat = (element) => {
          return element.statusId;
        };
        this.stateStatusOption = mapOptionObject(
          response.data.result.content,
          labelFormat,
          valueFormat
        );
      } catch (error) {
        console.log(error);
      }
    },
    async getShiftLookup() {
      const params = {
        ver: "v1",
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> =
          await ApiService.get(
            LOOKUP_SHIFT_API_URL,
            "",
            new URLSearchParams(params).toString(),
          );
        this.stateShiftOption = mapOption(response.data.result.content.shift);
      } catch (error) {
        console.log(error);
      }
    },
    async insertData() {
      this.stateLoading = true;
      this.stateLoadingMessage = "Submitting Data";
      try {
        const params = {
          ver: "v1",
        };
        // If editing draft Item
        if (this.stateIsDraftForm) {
          const formItem = this.stateFormItem[0];
          const draftPayload = [
            {
              dailyScheduleDraftId: formItem.dailyScheduleId,
              unitNumber: formItem.unitNumber,
              smuDue: formItem.smuDue,
              workOrder: formItem.workOrder,
              psType: formItem.psType,
              dateService: formItem.dateService,
              shift: formItem.shift,
              startDate: formItem.startDate,
              endDate: formItem.endDate,
              isActive: true,
            },
          ];
          const response: AxiosResponse<SingleApiResponse<ContentError>> =
            await ApiService.post(
              `${DOS_UPSERT_API_URL}?${new URLSearchParams(params).toString()}`,
              draftPayload as AxiosRequestConfig,
            );
          this.stateLoading = false;
          if (!response.data.result.isError) {
            swalAlertSuccessTitle(
              "Record has been submitted successfully",
              "",
              "Ok",
            );
            bulkStore.removeDraftItemById(formItem.dailyScheduleId);
            return response;
          } else {
            this.setErrors(
              response.data.result.content.dailyOutstandingServiceList[0].validationReason.split(
                ",",
              ),
            );
            swalAlertErrorTitle(`Failed to Submit`, "", "Ok");
            return response;
          }
        }

        const response: AxiosResponse<SingleApiResponse<ContentError>> =
          await ApiService.post(
            `${DOS_UPSERT_API_URL}?${new URLSearchParams(params).toString()}`,
            this.stateFormItem as AxiosRequestConfig,
          );
        this.stateLoading = false;
        if (!response.data.result.isError) {
          const alertMessage = !this.stateIsDeleteList
            ? "Record has been submitted successfully"
            : "Record has been removed !";
          swalAlertSuccessTitle(alertMessage, "", "Ok");
          return response;
        } else {
          this.setErrors(
            response.data.result.content.dailyOutstandingServiceList[0].validationReason.split(
              ",",
            ),
          );
          swalAlertErrorTitle("Failed to Submit", "", "Ok");
          return response;
        }
      } catch (error: any) {
        this.stateErrors.push(error.response.data.result.message);
        this.stateIsError = true;
      }
      this.stateLoading = false;
    },
    setErrors(errors: string[]) {
      this.stateErrors = errors;
      this.stateIsError = this.stateErrors.length > 0;
    },
    resetFormItem() {
      this.stateFormItem = [new InitialFormItem()] as UpsertItem[];
      this.stateIsNewForm = true;
      this.stateIsDraftForm = false;
    },
  },
});
