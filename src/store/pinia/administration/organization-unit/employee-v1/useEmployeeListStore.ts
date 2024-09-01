import PaginationType from "@/core/types/misc/Pagination";
import { Option } from "@/core/types/misc/Option";
import ApiService from "@/core/services/ApiService";
import {
  CRUD_API_URL,
  LOOKUP_API_URL,
  EXPORT_API_URL,
  LOOKUP_GENDER
} from "./urls";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  ListItem
} from "@/core/types/entities/administration/organization-unit/employee-v1/ListItem";
import {
  FilterData
} from "@/core/types/entities/administration/organization-unit/employee-v1/FilterData";
import {
  LookupItem
} from "@/core/types/entities/administration/organization-unit/employee-v1/LookupItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  LOOKUP_API_URL as LOOKUP_COMPANY,
} from "@/store/pinia/iron-lake/business-partner/company/urls";
import {
  LOOKUP_API_URL as LOOKUP_LOCATION,
} from "@/store/pinia/iron-lake/business-partner/site-v1/urls";
import {
  LOOKUP_API_URL as LOOKUP_POSITION,
} from "@/store/pinia/administration/organization-unit/position/urls";
import { mapOption, mapOptionFromLookupApi } from "@/core/helpers/mapOption";
import { formatDateForPostData } from "@/core/helpers/date-format";

