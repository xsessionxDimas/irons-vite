import PaginationType from "@/core/types/misc/Pagination";
import { Option } from "@/core/types/misc/Option";
import ApiService from "@/core/services/ApiService";
import {
  IRONLAKE_CRUD_API_URL,
  LOOKUP_API_URL,
  LOOKUP_GENDER,
  IRONLAKE_LOOKUP_DIRECT_SPV,
  IRONLAKE_EXPORT_API_URL,
  IRONLAKE_LOOKUP_VENDOR
} from "./urls";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  ListItem
} from "@/core/types/entities/administration/organization-unit/employee/ListItem";
import {
  FilterData
} from "@/core/types/entities/administration/organization-unit/employee/FilterData";
import {
  LookupItem
} from "@/core/types/entities/administration/organization-unit/employee/LookupItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import { EmployeeContent } from "@/core/types/misc/ContentResult";
import {
  LOOKUP_API_URL as LOOKUP_COMPANY,
} from "@/store/pinia/iron-lake/business-partner/company/urls";
import { mapOption, mapOptionFromLookupApi } from "@/core/helpers/mapOption";
import {
  ExportFilterData
} from "@/core/types/entities/administration/organization-unit/employee/ExportFilterData";
import {
  ListDraftItem
} from "@/core/types/entities/administration/organization-unit/employee/ListDraftItem";
import { LOOKUP_POSITION, LOOKUP_LOCATION } from "../position/urls";
import {
  useAuthenticationStore
} from "../../../application/useAuthenticationStore";

const authStore = useAuthenticationStore();
const userDetail = authStore.user;

