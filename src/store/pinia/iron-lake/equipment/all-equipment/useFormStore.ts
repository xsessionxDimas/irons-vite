import { EQP_CRUD_API_URL, EQP_HMO_CRUD_URL } from "./urls";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  UpsertItem
} from "@/core/types/entities/iron-lake/equipment/all-equipment/UpsertItem";
import * as Content from "./type/ResponseContent"
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import { OptionIronlake } from "@/core/types/misc/Option";
import { mapOptionObject } from "@/core/helpers/mapOption";
import {
  swalAlertSuccessTitle,
  swalAlertErrorTitle,
} from "@/core/helpers/sweet-alert";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import { useBulkStore } from "./useBulkStore";
import { UserInfo } from "@/database/schema/UserInfo";

const authStore = useAuthenticationStore();

class InitialFormItem {
  equipmentUnitId: null | number;
  siteName: string;
  ownership: string;
  equipmentUnit: string;
  group: string;
  brandName: string;
  model: string;
  engineHourMeterOffset: null | number;
  serialNo: string;
  componentCode: string;
  componentName: string;
  resetDate: string;
  isActive: boolean;
  isWarning: undefined | boolean;

  constructor(userDetail: UserInfo) {
    this.equipmentUnitId = null;
    this.siteName =
      userDetail && userDetail.isHO === 1 ? "" : userDetail.Location;
    this.ownership = "";
    this.equipmentUnit = "";
    this.group = "";
    this.brandName = "";
    this.model = "";
    this.engineHourMeterOffset = null;
    this.serialNo = "";
    this.componentCode = "";
    this.componentName = "";
    this.resetDate = "";
    this.isActive = true;
  }
}

type ComponentItem = {
  componentCode: string;
  componentName: string;
  componentIsOther?: boolean;
};

type ContentError = {
  totalData: number;
  equipmentList: [
    {
      validationReason: string;
    },
  ];
};

