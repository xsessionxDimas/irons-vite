import { defineStore } from "pinia";
import { Option } from "@/core/types/misc/Option";
import { AxiosResponse, AxiosRequestConfig } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import ApiService from "@/core/services/ApiService";
import {
  COMPONENT_INTERVENTION_API_URL,
  INTERVENTION_DETAIL_API_URL,
  GET_PARAM_DATE_EST
} from "./urls";
import {
  ComponentIntervention
} from "@/core/types/entities/dma/component-intervention/ComponentIntervention";
import {
  ComponentInterventionListPayload
} from "@/core/types/entities/dma/component-intervention/ComponentInterventionListPayload";
import {
  updateLoggedInStatusFromAPIResponse
} from "@/core/helpers/authentication-handler";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  ComponentInterventionComplete
} from "@/core/types/entities/dma/component-intervention/ComponentInterventionComplete";
import {
  useGeneralComponentInterventionFormStore
} from "./useGeneralComponentInterventionFormStore";
import {
  addDateByDynamicParamHelper,
  getUTCOffsetDate
} from "@/core/helpers/date-format";
import { sendErrorEvent } from "@/core/helpers/analytics";

export const useComponentInterventionStore = defineStore({
  id: "ComponentIntervention",
  state: () => {
    return {
      stateComponentInterventions: [] as ComponentIntervention[],
      stateComponentInterventionOptions: [] as Option[],
      stateComponentInterventionOptionsLocal: [] as Option[],
      stateSelectedComponentIntervention: {} as ComponentIntervention,
      stateInterventionForm: {} as ComponentInterventionComplete,
      stateDaysBeforeEst: 0 as number
    }
  },
  getters: {
    ComponentInterventions: (state) => {
      return state.stateComponentInterventions;
    },
    ComponentInterventionOptions: (state) => {
      return state.stateComponentInterventionOptions;
    },
    ComponentInterventionOptionsLocal: (state) => {
      return state.stateComponentInterventionOptionsLocal;
    },
    SelectedComponentIntervention: (state) => {
      return state.stateSelectedComponentIntervention;
    },
    CutOffEstimate: (state) => {
      const generalStore = useGeneralComponentInterventionFormStore()
      const date = getUTCOffsetDate(generalStore.stateTimeZone)
      return addDateByDynamicParamHelper(date, "DD/MM/YYYY HH:mm:ss", state.stateDaysBeforeEst, 'days')
    },
  },
  actions: {
    async getComponentInterventions(site) {
      const params = {
        ver: "v1",
        siteId: site
      }
      try {
        const response: AxiosResponse<ApiResponse<ComponentInterventionListPayload>> = await ApiService.get(COMPONENT_INTERVENTION_API_URL, "", new URLSearchParams(params).toString());
        this.stateComponentInterventions = []
        if (!response.data.result.isError) return
        response.data.result.content.forEach((val) => {
          this.stateComponentInterventions.push({
            id: val.keyPbi,
            equipment: val.equipment,
            equipmentDesc: val.equipmentDesc,
            sampleStatus: val.sampleStatus,
            componentDescription: val.componentDescription,
            sapWorkOrder: val.sapWorkOrder,
            estimationCompletionDate: val.estimationCompletionDate,
          })
        })
        this.stateComponentInterventionOptions = this.formatComponentInterventionOptions(this.stateComponentInterventions);
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error);
      }
    },
    async getInterventionForm(id: string) {
      const params = {
        id: id,
        ver: 'v1'
      }
      try {
        const response: AxiosResponse<SingleApiResponse<ComponentInterventionComplete>> = await ApiService.get(`${INTERVENTION_DETAIL_API_URL}?${new URLSearchParams(params).toString()}`)
        return response.data.result.content
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
    },
    formatComponentInterventionOptions(data: ComponentIntervention[]) {
      return data.map((e) => {
        return {
          label: `${e.equipment} - ${e.equipmentDesc} - <span class="${e.sampleStatus?.toLowerCase() == 'caution' ? 'yellow' : e.sampleStatus?.toLowerCase() == 'normal' ? 'green' : 'red'}">${e.sampleStatus} Intervention</span> - ${e.componentDescription} - ${e.sapWorkOrder}`,
          value: e.id
        }
      })
    },
    setSelectedComponentIntervention(id: string) {
      const ComponentIntervention = this.ComponentInterventions.find((d) => {
        return d.id === id;
      });
      if (ComponentIntervention) {
        this.stateSelectedComponentIntervention = ComponentIntervention;
      }
    },
    setSelectedComponentInterventionItem(item: ComponentIntervention) {
      this.stateSelectedComponentIntervention = item;
    },
    async getParamDaysBeforeEst() {
      const body = {
        key: "InterventionMaxEstDate"
      }
      try {
        const response: AxiosResponse<any> = await ApiService.post(GET_PARAM_DATE_EST, body as AxiosRequestConfig);
        this.stateDaysBeforeEst = Number(response.data.result.content.value)
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error);
      }
    },
  }
});