export const useEmployeeListStore = defineStore({
  id: "employeeListV1",
  state: () => {
    return {
      stateFilterData: {
        EmployeeCode: "", // change later
        Company: "",
        Name: "",
        AdAccount: "",
        Email: "",
        Phone: "",
        Gender: "",
        Position: "",
        Location: "",
        StartDate: "",
        EndDate: "",
        ver: "v1",
        Page: 1,
        PageSize: 10,
        Order: ""
      } as FilterData,
      stateLastUsedFilterData: {
        EmployeeCode: "", // change later
        Company: "",
        Name: "",
        AdAccount: "",
        Email: "",
        Phone: "",
        Gender: "",
        Position: "",
        Location: "",
        StartDate: "",
        EndDate: "",
        ver: "v1",
        Page: 1,
        PageSize: 10,
        Order: ""
      } as FilterData,
      statePageName: "employee",
      stateDisplayData: [] as ListItem[],
      statePagination: new PaginationType(),
      stateLoading: false as boolean,
      statePaginationLoading: false as boolean,
      stateCompanyOption: [] as Option[],
      stateNameOption: [] as Option[],
      stateAdAccountOption: [] as Option[],
      stateEmailOption: [] as Option[],
      statePhoneOption: [] as Option[],
      stateGenderOption: [] as Option[],
      statePositionOption: [] as Option[],
      stateEmployeeCodeOption: [] as Option[],
      stateLocationOption: [] as Option[],
    }
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
      return state.stateLastUsedFilterData
    },
    loading: (state) => {
      return state.stateLoading;
    },
    paginationLoading: (state) => {
      return state.statePaginationLoading;
    },
    employeeCodeOption: (state) => {
      return state.stateEmployeeCodeOption;
    },
    companyOption: (state) => {
      return state.stateCompanyOption;
    },
    nameOption: (state) => {
      return state.stateNameOption;
    },
    adAccountOption: (state) => {
      return state.stateAdAccountOption;
    },
    emailOption: (state) => {
      return state.stateEmailOption;
    },
    phoneOption: (state) => {
      return state.statePhoneOption;
    },
    genderOption: (state) => {
      return state.stateGenderOption;
    },
    positionOption: (state) => {
      return state.statePositionOption;
    },
    locationOption: (state) => {
      return state.stateLocationOption;
    },
  },
  actions: {
    async getData(isPageRefresh = true) {
      const params = {
        EmployeeId: this.stateFilterData.EmployeeCode, // change later
        Company: this.stateFilterData.Company,
        Name: this.stateFilterData.Name,
        AdAccount: this.stateFilterData.AdAccount,
        Email: this.stateFilterData.Email,
        Phone: this.stateFilterData.Phone,
        Gender: this.stateFilterData.Gender,
        Position: this.stateFilterData.Position,
        Location: this.stateFilterData.Location,
        StartDate: this.stateFilterData.StartDate ? formatDateForPostData(this.stateFilterData.StartDate.toLocaleString()) : "",
        EndDate: this.stateFilterData.EndDate ? formatDateForPostData(this.stateFilterData.EndDate.toLocaleString()) : "",
        Page: this.stateFilterData.Page.toString(),
        PageSize: this.stateFilterData.PageSize.toString(),
        Order: this.stateFilterData.Order,
        ver: this.stateFilterData.ver
      };
      try {
        if (isPageRefresh) this.stateLoading = true;
        if (!isPageRefresh) this.stateDisplayData = [...[]]
        const response: AxiosResponse<ApiResponse<ListItem>> = await ApiService.get(CRUD_API_URL, "", new URLSearchParams(params).toString());
        this.stateDisplayData = response.data.result.content;
        this.setTotalPage(response.data.result.total || 0);
        this.stateLastUsedFilterData = {
          ...this.stateFilterData
        } as FilterData
      } catch (error) {
        console.log(error);
      }
      this.stateLoading = false;
    },
    async getLookup() {
      const params = {
        ver: this.stateFilterData.ver
      };
      try {
        const response: AxiosResponse<SingleApiResponse<LookupItem>> = await ApiService.get(LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        this.stateEmployeeCodeOption = mapOptionFromLookupApi(response.data.result.content, "emmployeeId", "employeeName")
        this.stateAdAccountOption = mapOption(response.data.result.content.adAccount)
        this.stateEmailOption = mapOption(response.data.result.content.email)
        this.statePhoneOption = mapOption(response.data.result.content.phone)
      } catch (error) {
        console.log(error)
      }
    },
    async getLookupCompany() {
      const params = {
        ver: this.stateFilterData.ver,
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(LOOKUP_COMPANY, "", new URLSearchParams(params).toString());
        this.stateCompanyOption = mapOptionFromLookupApi(response.data.result.content, "company", "companyDescription")
      } catch (error) {
        console.log(error)
      }
    },
    async getLookupLocation() {
      const params = {
        ver: this.stateFilterData.ver,
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(LOOKUP_LOCATION, "", new URLSearchParams(params).toString());
        this.stateLocationOption = mapOptionFromLookupApi(response.data.result.content, "siteId", "siteDescription")
      } catch (error) {
        console.log(error)
      }
    },
    async getLookupGender() {
      const params = {
        ver: this.stateFilterData.ver,
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(LOOKUP_GENDER, "", new URLSearchParams(params).toString());
        this.stateGenderOption = mapOptionFromLookupApi(response.data.result.content, "gender", "genderDescription")
      } catch (error) {
        console.log(error)
      }
    },
    async getLookupPosition() {
      const payload = {};
      const param = {
        ver: this.stateFilterData.ver
      }
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.post(`${LOOKUP_POSITION}?${new URLSearchParams(param).toString()}`, payload as AxiosRequestConfig);
        this.statePositionOption = mapOptionFromLookupApi(response.data.result.content, "position", "positionDescription")
      } catch (error) {
        console.log(error)
      }
    },
    async export() {
      const params = {
        EmployeeId: this.stateFilterData.EmployeeCode,
        Company: this.stateFilterData.Company,
        Name: this.stateFilterData.Name,
        AdAccount: this.stateFilterData.AdAccount,
        Email: this.stateFilterData.Email,
        Phone: this.stateFilterData.Phone,
        Gender: this.stateFilterData.Gender,
        Position: this.stateFilterData.Position,
        Location: this.stateFilterData.Location,
        StartDate: this.stateFilterData.StartDate ? formatDateForPostData(this.stateFilterData.StartDate.toLocaleString()) : "",
        EndDate: this.stateFilterData.EndDate ? formatDateForPostData(this.stateFilterData.EndDate.toLocaleString()) : "",
        ver: this.stateFilterData.ver,
        Gmt: new Date().toTimeString().slice(12, 17)
      };
      try {
        const response: AxiosResponse<Blob> = await ApiService.getBlob(EXPORT_API_URL, "", new URLSearchParams(params).toString());
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
      }, 200)
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
    setEmployeeCode(value: string) {
      this.stateFilterData.EmployeeCode = value;
    },
    setCompany(value: string) {
      this.stateFilterData.Company = value;
    },
    setName(value: string) {
      this.stateFilterData.Name = value;
    },
    setAdAccount(value: string) {
      this.stateFilterData.AdAccount = value;
    },
    setEmail(value: string) {
      this.stateFilterData.Email = value;
    },
    setPhone(value: string) {
      this.stateFilterData.Phone = value;
    },
    setGender(value: string) {
      this.stateFilterData.Gender = value;
    },
    setPosition(value: string) {
      this.stateFilterData.Position = value;
    },
    setLocation(value: string) {
      this.stateFilterData.Location = value;
    },
    setStartDate(value: string) {
      this.stateFilterData.StartDate = value;
    },
    setEndDate(value: string) {
      this.stateFilterData.EndDate = value;
    },
    async resetFilter() {
      this.stateFilterData.EmployeeCode = ""
      this.stateFilterData.Company = ""
      this.stateFilterData.Name = ""
      this.stateFilterData.AdAccount = ""
      this.stateFilterData.Email = ""
      this.stateFilterData.Phone = ""
      this.stateFilterData.Gender = ""
      this.stateFilterData.Position = ""
      this.stateFilterData.Location = ""
      this.stateFilterData.StartDate = ""
      this.stateFilterData.EndDate = ""
      const checkEmployeeCode = this.stateLastUsedFilterData.EmployeeCode !== ""
      const checkCompany = this.stateLastUsedFilterData.Company !== ""
      const checkName = this.stateLastUsedFilterData.Name !== ""
      const checkAdAccount = this.stateLastUsedFilterData.AdAccount !== ""
      const checkEmail = this.stateLastUsedFilterData.Email !== ""
      const checkPhone = this.stateLastUsedFilterData.Phone !== ""
      const checkGender = this.stateLastUsedFilterData.Gender !== ""
      const checkPosition = this.stateLastUsedFilterData.Position !== ""
      const checkLocation = this.stateLastUsedFilterData.Location !== ""
      const checkStartDate = this.stateLastUsedFilterData.StartDate !== ""
      const checkEndDate = this.stateLastUsedFilterData.EndDate !== ""
      if (checkEmployeeCode || checkCompany || checkName || checkAdAccount || checkEmail || checkPhone || checkGender || checkPosition || checkLocation || checkStartDate || checkEndDate) {
        await this.getData()
      }
    },
    resetState() {
      this.stateFilterData = {
        EmployeeCode: "", // change later
        Company: "",
        Name: "",
        AdAccount: "",
        Email: "",
        Phone: "",
        Gender: "",
        Position: "",
        Location: "",
        ver: "v1",
        Page: 1,
        PageSize: 10,
        Order: ""
      } as FilterData;
      this.stateDisplayData = [] as ListItem[];
      this.statePagination = new PaginationType();
      this.stateLoading = false;
      this.statePaginationLoading = false;
    }
  }
});
