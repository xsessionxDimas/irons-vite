import {
  GET_GROUP_MENU_API_URL,
  INSERT_API_URL,
  UPDATE_API_URL,
  GET_ALL_MENU_API_URL,
} from "./urls";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  UpsertItem
} from "@/core/types/entities/administration/user-management/user-group-menu/UpsertItem";
import {
  ListItem
} from "@/core/types/entities/administration/user-management/user-group-menu/ListItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import MenuClass from "@/core/classes/MenuClass";
import { ElTreeMenu, Menu } from "@/core/types/misc/Menu";

const initialForm = {
  userGroupMenuId: 0,
  userGroupName: "",
  userGroupDescription: "",
  menu: [] as any[],
};

export const useUserGroupMenuFormStore = defineStore({
  id: "userGroupMenuForm",
  state: () => {
    return {
      stateFormData: {
        ...initialForm
      } as UpsertItem,
      stateInitialMenuTree: [] as any[], // All menu in form of Tree with isCheck = false
      stateCheckedMenuIdArray: [] as number[], // Array of menu IDs with isCheck = true (data from BE)
      allMenuRaw: [] as any[],
      stateIsError: false,
      stateError: "",
      stateErrors: [] as string[],
      stateLoading: false,
      allLeafMenu: [] as number[],
    }
  },
  getters: {
    formData: (state) => {
      return state.stateFormData;
    },
    checkedMenuIdArray: (state) => {
      return state.stateCheckedMenuIdArray;
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
    }
  },
  actions: {
    async getCheckedMenuByGroup(groupId) {
      const params = {
        userGroupId: groupId,
        ver: "v1",
      };
      try {
        const response: AxiosResponse<ApiResponse<any>> = await ApiService.get(GET_GROUP_MENU_API_URL, "", new URLSearchParams(params).toString());
        return response.data.result.content[0];
      } catch (error) {
        console.log(error);
      }
    },
    buildUserGroupMenuTree(menuItems) {
      // This loop is to build menu tree
      const menuMap = new Map();
      const menuTree: ElTreeMenu[] = [];

      menuItems.forEach((item) => {
        const menuItem = {
          menuId: item.MenuId,
          menuName: item.PageName,
          isCheck: false,
          level: item.Level,
          subMenu: [] as ElTreeMenu[]
        };

        menuMap.set(item.MenuId, menuItem);

        if (item.Level === 0) {
          menuTree.push(menuItem);
        } else {
          const parent = menuMap.get(item.ParentId);
          if (parent) {
            parent.subMenu.push(menuItem);
          }
        }
      });

      // This loop is to store menu leaf array
      const menuLeafArray: number[] = [];

      menuItems.forEach((item) => {
        const menuItemForLeaf = menuMap.get(item.MenuId)
        if (menuItemForLeaf.subMenu.length === 0 && item.Level > 0) {
          menuLeafArray.push(item.MenuId);
        }
      });
      this.allLeafMenu = menuLeafArray;

      return menuTree;
    },
    async getMenu() {
      const params = { ver: 'v1' };
      const response: AxiosResponse<ApiResponse<Menu>> = await ApiService.get(GET_ALL_MENU_API_URL, "", new URLSearchParams(params).toString());
      this.allMenuRaw = response.data.result.content; // store the raw menu so it can be used later on edit
      const rawMenu = new MenuClass(response.data.result.content);
      this.stateInitialMenuTree = this.buildUserGroupMenuTree(rawMenu.getAllMenu());
      this.stateFormData.menu = [
        ...this.stateInitialMenuTree
      ]
    },
    async insertData(createBy: string) {
      try {
        this.stateLoading = true;
        const params = {
          userAccount: createBy,
          ver: "v1"
        };
        const response: AxiosResponse<SingleApiResponse<undefined>> = await ApiService.post(`${INSERT_API_URL}?${new URLSearchParams(params).toString()}`, this.stateFormData as AxiosRequestConfig)
        if (response.data.title === "Error") {
          this.stateErrors.push(response.data.result.message);
          this.stateIsError = true;
        } else {
          this.stateError = "";
          this.stateIsError = false;
        }
      } catch (error) {
        this.stateError = error as string;
        this.stateIsError = true;
      }
      this.stateLoading = false;
    },
    setErrors(errors: string[]) {
      this.stateErrors = errors;
      this.stateIsError = this.stateErrors.length > 0;
    },
    async setFormData(data: ListItem) {
      this.stateLoading = true;
      const tempForm = await this.getCheckedMenuByGroup(data.UserGroupId);
      this.stateFormData.userGroupMenuId = tempForm.userGroupId || "";
      this.stateFormData.userGroupName = tempForm.userGroupName || "";
      this.stateFormData.userGroupDescription = tempForm.userGroupDescription || "";
      // Extract menu Id of checked menu
      const trueOnly = tempForm.menu.filter((menu) => {
        if (menu.isCheck) {
          // If isCheck true, return data that is a menu.
          // So the tree displayed will only check the leaf node
          // const isMenu = this.allMenuRaw.find((rawMenu) => {
          //   return rawMenu.IsMenu && rawMenu.MenuId == menu.menuId
          // });
          const leafIndex = this.allLeafMenu.findIndex((leaf) => {
            return leaf == menu.menuId
          })
          if (leafIndex >= 0) {
            return menu
          }
        }
      });
      this.stateCheckedMenuIdArray = this.extractMenuId(trueOnly)
      this.stateLoading = false;
    },
    extractMenuId(array) {
      return array.map((menu) => {
        return menu.menuId
      });
    },
    resetState() {
      this.stateFormData = {
        ...initialForm
      } as UpsertItem;
      this.stateFormData.menu = [
        ...this.stateInitialMenuTree
      ];
      this.stateCheckedMenuIdArray = [] as number[];
      this.stateIsError = false;
      this.stateError = "";
      this.stateErrors = [] as string[];
      this.stateLoading = false;
    },
    seperate(arrayA, arrayB) {
      // To seperate element or array that is not exist on another array
      return arrayA.filter((x) => {
        const isFound = arrayB.find((y) => {
          return y == x
        })
        if (!isFound) return x
      });
    },
    getNewIsCheck(menuId, falseToTrueArray, trueToFalseArray, allCheckedArray) {
      const isStillTrue = allCheckedArray.find((id) => {
        return id == menuId;
      });
      if (isStillTrue) return true

      const isFoundTrue = falseToTrueArray.find((id) => {
        return id == menuId;
      });
      if (isFoundTrue) return true

      const isFoundFalse = trueToFalseArray.find((id) => {
        return id == menuId;
      });
      if (isFoundFalse) return false

      return false
    },
    buildCheckedPayload(menus, toTrueMenuId, toFalseMenuId, checkMenuIdArray) {
      const result = [] as ElTreeMenu[]
      menus.forEach((menu) => {
        const isCheckedMenu = this.getNewIsCheck(menu.menuId, toTrueMenuId, toFalseMenuId, checkMenuIdArray)
        if (menu.subMenu.length > 0) {
          this.buildCheckedPayload(menu.subMenu, toTrueMenuId, toFalseMenuId, checkMenuIdArray)
        }
        result.push({
          menuId: menu.menuId,
          menuName: menu.menuName,
          isCheck: isCheckedMenu === true ? true : menu.isCheck,
          subMenu: menu.subMenu.length > 0 ? this.buildCheckedPayload(menu.subMenu, toTrueMenuId, toFalseMenuId, checkMenuIdArray) : []
        })
      });

      return result
    },
    async updateData(updateBy: string, newCheckedArray) {
      const newCheckMenuIdArray = this.extractMenuId(newCheckedArray)
      const falseToTrueMenuId = this.seperate(newCheckMenuIdArray, this.stateCheckedMenuIdArray)
      const trueToFalseMenuId = this.seperate(this.stateCheckedMenuIdArray, newCheckMenuIdArray)

      try {
        this.stateLoading = true;
        const params = {
          userAccount: updateBy,
          ver: "v1"
        };
        this.stateFormData.menu = this.buildCheckedPayload(this.stateFormData.menu, falseToTrueMenuId, trueToFalseMenuId, newCheckMenuIdArray)
        const response: AxiosResponse<SingleApiResponse<undefined>> = await ApiService.post(`${UPDATE_API_URL}?${new URLSearchParams(params).toString()}`, this.stateFormData as AxiosRequestConfig)
        if (response.data.title === "Error") {
          this.stateErrors.push(response.data.result.message);
          this.stateIsError = true;
        } else {
          this.stateError = "";
          this.stateIsError = false;
        }
      } catch (error: any) {
        this.stateErrors.push(error.response.data.result.message);
        this.stateIsError = true;
      }
      this.stateLoading = false;
    },
  }
});
