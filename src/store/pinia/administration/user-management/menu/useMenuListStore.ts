import PaginationType from "@/core/types/misc/Pagination";
import { Option } from "@/core/types/misc/Option";
import ApiService from "@/core/services/ApiService";
import {
  LOOKUP_API_URL,
  EXPORT_API_URL,
  GET_API_URL,
  LOOKUP_MENU_API_URL
} from "./urls";
import { defineStore } from "pinia";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  ListItem
} from "@/core/types/entities/administration/user-management/menu/ListItem";
import {
  FilterData
} from "@/core/types/entities/administration/user-management/menu/FilterData";
import {
  LookupItem,
  LookupMenuItem
} from "@/core/types/entities/administration/user-management/menu/LookupItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import { mapOption, mapOptionFromLookupApi } from "@/core/helpers/mapOption";

export const useMenuListStore = defineStore({
  id: "menuList",
  state: () => {
    return {
      stateFilterData: {
        MenuName: "",
        PageName: "",
        Icon: "",
        MenuType: "",
        Level: "",
        Sequence: "",
        IsChild: null,
        ParentId: "",
        IsMenu: null,
        Section: "",
        MenuNameTo: "",
        PageNameTo: "",
        IconTo: "",
        MenuTypeTo: "",
        LevelTo: "",
        SequenceTo: "",
        ParentIdTo: "",
        SectionTo: "",
        Page: 1,
        PageSize: 10,
        Order: "",
        ver: "v1",
      } as FilterData,
      stateLastUsedFilterData: {
        MenuName: "",
        PageName: "",
        Icon: "",
        MenuType: "",
        Level: "",
        Sequence: "",
        IsChild: null,
        ParentId: "",
        IsMenu: null,
        Section: "",
        MenuNameTo: "",
        PageNameTo: "",
        IconTo: "",
        MenuTypeTo: "",
        LevelTo: "",
        SequenceTo: "",
        ParentIdTo: "",
        SectionTo: "",
        Page: 1,
        PageSize: 10,
        Order: "",
        ver: "v1",
      } as FilterData,
      statePageName: "menu",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      stateMenuNameOption: [] as Option[],
      statePageNameOption: [] as Option[],
      stateIconOption: [] as Option[],
      stateMenuTypeOption: [] as Option[],
      stateLevelOption: [] as Option[],
      stateSequenceOption: [] as Option[],
      stateIsChildOption: [] as Option[],
      stateParentIdOption: [] as Option[],
      stateIsMenuOption: [] as Option[],
      stateSectionOption: [] as Option[],
    };
  },
  getters: {
    pageName: (state) => {
      return state.statePageName;
    },
    pagination: (state) => {
      return state.statePagination;
    },
    displayData: (state) => {
      return state.stateDisplayData;
    },
    filterData: (state) => {
      return state.stateFilterData;
    },
    lastUsedFilterData: (state) => {
      return state.stateLastUsedFilterData;
    },
    loading: (state) => {
      return state.stateLoading;
    },
    paginationLoading: (state) => {
      return state.statePaginationLoading;
    },
    MenuNameOption: (state) => {
      return state.stateMenuNameOption;
    },
    pageNameOption: (state) => {
      return state.statePageNameOption;
    },
    iconOption: (state) => {
      return state.stateIconOption;
    },
    menuTypeOption: (state) => {
      return state.stateMenuTypeOption;
    },
    levelOption: (state) => {
      return state.stateLevelOption;
    },
    sequenceOption: (state) => {
      return state.stateSequenceOption;
    },
    isChildOption: (state) => {
      return state.stateIsChildOption;
    },
    parentIdOption: (state) => {
      return state.stateParentIdOption;
    },
    isMenuOption: (state) => {
      return state.stateIsMenuOption;
    },
    sectionOption: (state) => {
      return state.stateSectionOption;
    },
  },
  actions: {
    async getData(isPageRefresh = true) {
      const params = {
        MenuName: this.stateFilterData.MenuName,
        PageName: this.stateFilterData.PageName,
        Icon: this.stateFilterData.Icon,
        MenuType: this.stateFilterData.MenuType,
        Level: this.stateFilterData.Level,
        Sequence: this.stateFilterData.Sequence,
        IsChild: this.stateFilterData.IsChild && this.stateFilterData.IsChild.toString() || "",
        ParentId: this.stateFilterData.ParentId,
        IsMenu: this.stateFilterData.IsMenu && this.stateFilterData.IsMenu.toString() || "",
        Section: this.stateFilterData.Section,
        MenuNameTo: this.stateFilterData.MenuNameTo,
        PageNameTo: this.stateFilterData.PageNameTo,
        IconTo: this.stateFilterData.IconTo,
        MenuTypeTo: this.stateFilterData.MenuTypeTo,
        LevelTo: this.stateFilterData.LevelTo,
        SequenceTo: this.stateFilterData.SequenceTo,
        ParentIdTo: this.stateFilterData.ParentIdTo,
        SectionTo: this.stateFilterData.SectionTo,
        Page: this.stateFilterData.Page.toString(),
        PageSize: this.stateFilterData.PageSize.toString(),
        Order: this.stateFilterData.Order,
        ver: this.stateFilterData.ver,
      };
      try {
        if (isPageRefresh) this.stateLoading = true;
        if (!isPageRefresh) this.stateDisplayData = [...[]];
        const response: AxiosResponse<ApiResponse<ListItem>> =
          await ApiService.get(
            GET_API_URL,
            "",
            new URLSearchParams(params).toString(),
          );
        this.stateDisplayData = response.data.result.content;
        this.setTotalPage(response.data.result.total);
        this.stateLastUsedFilterData = {
          ...this.stateFilterData,
        } as FilterData;
      } catch (error) {
        console.log(error);
      }
      this.stateLoading = false;
    },
    async getLookup() {
      const params = {
        ver: this.stateFilterData.ver,
      };
      try {
        const response: AxiosResponse<SingleApiResponse<LookupItem>> =
          await ApiService.get(
            LOOKUP_API_URL,
            "",
            new URLSearchParams(params).toString(),
          );
        const responseLookupMenu: AxiosResponse<SingleApiResponse<LookupMenuItem[]>> =
          await ApiService.get(
            LOOKUP_MENU_API_URL,
            "",
            new URLSearchParams(params).toString()
          )
        this.stateMenuNameOption = mapOption(response.data.result.content.menuName)
        this.statePageNameOption = mapOption(response.data.result.content.pageName)
        this.stateIconOption = mapOption(response.data.result.content.icon)
        this.stateMenuTypeOption = mapOption(response.data.result.content.menuType)
        this.stateLevelOption = mapOption(response.data.result.content.level)
        this.stateSequenceOption = mapOption(response.data.result.content.sequence)
        this.stateIsChildOption = mapOption(response.data.result.content.isChild)
        this.stateParentIdOption = responseLookupMenu.data.result.content.map((item) => {
          return {
            label: `${item.MdMenuId} | ${item.PageName}`,
            value: `${item.MdMenuId}`
          }
        })
        this.stateIsMenuOption = mapOption(response.data.result.content.isMenu)
        this.stateSectionOption = mapOption(response.data.result.content.section)
      } catch (error) {
        console.log(error);
      }
    },
    async export() {
      const params = {
        MenuName: this.stateFilterData.MenuName,
        PageName: this.stateFilterData.PageName,
        Icon: this.stateFilterData.Icon,
        MenuType: this.stateFilterData.MenuType,
        Level: this.stateFilterData.Level,
        Sequence: this.stateFilterData.Sequence,
        IsChild: this.stateFilterData.IsChild && this.stateFilterData.IsChild.toString() || "",
        ParentId: this.stateFilterData.ParentId,
        IsMenu: this.stateFilterData.IsMenu && this.stateFilterData.IsMenu.toString() || "",
        Section: this.stateFilterData.Section,
        MenuNameTo: this.stateFilterData.MenuNameTo,
        PageNameTo: this.stateFilterData.PageNameTo,
        IconTo: this.stateFilterData.IconTo,
        MenuTypeTo: this.stateFilterData.MenuTypeTo,
        LevelTo: this.stateFilterData.LevelTo,
        SequenceTo: this.stateFilterData.SequenceTo,
        ParentIdTo: this.stateFilterData.ParentIdTo,
        SectionTo: this.stateFilterData.SectionTo,
        ver: this.stateFilterData.ver,
        Gmt: new Date().toTimeString().slice(12, 17),
      };
      try {
        const response: AxiosResponse<Blob> = await ApiService.getBlob(
          EXPORT_API_URL,
          "",
          new URLSearchParams(params).toString(),
        );
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
    setTotalPage(totalPage: number) {
      this.pagination.totalPage = totalPage;
      this.pagination.getPaginationStartIndex();
      this.pagination.getPaginationLastIndex();
    },
    async setPage(newPage: number) {
      this.statePaginationLoading = true;
      this.statePagination.handleCurrentPageChange(newPage);
      this.stateFilterData.Page = this.statePagination.currentPage;
      await this.getData(false);
      setTimeout(() => {
        this.statePaginationLoading = false;
      }, 200);
    },
    async setSort({ prop, order }) {
      if (!prop && !order) {
        this.stateFilterData.Order = "";
      } else {
        const formatedOrder = order == "ascending" ? "asc" : "desc";
        this.stateFilterData.Order = `${prop}_${formatedOrder}`;
      }
      this.statePagination.handleCurrentPageChange(1);
      this.stateFilterData.Page = this.statePagination.currentPage;
      await this.getData(false);
    },
    setMenuName(value: string) {
      this.stateFilterData.MenuName = value;
    },
    setPageName(value: string) {
      this.stateFilterData.PageName = value;
    },
    setIcon(value: string) {
      this.stateFilterData.Icon = value;
    },
    setMenuType(value: string) {
      this.stateFilterData.MenuType = value;
    },
    setLevel(value: string) {
      this.stateFilterData.Level = value;
    },
    setSequence(value: string) {
      this.stateFilterData.Sequence = value;
    },
    setIsChild(value: boolean) {
      this.stateFilterData.IsChild = value;
    },
    setParentId(value: string) {
      this.stateFilterData.ParentId = value;
    },
    setIsMenu(value: boolean) {
      this.stateFilterData.IsMenu = value;
    },
    setSection(value: string) {
      this.stateFilterData.Section = value;
    },
    setMenuNameTo(value: string) {
      this.stateFilterData.MenuNameTo = value;
    },
    setPageNameTo(value: string) {
      this.stateFilterData.PageNameTo = value;
    },
    setIconTo(value: string) {
      this.stateFilterData.IconTo = value;
    },
    setMenuTypeTo(value: string) {
      this.stateFilterData.MenuTypeTo = value;
    },
    setLevelTo(value: string) {
      this.stateFilterData.LevelTo = value;
    },
    setSequenceTo(value: string) {
      this.stateFilterData.SequenceTo = value;
    },
    setParentIdTo(value: string) {
      this.stateFilterData.ParentIdTo = value;
    },
    setSectionTo(value: string) {
      this.stateFilterData.SectionTo = value;
    },
    async resetFilter() {
      this.stateFilterData.MenuName = "";
      this.stateFilterData.PageName = "";
      this.stateFilterData.Icon = "";
      this.stateFilterData.MenuType = "";
      this.stateFilterData.Level = "";
      this.stateFilterData.Sequence = "";
      this.stateFilterData.IsChild = null;
      this.stateFilterData.ParentId = "";
      this.stateFilterData.IsMenu = null;
      this.stateFilterData.Section = "";
      this.stateFilterData.MenuNameTo = "";
      this.stateFilterData.PageNameTo = "";
      this.stateFilterData.IconTo = "";
      this.stateFilterData.MenuTypeTo = "";
      this.stateFilterData.LevelTo = "";
      this.stateFilterData.SequenceTo = "";
      this.stateFilterData.ParentIdTo = "";
      this.stateFilterData.SectionTo = "";
      const checkMenuName = this.stateLastUsedFilterData.MenuName !== "";
      const checkPageName = this.stateLastUsedFilterData.PageName !== "";
      const checkIcon = this.stateLastUsedFilterData.Icon !== "";
      const checkMenuType = this.stateLastUsedFilterData.MenuType !== "";
      const checkLevel = this.stateLastUsedFilterData.Level !== "";
      const checkSequence = this.stateLastUsedFilterData.Sequence !== "";
      const checkIsChild = this.stateLastUsedFilterData.IsChild !== null;
      const checkParentId = this.stateLastUsedFilterData.ParentId !== "";
      const checkIsMenu = this.stateLastUsedFilterData.IsMenu !== null;
      const checkSection = this.stateLastUsedFilterData.Section !== "";
      const checkMenuNameTo = this.stateLastUsedFilterData.MenuNameTo !== "";
      const checkPageNameTo = this.stateLastUsedFilterData.PageNameTo !== "";
      const checkIconTo = this.stateLastUsedFilterData.IconTo !== "";
      const checkMenuTypeTo = this.stateLastUsedFilterData.MenuTypeTo !== "";
      const checkLevelTo = this.stateLastUsedFilterData.LevelTo !== "";
      const checkSequenceTo = this.stateLastUsedFilterData.SequenceTo !== "";
      const checkParentIdTo = this.stateLastUsedFilterData.ParentIdTo !== "";
      const checkSectionTo = this.stateLastUsedFilterData.SectionTo !== "";
      if (
        checkMenuName || checkPageName || checkIcon || checkMenuType || checkLevel || checkSequence || checkIsChild || checkParentId || checkIsMenu || checkSection || checkMenuNameTo || checkPageNameTo || checkIconTo || checkMenuTypeTo || checkLevelTo || checkSequenceTo || checkParentIdTo || checkSectionTo
      ) {
        await this.getData();
      }
    },
    resetState() {
      this.stateFilterData = {
        MenuName: "",
        PageName: "",
        Icon: "",
        MenuType: "",
        Level: "",
        Sequence: "",
        IsChild: null,
        ParentId: "",
        IsMenu: null,
        Section: "",
        MenuNameTo: "",
        PageNameTo: "",
        IconTo: "",
        MenuTypeTo: "",
        LevelTo: "",
        SequenceTo: "",
        ParentIdTo: "",
        SectionTo: "",
        Page: 1,
        PageSize: 10,
        Order: "",
        ver: "v1",
      } as FilterData;
      this.stateDisplayData = [] as ListItem[];
      this.statePagination = new PaginationType();
      this.stateLoading = false;
      this.statePaginationLoading = false;
    },
  },
});
