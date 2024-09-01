import { AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import ApiService from "@/core/services/ApiService";

// URLs
import {
  CRUD_API_URL as GET_EMPLOYEE_API_URL
} from "@/store/pinia/administration/organization-unit/employee/urls";

// ======================================================================
// VARIABLES
// ======================================================================

export const columnAndTableList1 = [
  { // SITE
    column: "site_description",
    table: "vw_dim_site",
    slicerTitle: "site_slicer",
    btnClearTitles: [
      "clear_site",
      "csd_clr_site",
      "cld_clr_site"
    ],
    sessionStorageName: "IronPortalDashboardFilter-Site",
  },
  { // GROUP
    column: "equipment_hierarchy",
    table: "vw_dim_equipment",
    slicerTitle: "group_slicer",
    btnClearTitles: [
      "clear_group",
      "csd_clr_group",
      "cld_clr_group"
    ],
    sessionStorageName: "IronPortalDashboardFilter-Group",
  },
  { // MODEL
    column: "model_unit",
    table: "vw_dim_equipment",
    slicerTitle: "model_slicer",
    btnClearTitles: [
      "clear_model",
      "csd_clr_model",
      "cld_clr_model"
    ],
    sessionStorageName: "IronPortalDashboardFilter-Model",
  },
  { // COMPONENT TYPE
    column: "component_type",
    table: "vw_dim_component",
    slicerTitle: "comptype_slicer",
    btnClearTitles: [
      "clear_comptype",
      "csd_clr_comptype",
      "cld_clr_comptype"
    ],
    sessionStorageName: "IronPortalDashboardFilter-ComponentType",
  },
  { // COMPONENT
    column: "component_name",
    table: "vw_dim_component",
    slicerTitle: "component_slicer",
    btnClearTitles: [
      "clear_component",
      "csd_clr_component",
      "cld_clr_component"
    ],
    sessionStorageName: "IronPortalDashboardFilter-Component",
  },
];


// ======================================================================
// FUNCTIONS
// ======================================================================

export const getLocationCode = async (employeeId) => {
  const params = {
    employeeId: employeeId,
    page: "1",
    pageSize: "1",
    ver: "v1"
  };
  try {
    const response: AxiosResponse<ApiResponse<any>> = await ApiService.get(GET_EMPLOYEE_API_URL, "", new URLSearchParams(params).toString());
    return response.data.result.content[0].Location;
  } catch (error) {
    console.log(error);
  }
  return "";
}

export const getAllOptionsFromPbiSlicer = (stringifiedArray: string) => {
  let allOptions = stringifiedArray.split("\r\n");
  allOptions = allOptions.splice(1, allOptions.length - 1)
  return allOptions.filter((e) => {
    return e != "";
  });
}

export const getAllDataFromPbiTable = (stringifiedArray: string) => {
  let allOptions = stringifiedArray.split("\r\n");
  allOptions = allOptions[1].split(",")
  return allOptions.filter((e) => {
    return e != "";
  });
}

export const getAllDataFromPbiTableOneColumn = (stringifiedArray: string) => {
  let allOptions = stringifiedArray.split("\r\n");
  allOptions = allOptions.slice(1)
  return allOptions.filter((e) => {
    return e != "";
  });
}

export const getCBMDataFromPbiTable = (stringifiedArray: string, sRanking: string) => {
  const allOptions = stringifiedArray.split("\r\n");
  for (let i = 1; i < allOptions.length - 1; i++) {
    const values = allOptions[i].split(",");
    const sampleType = values[0];
    const SRanking = values[5];

    // Check if sample_type is "IronForms CBM" and SRanking is "sRanking"
    if (sampleType === "IronForms CBM" && SRanking === sRanking) {
      // If the condition is met, create an object with relevant data and push it to the result array
      const obj = {
        sample_type: sampleType,
        task_key: values[1],
        work_order: values[2],
        sample_type_from: values[3],
        date_by_event: values[4],
        SRanking: SRanking,
        Last_sample_rating: values[6]
      };
      return obj
    }
  }
}