export const useEmployeeListStore = defineStore({
  id: "employeeList",
  state: () => {
    return {
      stateFilterData: {
        employeeId: "",
        company: "",
        name: "",
        email: "",
        positionId: null,
        siteId: userDetail.isHO === 1 ? "" : userDetail.SiteId,
        vendorId: null,
        supervisorId: "",
        isActive: "",
        ver: "v1",
        page: 1,
        pageSize: 20,
      } as unknown as FilterData,
      stateLastUsedFilterData: {
        employeeId: "",
        company: "",
        name: "",
        email: "",
        positionId: null,
        siteId: userDetail.isHO === 1 ? "" : userDetail.SiteId,
        vendorId: null,
        supervisorId: "",
        isActive: "",
        ver: "v1",
        page: 1,
        pageSize: 20,
      } as unknown as FilterData,
      stateExportFilter: {
        company: "",
        name: "",
        email: "",
        positionId: null,
        siteId: userDetail.isHO === 1 ? "" : userDetail.SiteId,
        vendorId: null,
        supervisorId: "",
        status: true,
      } as ExportFilterData,
      statePageName: "employee",
      stateDraftData: [] as ListDraftItem[],
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
      stateDirectSupervisor: [] as Option[],
      stateVendorOption: [] as Option[],
      stateVendorOptionFilter: [] as Option[],
      stateSearchValue: "" as string,
      stateSelectedSites: [] as string[],
    }
  },
  getters: {
    /**
     * Getters to get current page name
     * @param state - The pinia state context
     * @returns statePageName - The current page name
     */
    pageName: (state) => {
      return state.statePageName;
    },

    /**
     * Getters to get current pagination
     * @param state - The pinia state context
     * @returns statePagination - The current pagination for table
     */
    pagination: (state) => {
      return state.statePagination;
    },

    /**
     * Getters to handle general search from FE
     * @param state - The pinia state context
     * @returns filtered ListItem[] - for search purpose if there's search query
     * @returns default ListItem[] - if there's no search query
     */
    displayData: (state) => {
      if (state.stateSearchValue) {
        return state.stateDisplayData.filter((item) => {
          return item.name?.toLowerCase().includes(state.stateSearchValue.toLocaleLowerCase()) ||
          item.company?.toLowerCase().includes(state.stateSearchValue.toLocaleLowerCase()) ||
          item.position?.toLowerCase().includes(state.stateSearchValue.toLocaleLowerCase()) ||
          item.email?.toLowerCase().includes(state.stateSearchValue.toLocaleLowerCase()) ||
          item.siteName?.toLowerCase().includes(state.stateSearchValue.toLocaleLowerCase()) ||
          item.vendor?.toLowerCase().includes(state.stateSearchValue.toLocaleLowerCase()) ||
          item.superiorName?.toLowerCase().includes(state.stateSearchValue.toLocaleLowerCase())
        })
      }
      return state.stateDisplayData;
    },

    draftData: (state) => {
      return state.stateDraftData;
    },

    filteredSupervisors: (state) => {
      return state.stateDirectSupervisor
    },
    /**
     * Getters to handle filter
     * @param state - The pinia state context
     * @returns stateFilterData
     */
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
    /**
     * Function to get all data for employee table
     * @param isPageRefresh - to indicate the loading state
     * @returns void
     */
    async getData(isPageRefresh = true) {
      this.stateLastUsedFilterData = {
        ...this.stateFilterData
      } as FilterData
      const payload = {
        // Commented the existing code, in case we need it in the future, if don't just delete these
        // EmployeeId: this.stateFilterData.EmployeeCode, // change later
        // Company: this.stateFilterData.Company,
        // Name: this.stateFilterData.Name,
        // AdAccount: this.stateFilterData.AdAccount,
        // Email: this.stateFilterData.Email,
        // Phone: this.stateFilterData.Phone,
        // Gender: this.stateFilterData.Gender,
        // Position: this.stateFilterData.Position,
        // Location: this.stateFilterData.Location,
        // StartDate: this.stateFilterData.StartDate ? formatDateForPostData(this.stateFilterData.StartDate.toLocaleString()) : "",
        // EndDate: this.stateFilterData.EndDate ? formatDateForPostData(this.stateFilterData.EndDate.toLocaleString()) : "",
        // Page: this.stateFilterData.Page.toString(),
        // PageSize: this.stateFilterData.PageSize.toString(),
        // Order: this.stateFilterData.Order,
        name: this.stateFilterData.name,
        company: this.stateFilterData.company,
        vendorId: this.stateFilterData.vendorId,
        siteId: this.stateFilterData.siteId,
        supervisorId: this.stateFilterData.supervisorId,
        positionId: this.stateFilterData.positionId,
        email: this.stateFilterData.email,
        status: this.stateFilterData.isActive === "" ? null : this.stateFilterData.isActive === "true" ? true : false,
        page: this.stateFilterData.page,
        pageSize: this.stateFilterData.pageSize,
      };
      const ver = `ver=${this.stateFilterData.ver}`
      try {
        if (isPageRefresh) this.stateLoading = true;
        if (!isPageRefresh) this.stateDisplayData = [...[]]
        const response: AxiosResponse<SingleApiResponse<EmployeeContent<ListItem>>> = await ApiService.post(`${IRONLAKE_CRUD_API_URL}?${new URLSearchParams(ver).toString()}`, payload as AxiosRequestConfig);
        this.stateDisplayData = response.data.result.content.employeeList;
        this.stateDraftData = response.data.result.content.employeeDraftList;
        // need confirmation from BE for `response.data.result.total` since it is not exist in the response
        this.setTotalPage(response.data.result.content.totalData || 0)
      } catch (error) {
        console.error(error);
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
      this.stateLocationOption = [];
      const params = {
        ver: this.stateFilterData.ver,
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(LOOKUP_LOCATION, "", new URLSearchParams(params).toString());
        const dataResponse = response.data.result.content;
        this.stateLocationOption = []
        dataResponse.forEach((e, i) => {
          const single = {
            value: e.siteId,
            label: e.siteDescription,
          };
          this.stateLocationOption.push(single);
        });
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
      try {
        const params = {
          ver: this.stateFilterData.ver,
          company: "",
        };
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(`${LOOKUP_POSITION}`, "", new URLSearchParams(params).toString());
        const responseData = response.data.result.content;
        this.statePositionOption = [];
        responseData.forEach((el) => {
          const single = {
            value: el.positionId,
            label: el.position,
          }
          this.statePositionOption.push(single);
        })
      } catch (error) {
        console.log(error)
      }
    },
    async getLookupDirectSupervisor(siteId: string) {
      this.stateDirectSupervisor = [];
      const payload = {
        siteId: siteId || "",
      }
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.post(`${IRONLAKE_LOOKUP_DIRECT_SPV}`, payload as AxiosRequestConfig);
        const responseData = response.data.result.content;
        this.stateDirectSupervisor = [];
        responseData.forEach((el) => {
          const single = {
            value: el.employeeId,
            label: el.directSupervisorName,
          }
          this.stateDirectSupervisor.push(single);
        })
      } catch (error) {
        console.log(error)
      }
    },
    async getLookupVendor() {
      this.stateVendorOption = [];
      this.stateVendorOptionFilter = [];
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(`${IRONLAKE_LOOKUP_VENDOR}`);
        const responseData = response.data.result.content;
        responseData.forEach((el) => {
          const single = {
            value: el.vendorId,
            label: el.vendorDescription,
          }
          this.stateVendorOption.push(single);
          this.stateVendorOptionFilter.push(single);
        })
        this.stateVendorOption.push({
          value: 'other',
          label: 'Add Another Vendor',
        })
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * Function to handle export data from employee table
     * @returns Excel file
     */
    async export() {
      const qParams = {
        ver: 'v1',
      };
      this.stateExportFilter.company = this.stateFilterData.company;
      this.stateExportFilter.vendorId = this.stateFilterData.vendorId;
      this.stateExportFilter.positionId = this.stateFilterData.positionId;
      this.stateExportFilter.name = this.stateFilterData.name;
      this.stateExportFilter.email = this.stateFilterData.email;
      this.stateExportFilter.siteId = this.stateFilterData.siteId;
      this.stateExportFilter.supervisorId = this.stateFilterData.supervisorId;
      this.stateExportFilter.status = this.stateFilterData.isActive === "" ? null : this.stateFilterData.isActive === "true" ? true : false;
      try {
        const response: AxiosResponse<Blob> = await ApiService.postBlob(`${IRONLAKE_EXPORT_API_URL}/false?${new URLSearchParams(qParams).toString()}`, this.stateExportFilter as AxiosRequestConfig);
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
    async template() {
      const qParams = {
        ver: 'v1',
      };
      try {
        const response: AxiosResponse<Blob> = await ApiService.postBlob(`${IRONLAKE_EXPORT_API_URL}/true?${new URLSearchParams(qParams).toString()}`, this.stateExportFilter as AxiosRequestConfig);
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
    async setPage(newPage: number) {
      this.statePaginationLoading = true;
      this.statePagination.handleCurrentPageChange(newPage);
      this.statePagination.totalPageSize = this.stateFilterData.pageSize;
      this.stateFilterData.page = this.statePagination.currentPage;
      await this.getData(true);
      setTimeout(() => {
        this.statePaginationLoading = false;
      }, 200)
    },
    async setPageSize(size: number) {
      this.statePaginationLoading = true;
      this.stateFilterData.pageSize = size;
      this.statePagination.totalPageSize = this.stateFilterData.pageSize;
      this.stateFilterData.page = this.statePagination.currentPage;
      await this.getData(true);
      setTimeout(() => {
        this.statePaginationLoading = false;
      }, 200)
    },
    // Commented the existing code, in case we need it in the future, if we don't need just delete these
    // async setSort({ prop, order }) {
    //   if (!prop && !order) {
    //     this.stateFilterData.Order = "";
    //   } else {
    //     const formatedOrder = order == "ascending" ? "asc" : "desc";
    //     this.stateFilterData.Order = `${prop}_${formatedOrder}`;
    //   }
    //   this.statePagination.handleCurrentPageChange(1);
    //   this.stateFilterData.Page = this.statePagination.currentPage;
    //   await this.getData(false);
    // },

    /**
     * Function to set filter data and refetch if filter is applied
     * @param filter - The chosen filter applied, either company, vendor, role, or supervisor
     * @returns void
     */
    async setFilterData(filter: FilterData) {
      this.stateLoading = true;
      this.stateFilterData = filter
      await this.getData(false)
    },
    setLastActiveFilter(filter: FilterData) {
      this.stateFilterData = filter
    },
    setTotalPage(totalPage: number) {
      this.pagination.totalPage = totalPage;
      this.pagination.getPaginationStartIndex();
      this.pagination.getPaginationLastIndex();
    },

    /**
     * Function to mutate stateFilterData employee ID
     * @param value - The employee ID to set
     * @returns void
     */
    setEmployeeId(value: string) {
      this.stateFilterData.employeeId = value;
    },

    /**
     * Function to set mutate stateFilterData company
     * @param value - The company to set
     * @returns void
     */
    setCompany(value: string) {
      this.stateFilterData.company = value;
    },

    /**
     * Function to set mutate stateFilterData name
     * @param value - The name to set
     * @returns void
     */
    setName(value: string) {
      this.stateFilterData.name = value;
    },

    /**
     * Function to set mutate stateFilterData email
     * @param value - The email to set
     * @returns void
     */
    setEmail(value: string) {
      this.stateFilterData.email = value;
    },

    /**
     * Function to set mutate stateFilterData role
     * @param value - The role to set
     * @returns void
     */
    setRole(value: number) {
      this.stateFilterData.positionId = value;
    },

    /**
     * Function to set mutate stateFilterData siteName
     * @param value - The siteName to set
     * @returns void
     */
    setSiteName(value: string) {
      this.stateFilterData.siteId = value;
    },

    /**
     * Function to set mutate stateSearchValue
     * @param value - The search query to set
     * @returns void
     */
    setSearchValue(value: string) {
      this.stateSearchValue = value;
    },

    setSelectedSites(value: string[]) {
      this.stateSelectedSites = value
    },

    /**
     * Function to reset filter and refetch data
     * @returns void
     */
    async resetFilter() {
      this.stateFilterData.employeeId = ""
      this.stateFilterData.company = ""
      this.stateFilterData.name = ""
      this.stateFilterData.email = ""
      this.stateFilterData.positionId = null
      this.stateFilterData.supervisorId = ""
      this.stateFilterData.siteId = ""
      const checkEmployeeId = this.stateLastUsedFilterData.employeeId !== ""
      const checkCompany = this.stateLastUsedFilterData.company !== ""
      const checkName = this.stateLastUsedFilterData.name !== ""
      const checkEmail = this.stateLastUsedFilterData.email !== ""
      const checkRole = this.stateLastUsedFilterData.positionId !== null
      const checkSupervisorName = this.stateLastUsedFilterData.supervisorId !== ""
      const checkSiteName = this.stateLastUsedFilterData.siteId !== ""
      if (checkEmployeeId || checkCompany || checkName || checkEmail || checkRole || checkSiteName || checkSupervisorName) {
        await this.getData()
      }
    },
    async softResetFilter() {
      this.stateFilterData.employeeId = ""
      this.stateFilterData.company = ""
      this.stateFilterData.name = ""
      this.stateFilterData.email = ""
      this.stateFilterData.positionId = null
      this.stateFilterData.siteId = ""
      this.stateFilterData.supervisorId = ""
    },
    /**
     * Function to reset state
     * @returns void
     */
    resetState() {
      this.stateFilterData = {
        employeeId: "", // change later
        company: "",
        name: "",
        email: "",
        positionId: NaN,
        siteId: userDetail.isHO === 1 ? "" : userDetail.SiteId,
        vendorId: NaN,
        supervisorId: "",
        isActive: "",
        ver: "v1",
        page: 1,
        pageSize: 20,
        // Order: ""
      } as FilterData;
      this.stateDisplayData = [] as ListItem[];
      this.stateDirectSupervisor = [];
      this.statePagination = new PaginationType();
      this.stateLoading = false;
      this.statePaginationLoading = false;
      this.stateLocationOption = [];
    }
  }
});
