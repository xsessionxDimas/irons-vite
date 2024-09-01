import { defineStore } from "pinia";
import {
  updateLoggedInStatusFromAPIResponse
} from "@/core/helpers/authentication-handler";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import ApiService from "@/core/services/ApiService";
import {
  SOS_COMPARTMENT_API_URL,
  SOS_COOLANT_API_URL,
  SOS_GENERATE_LABEL_API_URL,
  SOS_HISTORY_API_URL,
  SOS_LABEL_API_URL,
  SOS_OIL_GRADE_API_URL,
  SOS_OIL_TYPE_API_URL,
  SOS_UPDATE_DATA_API_URL
} from "./urls";
import { SosHistory } from "@/core/types/entities/dma/sos/SosHistory";
import { Option } from "@/core/types/misc/Option";
import { SosCompartment } from "@/core/types/entities/dma/sos/SosCompartment";
import { SosLabel } from "@/core/types/entities/dma/sos/SosLabel";
import { sendErrorEvent } from "@/core/helpers/analytics";
import {
  SosGeneratedLabel
} from "@/core/types/entities/dma/sos/SosGeneratedLabel";
import {
  SosErrorField,
  SosErrorFieldItems
} from "@/core/types/entities/dma/sos/SosErrorField";
import {
  Employee,
  SosPayloadEdit,
  SosPropertyParams,
  SosUpdateParams
} from '@/core/types/entities/dma/sos/SosPayloadEdit';
import {
  SosCoolant,
  SosOilGrade,
  SosOilType
} from "@/core/types/entities/dma/sos/SosItem";

