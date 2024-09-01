/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  UPDATE_API_URL,
  LOOKUP_INTERVENTION_API_URL,
  LOOKUP_INTERVENTION_HEADER_API_URL,
  GET_FORM_INTERVENTION_API_URL,
  GET_ESTIMATION_COMPLETION_DATE,
  GET_ADDITIONAL_SENSOR_DATA_URL,
  POST_ADDITIONAL_SENSOR_DATA_URL,
} from "./urls";
import {
  LOOKUP_TRANSACTION_API_URL as INTERVENTION_STATUS_API_URL
} from "@/store/pinia/iron-portal/iron-portal-configuration/intervention-status/urls";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  FormIntervention,
  AdditionalSensorData,
  ResponseAdditionalSensorData,
  PayloadAdditionalSensorData
} from "@/core/types/entities/iron-portal/dashboard/intervention/FormIntervention";
import {
  LookupItem1,
  LookupItem2
} from "@/core/types/entities/iron-portal/dashboard/intervention/LookupItem";
import {
  LookupItem as InterventionStatusLookup
} from "@/core/types/entities/iron-portal/iron-portal-configuration/intervention-status/LookupItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  formatDateAUToRegularDate,
  formatDateForPostData,
  formatDateOnlyAU,
  normalizeDate
} from "@/core/helpers/date-format";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import { Option } from "@/core/types/misc/Option";
import {
  mapOptionFromLookupApi,
  mapAllOptionsAsOneLabelAndValue,
  mapOption
} from "@/core/helpers/mapOption";
import {
  UpsertItem,
  InterventionChecksItem
} from "@/core/types/entities/iron-portal/dashboard/intervention/UpsertItem";
import { useInterventionListStore } from "./useInterventionListStore";
import {
  useComponentInterventionDefectsStore
} from "@/store/pinia/dma/component-intervention/defects/useComponentInterventionDefectsStore";
import {
  sendErrorEvent
} from "@/core/helpers/analytics";

const initialFilter = {
  keyPbi: "",
};

const initialForm = {
  interventionHeaderId: 0,
  interventionHeaderSourceId: 0,
  site: "",
  equipmentModel: "",
  equipmentNumberId: 0,
  equipmentNumber: "",
  componentDescription: "",
  componentHours: "",
  interventionReason: "",
  conditionRatingSmu: "",
  conditionRatingDate: "",
  interventionCodeId: "",
  interventionStatus: "",
  interventionDiagnostic: "",
  followUp: "",
  uomId: "",
  followUpPriority: "",
  estimationCompletionDate: "",
  workOrder: "",
  additionalInformation: "",
  interventionExecutionId: 0,
  userRevise: true,
  componentId: 0,
  interventionCosmosId: "",
  component: "",
  keyPbi: "",
  declineReason: "",
  frameHours: "",
  hmOffset: "",
  genericDefect: false,
  canEditComponent: false,
  showConditionRatingDate: "",
  isParameterUpdate: false,
  defectStatusId: null,
  interventionExecutionBy: null,
  executionDateTime: null,
  approveReason: "",
  smuSap: 0,
  statusIP: {
    name: "",
    date: "",
    status: "",
  },
  statusIF : {
    name: "",
    date: "",
    status: "",
  },
  approvedBy: "",
  approveDate: "",
  declinedBy: "",
  declinedDate: "",
  reviseReason: "",
  acceptedby: "",
  accepteddate: "",
  declinedPortalBy: "",
  declinedPortalDate: "",
};

const initialFormLoading = {
  site: false,
  equipmentModel: false,
  equipmentNumber: false,
  componentDescription: false,
  conditionRatingDate: false,
  interventionStatus: false,
  followUpPriority: false,
  estimationCompletionDate: false,
};

