import PaginationType from "@/core/types/misc/Pagination";
import ApiService from "@/core/services/ApiService";
import { CRUD_API_URL } from "./urls";
import { defineStore } from "pinia";
import { AxiosResponse } from "axios";
import {
  ApiResponseTotal,
} from "@/core/types/misc/ApiResponse";
import {
  ListItem,
} from "@/core/types/entities/iron-lake/media-library/ListItem";
import {
  reqBody
} from "@/core/types/entities/iron-lake/media-library/FilterData";
import { formatInternationalDate } from "@/core/helpers/date-format"
import { intersectionBy } from "lodash";
import { removeItemFromArray } from "./helper";

// sonarqube fixing
type ElInputType = null | number | string;

class InitialFilterForm {
  startDate: null | string;
  endDate: null | string;
  fileType: ElInputType;
  id: ElInputType;
  code: ElInputType;
  desc: ElInputType;
  order: string;
  page: number;
  pageSize: number;

  constructor() {
    this.id = null;
    this.startDate = null;
    this.endDate = null;
    this.code = "";
    this.desc = "";
    this.fileType = "";
    this.order = "";
    this.page = 1;
    this.pageSize = 20;
  }
}

type ContentList = {
  attachmentList: ListItem[],
  lastId: number
}

export const useMediaLibraryListStore = defineStore({
  id: "mediaLibraryList",
  state: () => {
    return {
      stateFilterForm: new InitialFilterForm() as reqBody,
      stateList: [] as ListItem[],
      statePageName: "mediaLibrary",
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      stateLastId: 0 as number,
      stateChecklistDownload: [] as ListItem[]
    };
  },
  getters: {
    pageName: (state) => {
      return state.statePageName;
    },
    pagination: (state) => {
      return state.statePagination;
    },
    list: (state) => {
      return state.stateList;
    },
    checklistDownload: (state) => {
      return state.stateChecklistDownload
    },
    loading: (state) => {
      return state.stateLoading;
    },
    paginationLoading: (state) => {
      return state.statePaginationLoading;
    },
    lastId: (state) => {
      return state.stateLastId
    },
    intersectionListItem: (state) => {
      return intersectionBy(state.stateList, state.stateChecklistDownload, 'AttachmentId')
    }
  },
  actions: {
    setTotalPage(totalPage: number) {
      this.pagination.totalPage = totalPage;
      this.pagination.getPaginationStartIndex();
      this.pagination.getPaginationLastIndex();
    },
    async getList() {
      this.stateLoading = true;
      const params = {
        Page: this.stateFilterForm.page ? this.stateFilterForm.page.toString() : "1",
        PageSize: this.stateFilterForm.pageSize.toString(),
        FileType: this.stateFilterForm.fileType ? String(this.stateFilterForm.fileType) : "",
        Id: this.stateFilterForm.id ? String(this.stateFilterForm.id) : "",
        Code: this.stateFilterForm.code ? String(this.stateFilterForm.code) : "",
        Description: this.stateFilterForm.desc ? String(this.stateFilterForm.desc) : "",
        StartDate: this.stateFilterForm.startDate ? formatInternationalDate(this.stateFilterForm.startDate) : "",
        EndDate: this.stateFilterForm.endDate ? formatInternationalDate(this.stateFilterForm.endDate) : "",
        Order: this.stateFilterForm.order,
        ver: "v1",
      };

      try {
        const response: AxiosResponse<ApiResponseTotal<ContentList>> = await ApiService.get(CRUD_API_URL, "", new URLSearchParams(params).toString());
        this.stateList = response.data.result.content.attachmentList;
        this.stateLastId = response.data.result.content.lastId;
        this.setTotalPage(response.data.result.total);
      } catch (error) {
        console.log(error);
      }
      this.stateLoading = false;
    },
    async setPage(newPage: number) {
      this.statePaginationLoading = true;
      this.statePagination.totalPageSize = this.stateFilterForm.pageSize;
      this.statePagination.handleCurrentPageChange(newPage);
      this.stateFilterForm.page = this.statePagination.currentPage;
      await this.getList();
      setTimeout(() => {
        this.statePaginationLoading = false;
      }, 200);
    },
    async setSort({ prop, order }) {
      if (!prop && !order) {
        this.stateFilterForm.order = "";
      } else {
        const formatedOrder = order == "ascending" ? "asc" : "desc";
        this.stateFilterForm.order = `${prop}_${formatedOrder}`;
      }
      await this.setPage(1);
    },
    async setAppliedFilter(filter: reqBody) {
      this.stateFilterForm = filter;
      await this.setPage(1);
    },
    setChecklistDownload(action: "remove" | "add", item: ListItem) {
      if (action == 'remove') {
        this.stateChecklistDownload = removeItemFromArray(this.stateChecklistDownload, (list) => {
          return list.AttachmentId === item.AttachmentId
        });
      } else if (action == 'add') {
        const exists = this.stateChecklistDownload.some((list) => {
          return list.AttachmentId === item.AttachmentId
        });
        if (!exists) {
          this.stateChecklistDownload.push(item);
        }
      }
    },
    setUnselectedAllChecklistDownload() {
      this.stateList.forEach((listPage) => {
        this.stateChecklistDownload = removeItemFromArray(this.stateChecklistDownload, (list) => {
          return list.AttachmentId === listPage.AttachmentId
        });
      })
    },
    setSelectedAllChecklistDownload() {
      this.stateList.forEach((listPage) => {
        const exists = this.stateChecklistDownload.some((listDownload) => {
          return listDownload.AttachmentId === listPage.AttachmentId
        });
        if (!exists) {
          this.stateChecklistDownload.push(listPage);
        }
      })
    },
    resetDownloadList() {
      this.stateChecklistDownload = []
    },
    resetFilter() {
      this.stateFilterForm = new InitialFilterForm() as reqBody;
    },
  },
});