export const useSosStore = defineStore({
  id: "sos",
  state: () => {
    return {
      stateSosHistory: [] as SosHistory[],
      stateSosHistoryOptions: [] as Option[],
      stateSelectedSosHistory: {} as SosHistory,
      stateSosCompartment: [] as SosCompartment[],
      stateSelectedSosCompartment: [] as Option[],
      stateSosLabel: {} as SosLabel,
      stateGeneratedLabel: [] as SosGeneratedLabel[],
      stateSosLabelBefore: {} as SosLabel,
      stateErrorField: [
        {
          field: 'sampleDate',
          items: [] as SosErrorFieldItems[]
        },
        {
          field: 'lastMeterHrs',
          items: [] as SosErrorFieldItems[]
        },
        {
          field: 'fuelBurn',
          items: [] as SosErrorFieldItems[]
        }
      ] as SosErrorField[],
      stateEmployeeData: {
        id: '',
        name: '',
      },
      statePayloadEdit: {
        id: '',
        workOrder: '',
        employee: {} as Employee,
        updateParams: [
          {
            keyValue: '',
            propertyParams: [] as SosPropertyParams[]
          }
        ] as SosUpdateParams[]
      } as SosPayloadEdit,
      stateAlertVisibility: false,
      stateAlertType: 'success',
      stateAlertMessage: '',
      stateIsSaveDisabled: true,
      stateOilTypeList: [] as SosOilType[],
      stateOilGradeList: [] as SosOilGrade[],
      stateCoolantList: [] as SosCoolant[]
    }
  },
  getters: {
    SosHistory: (state) => {
      return state.stateSosHistory
    },
    SosHistoryOptions: (state) => {
      return state.stateSosHistoryOptions
    },
    SelectedSosHistory: (state) => {
      return state.stateSelectedSosHistory
    },
    SosCompartment: (state) => {
      return state.stateSosCompartment
    },
    FormattedSosCompartment: (state) => {
      if (Object.keys(state.stateSosCompartment).length) {
        const compartments = state.stateSosCompartment.map((task) => {
          return {
            value: task.taskKeyOilSample,
            label: task.compartmentLubricant,
            status: task.errorMsg,
            labelNumber: task.label
          }
        })
        return compartments
      } else {
        return []
      }
    },
    SelectedSosCompartment: (state) => {
      return state.stateSelectedSosCompartment
    },
    SosLabel: (state) => {
      return state.stateSosLabel
    },
    SosGeneratedLabel: (state) => {
      return state.stateGeneratedLabel
    },
    SosEditErrors: (state) => {
      return state.stateErrorField
    },
    AlertVisibility: (state) => {
      return state.stateAlertVisibility
    },
    AlertType: (state) => {
      return state.stateAlertType
    },
    AlertMessage: (state) => {
      return state.stateAlertMessage
    },
    IsSaveDisabled: (state) => {
      return state.stateIsSaveDisabled
    },
    OilTypeList: (state) => {
      return state.stateOilTypeList
    },
    OilGradeList: (state) => {
      return state.stateOilGradeList
    },
    CoolantList: (state) => {
      return state.stateCoolantList
    }
  },
  actions: {
    async getSosHistory(site) {
      try {
        const params = {
          ver: "v1",
          siteId: 'AU03'
        }
        const response: AxiosResponse<ApiResponse<SosHistory>> = await ApiService.get(SOS_HISTORY_API_URL, "", new URLSearchParams(params).toString());
        this.stateSosHistory = response.data.result.content;
        this.formatSosHistoryOptions();
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error);
      }
    },
    formatSosHistoryOptions() {
      this.stateSosHistoryOptions = this.stateSosHistory.map((item) => {
        return {
          label: `${item.equipment} - ${item.modelId} - ${item.psTypeId == null ? '' : item.psTypeId + ' Hr Service - '}${item.workOrder} - ${item.eformType}`,
          value: item.workOrder
        }
      })
    },
    setSelectedSos(option: Option) {
      const sos = this.stateSosHistory.find((s) => {
        return s.workOrder == option.value;
      })
      if (sos) {
        this.stateSelectedSosHistory = sos;
      }
    },
    async getSosCompartment(payload) {
      try {
        const response: AxiosResponse = await ApiService.post(SOS_COMPARTMENT_API_URL, payload);
        this.stateSosCompartment = response.data.result.content;
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error);
      }
    },
    checkLatestCompartmentList() {
      // check the latest compartment list
      // and remove selected compartment if not contained on that list
      const taskKeyCompartments = this.stateSosCompartment
        .filter((item) => {
          return item.isError === "False";
        })
        .map((item) => {
          return item.taskKeyOilSample;
        });
      const filteredSelectedCompartment = this.stateSelectedSosCompartment.filter((item) => {
        return taskKeyCompartments.includes(item.value)
      });
      this.stateSelectedSosCompartment = filteredSelectedCompartment;
    },
    checkSortSelectedCompartment() {
      // sort selected compartment based on the latest compartment list
      const orderMap = {};
      this.stateSosCompartment.forEach((item, index) => {
        orderMap[item.taskKeyOilSample] = index;
      });
      this.stateSelectedSosCompartment.sort((a, b) => {
        return orderMap[a.value] - orderMap[b.value]
      });
    },
    async getLabelData(payload) {
      try {
        const response: AxiosResponse = await ApiService.post(SOS_LABEL_API_URL, payload);
        this.stateSosLabel = response.data.result.content;
        this.generatePayloadEdit();
        this.generateErrorField();
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error);
        sendErrorEvent('IRONS', error);
        console.log(error);
      }
    },
    async generateLabel(payload) {
      try {
        const response: AxiosResponse = await ApiService.post(SOS_GENERATE_LABEL_API_URL, payload);
        if (response && response.data.statusCode == 200) {
          this.stateGeneratedLabel = response.data.result.content;
          this.mapGeneratedLabel();
        }
        return response;
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error);
        sendErrorEvent('IRONS', error);
        console.log(error);
      }
    },
    mapGeneratedLabel() {
      for (let idxLabel = 0; idxLabel < this.stateSosLabel.details.length; idxLabel++) {
        for (let idxGenerated = 0; idxGenerated < this.stateGeneratedLabel.length; idxGenerated++) {
          if (this.stateSosLabel.details[idxLabel].key == this.stateGeneratedLabel[idxGenerated].taskKey) {
            this.stateSosLabel.details[idxLabel]['label'] = this.stateGeneratedLabel[idxGenerated].label;
          }
        }
      }
    },
    updateSosData(params, indexData, val) {
      this.stateSosLabel.details[indexData][params] = val;
      this.updatePayload(params, indexData, val);
    },
    updatePayloadGeneralData(params, val) {
      this.showChangesWarning();
      const indexParams = this.statePayloadEdit.updateParams.findIndex((item) => {
        return item.keyValue === this.stateSosLabel.key
      });
      const indexProperty = this.statePayloadEdit.updateParams[indexParams].propertyParams.findIndex((item) => {
        return item.propertyName == params
      })
      if (indexProperty !== -1) {
        this.statePayloadEdit.updateParams[indexParams].propertyParams[indexProperty].propertyValue = val;
      } else {
        this.statePayloadEdit.updateParams[indexParams].propertyParams.push({
          propertyName: params,
          propertyValue: val
        })
      }
    },
    updatePayload(params, indexData, val) {
      this.showChangesWarning();
      const keyValue = this.stateSosLabel.details[indexData].key;
      this.statePayloadEdit.updateParams.forEach((element) => {
        if (element.keyValue == keyValue) {
          const index = element.propertyParams.findIndex((item) => {
            return item.propertyName === params
          });
          if (index !== -1) {
            // If the object exists, update its propertyValue
            element.propertyParams[index].propertyValue = val;
          } else {
            // If the object does not exist, add a new object to the array
            element.propertyParams.push({
              propertyName: params,
              propertyValue: val
            });
          }
        }
      });
    },
    generatePayloadEdit() {
      this.statePayloadEdit.id = this.stateSosLabel.id;
      this.statePayloadEdit.workOrder = this.stateSosLabel.workOrder;
      const params: SosUpdateParams[] = [];
      this.stateSosLabel.details.forEach((item) => {
        params.push({
          keyValue: item.key,
          propertyParams: [
            {
              "propertyName": "updatedDate",
              "propertyValue": "<<ServerDateTime>>"
            }
          ] as SosPropertyParams[]
        })
      });
      params.push({
        keyValue: this.stateSosLabel.key,
        propertyParams: [
          {
            "propertyName": "updatedDate",
            "propertyValue": "<<ServerDateTime>>"
          }
        ] as SosPropertyParams[]
      });
      this.statePayloadEdit.updateParams = params;
    },
    generateErrorField() {
      for (let index = 0; index < this.stateSosLabel.details.length; index++) {
        this.stateErrorField[0].items.push({
          message: ''
        });
        this.stateErrorField[1].items.push({
          message: ''
        });
        this.stateErrorField[2].items.push({
          message: ''
        });
      }
    },
    async saveLabelDataChanged() {
      this.updateEmployeeOnPayload();
      try {
        const response: AxiosResponse = await ApiService.post(`${SOS_UPDATE_DATA_API_URL}&Eform=${this.stateSosLabel.eformType}`, this.statePayloadEdit);
        return response;
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error);
        sendErrorEvent('IRONS', error);
        console.log(error);
      }
    },
    updateEmployeeOnPayload() {
      this.statePayloadEdit.employee = this.stateEmployeeData;
      this.statePayloadEdit.updateParams.forEach((params) => {
        params.propertyParams.push({
          propertyName: 'updatedBy',
          propertyValue: JSON.stringify(this.stateEmployeeData),
        })
      });
    },
    showChangesWarning() {
      this.stateAlertType = 'warning';
      this.stateAlertMessage = "You've just made some changes and might need to be saved";
      this.stateAlertVisibility = true;
      this.stateIsSaveDisabled = false;
    },
    resetPayload() {
      this.statePayloadEdit = {
        id: '',
        workOrder: '',
        employee: {} as Employee,
        updateParams: [
          {
            keyValue: '',
            propertyParams: [] as SosPropertyParams[]
          }
        ] as SosUpdateParams[]
      } as SosPayloadEdit;
      this.generatePayloadEdit();
    },
    updateErrorWarning(indexParam, indexItem, message) {
      this.stateErrorField[indexParam].items[indexItem].message = message;
    },
    async getOilTypeList() {
      try {
        const response: AxiosResponse = await ApiService.get(SOS_OIL_TYPE_API_URL);
        if (response.data.result.content) {
          this.stateOilTypeList = response.data.result.content;
        } else {
          this.stateOilTypeList = [];
        }
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error);
        sendErrorEvent('IRONS', error);
        console.log(error);
      }
    },
    async getOilGradeList(oilTypeId: string) {
      try {
        const response: AxiosResponse = await ApiService.get(SOS_OIL_GRADE_API_URL + `&oilTypeId=${oilTypeId}`);
        if (response.data.result.content) {
          this.stateOilGradeList = response.data.result.content;
        } else {
          this.stateOilGradeList = [];
        }
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error);
        sendErrorEvent('IRONS', error);
        console.log(error);
      }
    },
    async getCoolantList() {
      try {
        const response: AxiosResponse = await ApiService.get(SOS_COOLANT_API_URL);
        if (response.data.result.content) {
          this.stateCoolantList = response.data.result.content;
        } else {
          this.stateCoolantList = [];
        }
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error);
        sendErrorEvent('IRONS', error);
        console.log(error);
      }
    }
  }
})
