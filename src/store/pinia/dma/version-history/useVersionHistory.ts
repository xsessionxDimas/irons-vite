import {
  updateLoggedInStatusFromAPIResponse
} from "@/core/helpers/authentication-handler";
import ApiService from "@/core/services/ApiService";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import { AxiosResponse } from "axios";
import { cloneDeep } from "lodash";
import { defineStore } from "pinia";
import { getMenuVersionHistory } from "./urls";
import {
  TreeItem
} from '@/core/types/misc/TreeNode'
import { sendErrorEvent } from "@/core/helpers/analytics";

export const useVersionHistory = defineStore({
  id: "versionHistory",
  state: () => {
    return {
      stateTreeData: {
        label: "Service Sheet Version History",
        icon: "",
        children: []
      } as TreeItem,
      stateListLoading: false,
      stateMenuVersionHistory: [] as any,
      stateSelectedEquipment: {
        equipmentModel: "",
        psType: ""
      },
      stateSearchString: "",
      stateDefaultTree: {
        label: "Service Sheet Version History",
        icon: "fa fa-code-merge",
        children: []
      } as TreeItem,
      stateDefaultSelectedEquipment: {
        equipmentModel: "",
        psType: ""
      },
    }
  },
  getters: {
    selectedEquipment: (state) => {
      return state.stateSelectedEquipment
    },
    searchString: (state) => {
      return state.stateSearchString
    },
    loading: (state) => {
      return state.stateListLoading
    }
  },
  actions: {
    async convertResponseToTreeData(menuData) {
      this.stateTreeData = cloneDeep(this.stateDefaultTree)
      menuData.forEach((model, idx) => {
        if (idx == 0) {
          model["collapsible"] = true;
        } else {
          model["collapsible"] = false;
        }
        model["icon"] = "far fa-dot-circle";
        model.psType.forEach((psType) => {
          psType["icon"] = "fa fa-circle";
          psType["model"] = model.equipmentModelId ? model.equipmentModelId.replaceAll("/", "--") : 'General';
          psType["label"] = model.equipmentModelId ? `${psType.psType} Hr Service` : psType.psType;
        });
        delete Object.assign(model, {
          ["children"]: model["psType"]
        })["psType"];
        delete Object.assign(model, {
          ["label"]: model["menuName"]
        })["menuName"];
        delete Object.assign(model, {
          ["model"]: model["equipmentModelId"]
        })["equipmentModelId"];
        delete model["equipmentModelId"]
        if (this.stateTreeData.children) {
          this.stateTreeData.children.push(model);
        }
      });
    },
    setSelectedEquipment(equipment, psType) {
      this.stateSelectedEquipment = {
        equipmentModel: equipment,
        psType: psType
      }
    },
    async getMenuVersionHistory(site: string) {
      this.stateListLoading = true
      const params = {
        ver: 'v1',
        siteId: site
      }
      try {
        const response: AxiosResponse<ApiResponse<{
        equipmentModelId: string,
        menuName:string,
          psType: {
            psType: string,
            fileUrl: string
          }[]
        }>> = await ApiService.get(getMenuVersionHistory, "", new URLSearchParams(params).toString())
        await this.convertResponseToTreeData(response.data.result.content)
        this.stateMenuVersionHistory = this.stateTreeData.children
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        throw error
      } finally {
        this.stateListLoading = false
      }
    },
    setInit() {
      if (this.stateMenuVersionHistory[0] && this.stateMenuVersionHistory[0].children && this.stateMenuVersionHistory[0].children[0]) {
        this.setSelectedEquipment(this.stateMenuVersionHistory[0].children[0].model, this.stateMenuVersionHistory[0].children[0].psType)
      }
    },
    setCollapse(equipment) {
      this.stateTreeData.children?.forEach((model) => {
        if (model.model == equipment) {
          model.collapsible = !model.collapsible
        }
      })
      if (this.stateTreeData.children && this.stateTreeData.children[0].children) {
        this.setSelectedEquipment(this.stateTreeData.children[0].model, this.stateTreeData.children[0].children[0].psType)
      }
    },
    setSearchMenu(string) {
      this.stateSearchString = string
      if (string == "") {
        this.stateTreeData.children = this.stateMenuVersionHistory
      } else {
        this.stateTreeData.children = cloneDeep(this.stateMenuVersionHistory).filter((menu) => {
          return menu.label.toLowerCase().includes(string.toLowerCase())
        })
      }
    },
    resetInstance() {
      this.stateTreeData = cloneDeep(this.stateDefaultTree)
      this.stateListLoading = false
      this.stateMenuVersionHistory = []
      this.stateSelectedEquipment = this.stateDefaultSelectedEquipment
      this.stateSearchString = ""
    }
  },
})

