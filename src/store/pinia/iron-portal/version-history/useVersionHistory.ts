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
} from '@/core/types/entities/iron-portal/iron-portal-version-history/TreeData'
import { sendErrorEvent } from "@/core/helpers/analytics";

export const useVersionHistory = defineStore({
  id: "versionHistory",
  state: () => {
    return {
      stateTreeData: {
        menuName: "IronPortal Version History",
        icon: "",
        subMenu: [] as TreeItem[]
      } as TreeItem,
      stateListLoading: false,
      stateMenuVersionHistory: [] as any,
      stateSelectedMenu: {} as TreeItem,
      stateSearchString: "",
      stateDefaultTree: {
        menuName: "IronPortal Version History",
        icon: "fa fa-code-merge",
        subMenu: [] as TreeItem[]
      } as TreeItem,
      stateDefaultSelectedMenu: {} as TreeItem,
    }
  },
  getters: {
    selectedMenu: (state) => {
      return state.stateSelectedMenu
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
      menuData.forEach((menu, idx) => {
        if (idx == 0) {
          menu["collapsible"] = true;
        } else {
          menu["collapsible"] = false;
        }
        menu["icon"] = "far fa-dot-circle";
        if (menu.subMenu) {
          menu.subMenu.forEach((subMenu) => {
            subMenu["icon"] = "fa fa-circle";
          });
          menu.subMenu = menu.subMenu.sort((a, b) => {
            return a.sequence - b.sequence
          })
        }
        if (this.stateTreeData.subMenu) {
          this.stateTreeData.subMenu.push(menu);
        }
      });
    },
    setSelectedMenu(menu) {
      this.stateSelectedMenu = menu
    },
    async getMenuVersionHistory() {
      this.stateListLoading = true
      const params = {
        ver: 'v1',
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
        this.stateMenuVersionHistory = this.stateTreeData.subMenu
        this.setInit()
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error);
      } finally {
        this.stateListLoading = false
      }
    },
    setInit() {
      if (this.stateMenuVersionHistory[0]?.subMenu[0]) {
        this.setSelectedMenu(this.stateMenuVersionHistory[0].subMenu[0])
      }
    },
    setCollapse(menuName) {
      this.stateTreeData.subMenu?.forEach((menu) => {
        if (menu.menuName == menuName) {
          menu.collapsible = !menu.collapsible
        }
      })
    },
    setSearchMenu(string) {
      this.stateSearchString = string
      if (string == "") {
        this.stateTreeData.subMenu = this.stateMenuVersionHistory
      } else {
        this.stateTreeData.subMenu = cloneDeep(this.stateMenuVersionHistory).filter((menu) => {
          return menu.menuName.toLowerCase().includes(string.toLowerCase())
        })
      }
    },
    resetInstance() {
      this.stateTreeData = cloneDeep(this.stateDefaultTree)
      this.stateListLoading = false
      this.stateMenuVersionHistory = []
      this.stateSelectedMenu = this.stateDefaultSelectedMenu
      this.stateSearchString = ""
    }
  },
})