export const useFormStore = defineStore({
  id: "allEquipmentForm",
  state: () => {
    return {
      stateLoading: false,

      stateFormToggle: false,
      stateIsNewForm: true,
      stateIsDraftForm: false,
      stateFormItem: [new InitialFormItem(authStore.user)] as UpsertItem[],
      stateComponentTable: [] as ComponentItem[],

      stateIsError: false,
      stateError: "",
      stateErrors: [] as string[],

      stateIsFocusEqp: null as null | boolean,
      stateIsFocusComp: null as null | boolean,

      stateSiteOption: [] as OptionIronlake[],
      stateOwnershipOption: [] as OptionIronlake[],
      stateEqpNoOption: [] as OptionIronlake[],
      stateEqpGroupOption: [] as OptionIronlake[],
      stateEqpBrandOption: [] as OptionIronlake[],
      stateEqpModelOption: [] as OptionIronlake[],
      stateCompTypeOption: [] as OptionIronlake[],
      stateComponentOption: [] as {
        componentCode: string;
        componentName: string;
        active?: boolean;
      }[],
    };
  },
  getters: {
    formToggle: (state) => {
      return state.stateFormToggle;
    },
    isNewForm: (state) => {
      return state.stateIsNewForm;
    },
    isDraftForm: (state) => {
      return state.stateIsDraftForm;
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
    ownershipOption: (state) => {
      const options = state.stateOwnershipOption.map((element) => {
        return element;
      });
      // This value might cause problem if ownership id gets to 9999
      options.unshift({
        label: "Add Other Ownership",
        value: 9999,
      });
      return options;
    },
    ownershipFilterOption: (state) => {
      return state.stateOwnershipOption;
    },
    eqpNoOption: (state) => {
      return state.stateEqpNoOption;
    },
    eqpGroupOption: (state) => {
      const groupOptions = state.stateEqpGroupOption.map((element) => {
        return element;
      });
      groupOptions.unshift({
        label: "Add Other Group",
        value: 9999,
      });
      return groupOptions;
    },
    eqpGroupFilterOption: (state) => {
      return state.stateEqpGroupOption;
    },
    eqpBrandOption: (state) => {
      const options = state.stateEqpBrandOption.map((element) => {
        return element;
      });
      options.unshift({
        label: "Add Other Brand",
        value: 9999,
      });
      return options;
    },
    eqpBrandFilterOption: (state) => {
      return state.stateEqpBrandOption;
    },
    eqpModelOption: (state) => {
      const options = state.stateEqpModelOption.map((element) => {
        return element;
      });
      options.unshift({
        label: "Add Other Model",
        value: 9999,
      });
      return options;
    },
    eqpModelFilterOption: (state) => {
      return state.stateEqpModelOption;
    },
    componentOption: (state) => {
      const options = state.stateComponentOption.map((element) => {
        return element;
      });
      options.unshift({
        componentCode: "Others",
        componentName: "Others",
      });
      return options;
    },
    componentFilterOption: (state) => {
      return state.stateComponentOption;
    },
    componentsTable: (state) => {
      return state.stateComponentTable;
    },
  },
  actions: {
    async getLookupSite() {
      const url = `${EQP_CRUD_API_URL}/lookup_site`;
      const params = new URLSearchParams({ ver: "v1" }).toString();
      try {
        const response: AxiosResponse<SingleApiResponse<Content.LookupSiteItem>> =
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
          valueFormat,
        );
      } catch (error) {
        console.log(error);
      }
    },
    async getLookupOwnership() {
      const url = `${EQP_CRUD_API_URL}/lookup_ownership`;
      const params = new URLSearchParams({ ver: "v1" }).toString();
      try {
        const response: AxiosResponse<SingleApiResponse<Content.LookupOwnershipItem>> =
          await ApiService.get(url, "", params);

        const labelFormat = (element) => {
          return element.ownership;
        };
        const valueFormat = (element) => {
          return element.ownershipId;
        };
        this.stateOwnershipOption = mapOptionObject(
          response.data.result.content,
          labelFormat,
          valueFormat,
        );
      } catch (error) {
        console.log(error);
      }
    },
    async getLookupEqpNo() {
      const url = `${EQP_CRUD_API_URL}/lookup_equipment_no`;
      const params = new URLSearchParams({
        ver: "v1",
        siteId: authStore.user.isHO === 1 ? "" : authStore.user.SiteId,
      }).toString();
      try {
        const response: AxiosResponse<SingleApiResponse<Content.LookupEqpNoItem>> =
          await ApiService.get(url, "", params);
        const labelFormat = (element) => {
          return element.equipmentNo;
        };
        const valueFormat = (element) => {
          return element.equipmentNoId;
        };
        this.stateEqpNoOption = mapOptionObject(
          response.data.result.content,
          labelFormat,
          valueFormat,
        );
      } catch (error) {
        console.log(error);
      }
    },
    async getLookupEqpGroup() {
      const url = `${EQP_CRUD_API_URL}/lookup_equipment_group`;
      const params = new URLSearchParams({ ver: "v1" }).toString();
      try {
        const response: AxiosResponse<SingleApiResponse<Content.LookupEqpGroupItem>> =
          await ApiService.get(url, "", params);

        // label and value format element based on response API
        const labelFormat = (element) => {
          return element.equipmentGroup;
        };
        const valueFormat = (element) => {
          return element.equipmentGroupId;
        };
        this.stateEqpGroupOption = mapOptionObject(
          response.data.result.content,
          labelFormat,
          valueFormat,
        );
      } catch (error) {
        console.log(error);
      }
    },
    async getLookupEqpBrand() {
      const url = `${EQP_CRUD_API_URL}/lookup_brand`;
      const params = new URLSearchParams({ ver: "v1" }).toString();
      try {
        const response: AxiosResponse<SingleApiResponse<Content.LookupEqpBrandItem>> =
          await ApiService.get(url, "", params);

        // label and value format element based on response API
        const labelFormat = (element) => {
          return element.brand;
        };
        const valueFormat = (element) => {
          return element.brandId;
        };
        this.stateEqpBrandOption = mapOptionObject(
          response.data.result.content,
          labelFormat,
          valueFormat,
        );
      } catch (error) {
        console.log(error);
      }
    },
    async getLookupEqpModel() {
      const url = `${EQP_CRUD_API_URL}/lookup_equipment_model`;
      const params = new URLSearchParams({ ver: "v1" }).toString();
      try {
        const response: AxiosResponse<SingleApiResponse<Content.LookupEqpModelItem>> =
          await ApiService.get(url, "", params);

        // label and value format element based on response API
        const labelFormat = (element) => {
          return element.equipmentModel;
        };
        const valueFormat = (element) => {
          return element.equipmentModelId;
        };
        this.stateEqpModelOption = mapOptionObject(
          response.data.result.content,
          labelFormat,
          valueFormat,
        );
      } catch (error) {
        console.log(error);
      }
    },
    async getLookupComponent() {
      const url = `${EQP_CRUD_API_URL}/lookup_component`;
      const params = new URLSearchParams({ ver: "v1" }).toString();
      try {
        const response: AxiosResponse<SingleApiResponse<Content.LookupCompItem>> =
          await ApiService.get(url, "", params);
        this.stateComponentOption = response.data.result.content;
      } catch (error) {
        console.log(error);
      }
    },
    getAllLookup() {
      this.getLookupSite();
      this.getLookupOwnership();
      this.getLookupEqpNo();
      this.getLookupEqpGroup();
      this.getLookupEqpBrand();
      this.getLookupEqpModel();
      this.getLookupComponent();
    },
    async upsertDataDraft(isOnlyEqp: boolean) {
      const params = {
        ver: "v1",
      };
      useBulkStore().stateAlert.show = false;

      const formItem = this.stateFormItem[0];
      formItem.resetDate =
        formItem.resetDate === null ? "" : formItem.resetDate;
      const eqpPayload = [
        {
          equipmentDraftId: formItem.equipmentDraftId,
          equipmentUnit: formItem.equipmentUnit,
          siteName: formItem.siteName,
          serialNo: formItem.serialNo,
          group: formItem.group,
          brandName: formItem.brandName,
          model: formItem.model,
          ownership: formItem.ownership,
          resetDate: formItem.resetDate,
          engineHourMeterOffset: formItem.engineHourMeterOffset,
          componentCode: formItem.componentCode,
          componentName: formItem.componentName,
          isActive: formItem.isActive,
        },
      ];
      const hmoPayload = [
        {
          equipmentDraftId: formItem.equipmentDraftId,
          equipmentUnit: formItem.equipmentUnit,
          siteName: formItem.siteName,
          engineHourMeterOffset: formItem.engineHourMeterOffset,
          resetDate: formItem.resetDate,
          isActive: formItem.isActive,
        },
      ];
      const draftPayload = isOnlyEqp ? eqpPayload : hmoPayload;

      const eqpUrl = `${EQP_CRUD_API_URL}/upsert?${new URLSearchParams(
        params,
      ).toString()}`;
      const hmoUrl = `${EQP_HMO_CRUD_URL}/upsert?${new URLSearchParams(
        params,
      ).toString()}`;
      const url = isOnlyEqp ? eqpUrl : hmoUrl;

      const response: AxiosResponse<SingleApiResponse<ContentError>> =
        await ApiService.post(url, draftPayload as AxiosRequestConfig);
      this.stateLoading = false;
      if (!response.data.result.isError) {
        swalAlertSuccessTitle(
          "Record has been submitted successfully",
          "",
          "Ok",
        );
        useBulkStore().removeDraftItemById(formItem.equipmentDraftId);
        useBulkStore().stateAlert.show = false;
        return response;
      } else {
        this.setErrors(
          response.data.result.content.equipmentList[0].validationReason.split(
            ",",
          ),
        );
        swalAlertErrorTitle(`Failed to Submit`, "", "Ok");
        return response;
      }
    },
    async insertData(isOnlyEqp: boolean) {
      this.stateLoading = true;
      try {
        const params = {
          ver: "v1",
        };
        // If editing draft Item
        if (this.stateIsDraftForm) {
          return this.upsertDataDraft(isOnlyEqp);
        }

        const upsertPayload: UpsertItem[] = [];
        if (this.stateComponentTable.length > 0) {
          this.stateComponentTable.forEach((element) => {
            const formData = this.stateFormItem[0];
            const { componentCode, componentName } = element;

            const itemToUpsert = {
              equipmentUnitId: formData.equipmentUnitId,
              equipmentUnit: formData.equipmentUnit,
              siteName: formData.siteName,
              serialNo: formData.serialNo,
              group: formData.group,
              brandName: formData.brandName,
              model: formData.model,
              ownership: formData.ownership,
              engineHourMeterOffset: formData.engineHourMeterOffset,
              resetDate: formData.resetDate,
              isActive: formData.isActive,
              isWarning: formData.isWarning,
              componentCode: componentCode,
              componentName: componentName,
            } as UpsertItem;
            upsertPayload.push(itemToUpsert);
          });
        } else {
          const formData = this.stateFormItem[0];
          formData.componentCode = "";
          formData.componentName = "";
          upsertPayload.push(formData);
        }

        const response: AxiosResponse<SingleApiResponse<ContentError>> =
          await ApiService.post(
            `${EQP_CRUD_API_URL}/upsert?${new URLSearchParams(
              params,
            ).toString()}`,
            upsertPayload as AxiosRequestConfig,
          );
        this.stateLoading = false;
        if (!response.data.result.isError) {
          swalAlertSuccessTitle(
            "Record has been submitted successfully",
            "",
            "Ok",
          );
          return response;
        } else {
          this.setErrors(
            response.data.result.content.equipmentList[0].validationReason.split(
              ",",
            ),
          );
          swalAlertErrorTitle("Failed to Submit", "", "Ok");
          return response;
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      this.stateFormItem = [
        new InitialFormItem(authStore.user),
      ] as UpsertItem[];
      this.stateComponentTable = [] as ComponentItem[];
      this.stateIsNewForm = true;
      this.stateIsDraftForm = false;
    },
  },
});
