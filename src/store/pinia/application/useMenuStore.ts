import { GET_MENU, GET_MENU_DMA, GET_OUTSTANDING_MENU } from './newUrls'
import ApiService from '@/core/services/ApiService'
import { defineStore, setActivePinia } from 'pinia'
import { AxiosResponse } from 'axios'
import MenuClass from '@/core/classes/MenuClass'
import { Menu } from '@/core/types/misc/Menu'
import { Menu as MenuDMA } from '@/core/types/entities/dma/Menu'
import { ApiResponse } from '@/core/types/misc/ApiResponse'
import { db } from '@/database/schema/DexieSchema'
import { OutstandingBadge } from '@/core/types/intervention/OutstandingBadge'
import { aesEncode, aesDecode } from '@/core/helpers/encryption'
import { sendErrorEvent } from '@/core/helpers/analytics';


export const useMenuStore = defineStore({
  id: "menuStore",
  state: () => {
    return {
      stateMenu: {} as MenuClass,
      stateAvailableMenu: [] as Menu[],
      stateIsMenuSet: false,
      stateLoading: false,
      stateMenuDMA: [] as MenuDMA[],
      stateIsDMAMenuSet: false,
      stateDMALoading: false,
      stateOutstandingBadge: [] as OutstandingBadge[],
      stateIsDMAMenuOutstandingSet: false,
      stateActivePage: ''
    }
  },
  getters: {
    menu: (state) => {
      return state.stateMenu;
    },
    activePage: (state) => {
      return state.stateActivePage;
    },
    menuDMA: (state) => {
      return state.stateMenuDMA;
    },
    isMenuSet: (state) => {
      return state.stateIsMenuSet;
    },
    loading: (state) => {
      return state.stateLoading;
    },
    isMenuDMASet: (state) => {
      return state.stateIsDMAMenuSet;
    },
    loadingDMA: (state) => {
      return state.stateDMALoading;
    },
    outstandingBadge: (state) => {
      return state.stateOutstandingBadge
    },
    isMenuDMAOutstandingSet: (state) => {
      return state.stateIsDMAMenuOutstandingSet;
    },
    allMenu: (state) => {
      return state.stateAvailableMenu;
    }
  },
  actions: {
    setActivePage(page: string) {
      this.stateActivePage = page;
    },
    async getMenu(employeeid: string) {
      const params = { employeeid: employeeid, ver: 'v1' };
      const response: AxiosResponse<ApiResponse<Menu>> = await ApiService.get(GET_MENU, "", new URLSearchParams(params).toString());
      this.stateMenu = new MenuClass(response.data.result.content);
      this.stateAvailableMenu = response.data.result.content;
      const encodedMenu = aesEncode(JSON.stringify(response.data.result.content), `${import.meta.env.VITE_APP_ENC_SALT}`)
      localStorage.setItem('user-menu', encodedMenu)
      this.stateIsMenuSet = true;
      this.stateLoading = false;
    },
    async getMenuDMA(employeeid: string) {
      this.stateIsDMAMenuSet = false;
      const params = { employeeid: employeeid, ver: 'v1' };
      const response: AxiosResponse<ApiResponse<Menu>> = await ApiService.get(GET_MENU_DMA, "", new URLSearchParams(params).toString());
      const data = response.data.result.content.filter((f) => {
        return f.Section === "mobile"
      }).map((m) => {
        return {
          Path: m.MenuName,
          MenuName: m.PageName,
          Icon: m.Icon as string,
          Sequence: m.Sequence,
          MenuId: m.MenuId
        }
      });
      await db.menu.clear()
      await db.menu.bulkAdd(data)
      this.stateMenuDMA = data
      this.stateIsDMAMenuSet = true;
      this.stateDMALoading = false;
    },
    async setMenuDMAFromDump() {
      this.stateIsDMAMenuSet = false
      this.stateMenuDMA = await db.menu.orderBy('Sequence').toArray()
      this.stateIsDMAMenuSet = true
    },
    async setOutstandingBadgeFromDump() {
      this.stateOutstandingBadge = await db.outstandingBadge.toArray()
    },
    reset() {
      this.stateMenu = {} as MenuClass
      this.stateIsMenuSet = false
      this.stateLoading = false
      this.stateMenuDMA = [] as MenuDMA[]
      this.stateIsDMAMenuSet = false
      this.stateDMALoading = false
    },
    checkOutstandingData(outstandings) {
      const menuCount = {};
      const updatedArray = outstandings.map((item) => {
        if (!menuCount[item.menu]) {
          menuCount[item.menu] = 1;
        } else {
          menuCount[item.menu]++;
          item.menu = `${item.menu} ${menuCount[item.menu]}`;
        }
        return item;
      });
      return updatedArray
    },
    async getOutstandingMenuDMA(supervisor: string) {
      this.stateIsDMAMenuOutstandingSet = false
      const params = { ver: 'v1' };
      if (supervisor) {
        params["supervisor"] = supervisor
      }
      const response: AxiosResponse<ApiResponse<any>> = await ApiService.get(GET_OUTSTANDING_MENU, "", new URLSearchParams(params).toString());
      try {
        let outstanding
        if (response.data.statusCode == 400) {
          outstanding = []
        } else {
          outstanding = response.data.result.content
        }
        await db.outstandingBadge.clear()
        const outstandings = this.checkOutstandingData(outstanding)
        this.stateMenuDMA.forEach((val) => {
          outstandings.forEach(async (out) => {
            if (out.menuId == val.MenuId) {
              val.Outstanding = out.dataCount
            }
            try {
              await db.outstandingBadge.add({
                menuName: out.menu,
                menuId: out.menuId,
                outstanding: out.dataCount ?? 0
              })
            } catch {
              await db.outstandingBadge.put({
                menuName: out.menu,
                menuId: out.menuId,
                outstanding: out.dataCount ?? 0
              })
            }
          })
        })
        this.stateOutstandingBadge = await db.outstandingBadge.toArray()
        this.stateIsDMAMenuOutstandingSet = true
        this.stateDMALoading = false
      } catch (e) {
        sendErrorEvent('IRONS', e);
        console.log(e)
      }
    },
    authPage(menuName: string) :boolean {
      let authorized = false
      if (localStorage.getItem('user-menu')) {
        const availableMenu = JSON.parse(aesDecode(localStorage.getItem('user-menu') || '', `${import.meta.env.VITE_APP_ENC_SALT}`))
        const isAuth = availableMenu.filter((menu) => {
          return menu.MenuName.includes(menuName)
        })
        if (isAuth.length > 0) {
          authorized = true
        }
      }
      return authorized
    },
  }
});