export const useInterventionFormStore = defineStore({
  id: "formIntervention",
  state: () => {
    return {
      stateIsFromEquipment: false,
      stateIsFromIntervention: false,
      stateFormFilter: initialFilter,
      stateFormIntervention: {
        ...initialForm
      } as FormIntervention,
      stateFormLoading: {
        ...initialFormLoading
      },
      stateListAdditionalSensorData: [] as AdditionalSensorData[],
      stateIsError: false,
      stateError: "",
      stateErrors: [] as string[],
      stateLoading: false,
      stateSiteOption: [] as Option[],
      stateEquipmentModelOption: [] as Option[],
      stateEquipmentNumberOption: [] as Option[],
      stateComponentOption: [] as Option[],
      stateConditionRatingDateOption: [] as Option[],
      stateInterventionStatusOption: [] as Option[],
      stateFollowUpPriorityOption: [] as Option[],
      stateHeaderCbm: "",
      stateFormCbmHeaderVisibility: false,
      statePsTypeCbm: "",
      stateGenericDefectLoading: false,
      stateIsAdditionalSensorExist: false,
    }
  },
  getters: {
    listAdditionalSensorData: (state) => {
      return state.stateListAdditionalSensorData;
    },
    isAdditionalSensorExist: (state) => {
      return state.stateIsAdditionalSensorExist
    },
    isFromEquipment: (state) => {
      return state.stateIsFromEquipment;
    },
    isFromIntervention: (state) => {
      return state.stateIsFromIntervention;
    },
    formIntervention: (state) => {
      return state.stateFormIntervention;
    },
    formFilter: (state) => {
      return state.stateFormFilter
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
    equipmentModelOption: (state) => {
      return state.stateEquipmentModelOption;
    },
    equipmentNumberOption: (state) => {
      return state.stateEquipmentNumberOption;
    },
    componentOption: (state) => {
      return state.stateComponentOption;
    },
    conditionRatingDateOption: (state) => {
      return state.stateConditionRatingDateOption;
    },
    interventionStatusOption: (state) => {
      return state.stateInterventionStatusOption;
    },
    followUpPriorityOption: (state) => {
      return state.stateFollowUpPriorityOption;
    },
    formLoading: (state) => {
      return state.stateFormLoading;
    },
    genericLoading: (state) => {
      return state.stateGenericDefectLoading
    },
    headerCbm: (state) => {
      return state.stateHeaderCbm;
    },
    formCbmHeaderVisibility: (state) => {
      return state.stateFormCbmHeaderVisibility
    },
    psTypeCbm: (state) => {
      return state.statePsTypeCbm
    },
    isCannotReviseOrSubmit: (state) => {
      return (state.stateFormIntervention.interventionExecutionId < 1 || state.stateFormIntervention.interventionExecutionId > 4) ||
      (!state.stateFormIntervention.userRevise &&
      !(state.stateFormIntervention.interventionHeaderId == 0 || state.stateFormIntervention.interventionHeaderId == null));
    },
  },
  actions: {
    async getSiteLookup(isSearch = false) {
      this.stateFormLoading.site = true;
      const params = {
        ver: "v1",
        equipmentModel: this.formIntervention.equipmentModel || "",
        equipmentNumber: this.formIntervention.equipmentNumber || "",
      };
      try {
        const response: AxiosResponse<SingleApiResponse<LookupItem1>> = await ApiService.get(LOOKUP_INTERVENTION_API_URL, "", new URLSearchParams(params).toString());
        if (isSearch) {
          this.stateFormIntervention.site = response.data.result.content.site.siteDescription[0] || ""
        }
        this.stateSiteOption = mapOption(response.data.result.content.site.siteDescription);
      } catch (error) {
        sendErrorEvent('IRONS', error);
        console.log(error);
      } finally {
        this.stateFormLoading.site = false;
      }
    },
    async getEquipmentModelLookup(isSearch = false) {
      this.stateFormLoading.equipmentModel = true;
      const params = {
        site: this.formIntervention.site || "",
        equipmentNumber: this.formIntervention.equipmentNumber || "",
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<LookupItem1>> = await ApiService.get(LOOKUP_INTERVENTION_API_URL, "", new URLSearchParams(params).toString());
        if (isSearch) {
          this.stateFormIntervention.equipmentModel = response.data.result.content.equipmentModel[0] || ""
        }
        this.stateEquipmentModelOption = mapOption(response.data.result.content.equipmentModel);
      } catch (error) {
        sendErrorEvent('IRONS', error);
        console.log(error);
      } finally {
        this.stateFormLoading.equipmentModel = false;
      }
    },
    async getEquipmentNumberLookup() {
      this.stateFormLoading.equipmentNumber = true;
      const params = {
        site: this.formIntervention.site || "",
        equipmentModel: this.formIntervention.equipmentModel || "",
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<LookupItem1>> = await ApiService.get(LOOKUP_INTERVENTION_API_URL, "", new URLSearchParams(params).toString());
        this.stateEquipmentNumberOption = mapOption(response.data.result.content.equipmentNumber);
      } catch (error) {
        sendErrorEvent('IRONS', error);
        console.log(error);
      } finally {
        this.stateFormLoading.equipmentNumber = false;
      }
    },
    async getComponentLookup() {
      this.stateFormLoading.componentDescription = true;
      const params = {
        equipmentNumber: this.formIntervention.equipmentNumber || "",
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<LookupItem2>> = await ApiService.get(LOOKUP_INTERVENTION_API_URL, "", new URLSearchParams(params).toString());
        this.stateComponentOption = mapOption(response.data.result.content.component);
      } catch (error) {
        sendErrorEvent('IRONS', error);
        console.log(error);
      } finally {
        this.stateFormLoading.componentDescription = false;
      }
    },
    async getConditionRatingDateLookup() {
      this.stateFormLoading.conditionRatingDate = true;
      const params = {
        equipmentNumber: this.formIntervention.equipmentNumber || "",
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<LookupItem2>> = await ApiService.get(LOOKUP_INTERVENTION_HEADER_API_URL, "", new URLSearchParams(params).toString());
        this.stateConditionRatingDateOption = response.data.result.content.conditionRatingDate.map((ratingDate, idx) => {
          return {
            label: `${formatDateOnlyAU(ratingDate)} | ${response.data.result.content.interventionCodeId[idx]}`,
            value: `${idx}`,
            conditionRatingDate: formatDateOnlyAU(ratingDate),
            componentHours: response.data.result.content.componentHours[idx],
            interventionReason: response.data.result.content.interventionReason[idx],
            conditionRatingSmu: response.data.result.content.conditionRatingSmu[idx],
            interventionCodeId: response.data.result.content.interventionCodeId[idx],
            keyPbi: response.data.result.content.keyPbi[idx],
          }
        })
      } catch (error) {
        sendErrorEvent('IRONS', error);
        console.log(error);
      } finally {
        this.stateFormLoading.conditionRatingDate = false;
      }
    },
    async getInterventionStatusLookup() {
      this.stateFormLoading.interventionStatus = true;
      const params = {
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<InterventionStatusLookup>> = await ApiService.get(INTERVENTION_STATUS_API_URL, "", new URLSearchParams(params).toString());
        this.stateInterventionStatusOption = mapOptionFromLookupApi(response.data.result.content, "interventionStatus", "interventionStatusDesc");
      } catch (error) {
        sendErrorEvent('IRONS', error);
        console.log(error);
      } finally {
        this.stateFormLoading.interventionStatus = false;
      }
    },
    async getFollowUpPriorityLookup() {
      this.stateFormLoading.followUpPriority = true;
      const params = {
        interventionStatus: 'Accepted',
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<InterventionStatusLookup>> = await ApiService.get(INTERVENTION_STATUS_API_URL, "", new URLSearchParams(params).toString());
        this.stateFollowUpPriorityOption = mapAllOptionsAsOneLabelAndValue({
          followUpPriority: response.data.result.content.followUpPriority,
          followUpPriorityUom: response.data.result.content.followUpPriorityUom
        }, " ");
        this.stateFollowUpPriorityOption.sort((a, b) => {
          const followUpPriorityA = parseInt(a.value.replace(" hrs", ""));
          const followUpPriorityB = parseInt(b.value.replace(" hrs", ""));
          if (followUpPriorityA < followUpPriorityB) return -1;
          if (followUpPriorityA > followUpPriorityB) return 1;
          return 0;
        })
      } catch (error) {
        sendErrorEvent('IRONS', error);
        console.log(error);
      } finally {
        this.stateFormLoading.followUpPriority = false;
      }
    },
    async getFormIntervention() {
      const defectStore = useComponentInterventionDefectsStore();
      const authStore = useAuthenticationStore();
      const params = {
        employeeId: authStore.user.EmployeeId || "",
        keyPbi: this.stateFormFilter.keyPbi || "",
        ver: "v1"
      };

      try {
        this.stateLoading = true;
        const response: AxiosResponse<SingleApiResponse<FormIntervention>> = await ApiService.get(GET_FORM_INTERVENTION_API_URL, "", new URLSearchParams(params).toString());
        console.log("Form Intervention", response.data.result.content);
        if (response.data.result.content[0]) {
          let arrayTempReason = response.data.result.content[0].interventionReason == "" || response.data.result.content[0].interventionReason == null ? [] : response.data.result.content[0].interventionReason.split("<br> ")
          arrayTempReason = arrayTempReason.sort((a, b) => {
            return a.includes("CRITICAL") && b.includes("CAUTION") ? -1 : 1
          })

          this.stateFormIntervention.interventionHeaderId = response.data.result.content[0].interventionHeaderId;
          this.stateFormIntervention.interventionHeaderSourceId = response.data.result.content[0].interventionHeaderSourceId;
          this.stateFormIntervention.componentHours = response.data.result.content[0].componentHours;
          this.stateFormIntervention.conditionRatingSmu = response.data.result.content[0].conditionRatingSmu;
          this.stateFormIntervention.interventionStatus = response.data.result.content[0].interventionStatus || "";
          this.stateFormIntervention.interventionDiagnostic = response.data.result.content[0].interventionDiagnostic || "";
          this.stateFormIntervention.followUpPriority = response.data.result.content[0].followUpPriority || "";
          this.stateFormIntervention.estimationCompletionDate = response.data.result.content[0].estimationCompletionDate || "";
          this.stateFormIntervention.workOrder = response.data.result.content[0].workOrder || "";
          this.stateFormIntervention.additionalInformation = response.data.result.content[0].additionalInformation;
          this.stateFormIntervention.interventionExecutionId = response.data.result.content[0].interventionExecutionId;
          this.stateFormIntervention.userRevise = response.data.result.content[0].userRevise;
          this.stateFormIntervention.keyPbi = response.data.result.content[0].keyPbi;
          this.stateFormIntervention.declineReason = response.data.result.content[0].declineReason;
          this.stateFormIntervention.interventionCosmosId = response.data.result.content[0].interventionCosmosId
          this.stateFormIntervention.genericDefect = response.data.result.content[0].genericDefect
          this.stateFormIntervention.site = response.data.result.content[0].site
          this.stateFormIntervention.equipmentModel = response.data.result.content[0].equipmentModel;
          this.stateFormIntervention.equipmentNumber = response.data.result.content[0].equipmentNumber;
          this.stateFormIntervention.conditionRatingDate = formatDateOnlyAU(response.data.result.content[0].conditionRatingDate) || "";
          this.stateFormIntervention.interventionReason = arrayTempReason.join("<br> ");
          this.stateFormIntervention.frameHours = response.data.result.content[0].frameHours || "0";
          this.stateFormIntervention.showConditionRatingDate = response.data.result.content[0].showConditionRatingDate || "";
          this.stateFormIntervention.isParameterUpdate = response.data.result.content[0].isParameterUpdate || false;
          this.stateFormIntervention.defectStatusId = response.data.result.content[0].defectStatusId || null;
          this.stateFormIntervention.interventionExecutionBy = response.data.result.content[0].interventionExecutionBy || null;
          this.stateFormIntervention.executionDateTime = response.data.result.content[0].executionDateTime || null;
          this.stateFormIntervention.approveReason = response.data.result.content[0].approveReason;
          this.stateFormIntervention.smuSap = response.data.result.content[0].smuSap;
          this.stateFormIntervention.statusIP = {
            name: response.data.result.content[0].statusIP.name,
            date: response.data.result.content[0].statusIP.date,
            status: response.data.result.content[0].statusIP.status,
          }
          this.stateFormIntervention.statusIF  = {
            name: response.data.result.content[0].statusIF.name,
            date: response.data.result.content[0].statusIF.date,
            status: response.data.result.content[0].statusIF.status,
          }
          this.stateFormIntervention.approvedBy = response.data.result.content[0].approvedBy;
          this.stateFormIntervention.approveDate = response.data.result.content[0].approveDate;
          this.stateFormIntervention.reviseReason = response.data.result.content[0].reviseReason;
          this.stateFormIntervention.declinedBy = response.data.result.content[0].declinedBy;
          this.stateFormIntervention.declinedDate = response.data.result.content[0].declinedDate;
          this.stateFormIntervention.acceptedby = response.data.result.content[0].acceptedby;
          this.stateFormIntervention.accepteddate = response.data.result.content[0].accepteddate;
          this.stateFormIntervention.declinedPortalBy = response.data.result.content[0].declinedPortalBy;
          this.stateFormIntervention.declinedPortalDate = response.data.result.content[0].declinedPortalDate;

          this.stateGenericDefectLoading = true
          await defectStore.getDefectsDataAll(this.stateFormIntervention.interventionCosmosId)
          this.stateGenericDefectLoading = false

          // Additional Sensor Data Checking
          if (this.stateFormIntervention.isParameterUpdate) {
            this.setIsAdditionalSensorExist(true)
            await this.getAdditionalSensorData()
          }
        }
      } catch (error: any) {
        sendErrorEvent('IRONS', error);
        console.log(error);
        if (error.response.data.statusCode == 401) {
          this.stateLoading = false;
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        console.log(error)
      } finally {
        this.stateLoading = false;
      }
    },
    async getAdditionalSensorData() {
      const params = {
        keyPbi: this.stateFormIntervention.keyPbi,
        ver: "v1"
      }
      try {
        this.stateLoading = true;
        const response: AxiosResponse<SingleApiResponse<ResponseAdditionalSensorData>> = await ApiService.get(GET_ADDITIONAL_SENSOR_DATA_URL, "", new URLSearchParams(params).toString());
        this.stateListAdditionalSensorData = []
        response.data.result.content.sensors.forEach((e) => {
          this.stateListAdditionalSensorData.push({
            id: e.id,
            interventionReason: e.interventionReason,
            isCheck: true
          })
        })
      } catch (error) {
        sendErrorEvent('IRONS', error);
        console.log(error)
      } finally {
        this.stateLoading = false
      }
    },
    async postAdditionalSensorData(isRevise: boolean) {
      const auth = useAuthenticationStore()
      const params = {
        userAccount: auth.user.Name,
        ver: "v1"
      }

      const payload = {
        keyPbi: this.stateFormIntervention.keyPbi,
        isRevise: isRevise,
        employeeId: auth.user.EmployeeId,
        employeeName: auth.user.Name,
        sensors: [] as PayloadAdditionalSensorData[]
      }
      this.stateListAdditionalSensorData.forEach((e) => {
        payload.sensors.push({
          id: e.id,
          isCheck: e.isCheck
        })
      })

      return new Promise((resolve, reject) => {
        this.stateLoading = true
        ApiService.post(`${POST_ADDITIONAL_SENSOR_DATA_URL}?${new URLSearchParams(params).toString()}`, payload as AxiosRequestConfig)
          .then((response) => {
            resolve(response.data.result)
          })
          .catch((error) => {
            sendErrorEvent('IRONS', error);
            console.log(error.response)
            resolve(error.response.data.result)
          })
          .finally(() => {
            this.stateLoading = false
          })
      })
    },
    resetInterventionWhenStatusIsDeclined() {
      this.stateFormIntervention.interventionDiagnostic = "";
      this.stateFormIntervention.followUpPriority = "";
      this.stateFormIntervention.estimationCompletionDate = "";
      this.stateFormIntervention.workOrder = "";
    },
    resetFollowUpPriorityOption() {
      this.stateFollowUpPriorityOption = [];
    },
    async getEstimationCompletionDate() {
      this.stateFormLoading.estimationCompletionDate = true;
      const params = {
        equipmentModel: this.stateFormIntervention.equipmentModel,
        site: this.stateFormIntervention.site,
        followUpPriority: this.stateFormIntervention.followUpPriority,
        sampleDate: this.stateFormIntervention.conditionRatingDate ? formatDateForPostData(normalizeDate(formatDateAUToRegularDate(this.stateFormIntervention.conditionRatingDate))) : "",
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<{estimationCompletionDate: string}>> = await ApiService.get(GET_ESTIMATION_COMPLETION_DATE, "", new URLSearchParams(params).toString());
        this.stateFormIntervention.estimationCompletionDate = response.data.result.content.estimationCompletionDate;
      } catch (error: any) {
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        sendErrorEvent('IRONS', error);
        console.log(error)
      } finally {
        this.stateFormLoading.estimationCompletionDate = false;
      }
    },
    async updateData(employeeName: string, employeeId: string) {
      const interventionListStore = useInterventionListStore();

      try {
        this.stateLoading = true;
        const params = {
          userAccount: employeeName,
          ver: "v1"
        };
        const formData = {
          employeeName: employeeName,
          employeeId: employeeId,
          interventionHeaderId: this.stateFormIntervention.interventionHeaderId,
          interventionHeaderSourceId: this.stateFormIntervention.interventionHeaderSourceId,
          site: this.stateFormIntervention.site,
          equipmentModel: this.stateFormIntervention.equipmentModel,
          equipmentNumber: this.stateFormIntervention.equipmentNumber,
          interventionReason: this.stateFormIntervention.interventionReason,
          conditionRatingSmu: Number(this.stateFormIntervention.conditionRatingSmu),
          conditionRatingDate: formatDateForPostData(normalizeDate(formatDateAUToRegularDate(this.stateFormIntervention.conditionRatingDate))),
          interventionCodeId: this.stateFormIntervention.interventionCodeId,
          interventionStatus: this.stateFormIntervention.interventionStatus,
          interventionDiagnostic: this.stateFormIntervention.interventionDiagnostic,
          followUpPriority: this.stateFormIntervention.followUpPriority,
          estimationCompletionDate: this.stateFormIntervention.estimationCompletionDate ? formatDateForPostData(normalizeDate(new Date(this.stateFormIntervention.estimationCompletionDate))) : null,
          workOrder: this.stateFormIntervention.workOrder,
          isRevise: this.stateFormIntervention.interventionHeaderId ? true : false,
          additionalTask: [
            ...interventionListStore.additionalTaskList,
            ...interventionListStore.deletedAdditionalTaskList,
          ],
          keyPbi: this.stateFormIntervention.keyPbi,
          interventionChecks: this.getInterventionChecksForRequest(),
          componentAffected: [
            ...interventionListStore.componentList
          ],
          declineReason: this.stateFormIntervention.interventionStatus == 'Declined' ? this.stateFormIntervention.declineReason : "",
          reviseReason: this.stateFormIntervention.interventionStatus == 'Accepted' ? this.stateFormIntervention.reviseReason : "",
          isDma: false,
        };
        console.log(formData)
        const response: AxiosResponse<SingleApiResponse<undefined>> = await ApiService.post(`${UPDATE_API_URL}?${new URLSearchParams(params).toString()}`, formData as AxiosRequestConfig)
        if (response.data.title === "Error") {
          this.stateErrors.push(response.data.result.message);
          this.stateIsError = true;
        } else {
          this.stateError = "";
          this.stateIsError = false;
        }
      } catch (error: any) {
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        this.stateError = error as string;
        sendErrorEvent('IRONS', error);
        console.log(error)
        this.stateErrors.push(error.response.data.result.message);
        this.stateIsError = true;
      } finally {
        this.stateLoading = false;
      }
    },
    setErrors(errors: string[]) {
      this.stateErrors = errors;
      this.stateIsError = this.stateErrors.length > 0;
    },
    setIsError(isError) {
      this.stateIsError = isError;
    },
    setFormFilter(filter) {
      this.stateFormFilter.keyPbi = filter.keyPbi || ""
    },
    setIsFromEquipment(bool: boolean) {
      this.stateIsFromEquipment = bool;
    },
    setIsFromIntervention(bool: boolean) {
      this.stateIsFromIntervention = bool;
    },
    updateInterventionReason(updatedReason: string) {
      this.stateFormIntervention.interventionReason = updatedReason;
    },
    setIsAdditionalSensorExist(bool: boolean) {
      this.stateIsAdditionalSensorExist = bool;
    },
    resetFormIntervention() {
      this.stateFormIntervention.interventionHeaderId = 0;
      this.stateFormIntervention.interventionHeaderSourceId = 0;
      this.stateFormIntervention.conditionRatingDate = "";
      this.stateFormIntervention.componentHours = "";
      this.stateFormIntervention.conditionRatingSmu = "";
      this.stateFormIntervention.interventionReason = "";
      this.stateFormIntervention.interventionCodeId = "";
      this.stateFormIntervention.interventionStatus = "";
      this.stateFormIntervention.interventionDiagnostic = "";
      this.stateFormIntervention.followUpPriority = "";
      this.stateFormIntervention.estimationCompletionDate = "";
      this.stateFormIntervention.workOrder = "";
      this.stateFormIntervention.additionalInformation = "";
      this.stateFormIntervention.interventionExecutionId = 0;
      this.stateFormIntervention.keyPbi = "";
      this.stateFormIntervention.declineReason = "";
      this.stateFormIntervention.frameHours = "";
      this.stateFormIntervention.canEditComponent = false;
      this.stateFormIntervention.showConditionRatingDate = "";
      this.stateFormIntervention.interventionExecutionBy = null;
      this.stateFormIntervention.executionDateTime = null;
      this.stateFormIntervention.approveReason = "";
      this.stateFormIntervention.smuSap = 0;
      this.stateFormIntervention.statusIP = {
        name: "",
        date: "",
        status: "",
      }
      this.stateFormIntervention.statusIF  = {
        name: "",
        date: "",
        status: ""
      }
      this.stateFormIntervention.approvedBy = "";
      this.stateFormIntervention.approveDate = "";
      this.stateFormIntervention.reviseReason = "";
      this.stateFormIntervention.declinedBy = "";
      this.stateFormIntervention.declinedDate = "";
      this.stateFormIntervention.acceptedby = "";
      this.stateFormIntervention.accepteddate = "";
      this.stateFormIntervention.declinedPortalBy = "";
      this.stateFormIntervention.declinedPortalDate = "";
      this.stateIsFromEquipment = false;
      this.stateIsError = false;
      this.stateError = "";
      this.stateErrors = [] as string[];
      this.stateFormFilter.keyPbi = "";
    },
    resetFormInterventionAndFilter() {
      this.stateFormIntervention = {
        ...initialForm
      } as FormIntervention;
    },
    setHeaderCbm(data) {
      this.stateHeaderCbm = data;
    },
    setFormCbmHeaderVisibility(flag: boolean) {
      this.stateFormCbmHeaderVisibility = flag
    },
    setPsTypeCbm(psType) {
      this.statePsTypeCbm = psType
    },
    getInterventionChecksForRequest(): InterventionChecksItem[] {
      const interventionListStore = useInterventionListStore();
      return interventionListStore.interventionCheckList.map((item) => {
        return {
          interventionDetailId: item.interventionDetailId,
          interventionDetailSourceId: item.interventionDetailSourceId,
          sequence: item.isMandatory ? item.sequence : null,
          isMandatory: item.isMandatory,
          keyPbi: item.keyPbi,
          isActive: item.isActive
        }
      })
    },
    resetGeneric(isReset = false) {
      if (isReset) {
        const defectStore = useComponentInterventionDefectsStore();
        defectStore.reset()
        return
      }
      this.stateGenericDefectLoading = false
    },
    async getDataFromKeyPbi(keyPbi: string) {
      const listStore = useInterventionListStore();
      this.stateFormFilter.keyPbi = keyPbi;
      listStore.setFilter({ keyPbi: keyPbi });
      this.getFollowUpPriorityLookup();
      this.getInterventionStatusLookup();

      try {
        await this.getFormIntervention()
        const status = listStore.mapHeaderFromExecutionIdAndDefectId(this.stateFormIntervention.interventionExecutionId, this.stateFormIntervention.defectStatusId)

        // Urutan await dalam if else berpengaruh pada tick/untick
        // component affected dan intervention checks!
        // Tolong jangan diganti!
        if (this.stateIsFromEquipment && status == "Pending Evaluation") {
          // JANGAN DIJADIKAN SATU
          await Promise.all([
            listStore.getInterventionCheckList(),
            listStore.getAdditionalTaskList()
          ]);
          await listStore.getComponentList(true)
        } else {
          // JANGAN DIJADIKAN SATU
          listStore.resetFewList();
          await Promise.all([
            listStore.getComponentList(),
            listStore.getAdditionalTaskList(),
          ]);
          await listStore.getInterventionCheckList()
        }
        listStore.getInterventionChecksImage();
        this.getSiteLookup();
        this.getEquipmentModelLookup();
        this.getEquipmentNumberLookup();
        this.getComponentLookup();
        this.getConditionRatingDateLookup();
      } catch (error) {
        console.error(error);
      }
    },
  }
});
