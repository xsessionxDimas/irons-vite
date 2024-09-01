const serviceSheetDetailUrl = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/service_sheet_detail`
export const UPDATE_TASK_WITH_DEFECT = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/service_sheet_detail/update_task_with_defect`;
export const GET_DEFECT_DETAIL = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/defect_detail/get_data_by_param/`;
export const GET_DEFECTS_HEADER = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/defect_header/get_data_list_by_param?ver=v1`;
export const GET_DEFECTS_DETAIL = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/defect_detail/get_data_list_by_param?ver=v1`;
export const UPDATE_DEFECT_HEADER = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/defect_header/update?ver=v1`;
export const UPDATE_DEFECT_DETAIL = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/defect_detail/update?ver=v1`;
export const GET_DETAIL_FIELD_VALUE = `${serviceSheetDetailUrl}/get_field_value`;
export const UPDATE_DEFECT_DETAIL_FITTER = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/defect_detail/update_by_fitter?ver=v1`;
export const GET_DEFECTS_ALL_SECTION = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/defect_header/get_service_sheet_defect_header`
export const GET_ALL_DEFECTS = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/defect_header/get_data_defect_history`

// multiple defect list
export const GET_DATA_MULTIPLE_DEFECT_LIST = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/defect_detail/get_data_list_multiple_defect`;
export const POST_DATA_MULTIPLE_DEFECT_LIST = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/service_sheet_detail/update_task_with_defect_multiple`;

// get ownership
export const LOOKUP_OWNERSHIP_API_URL = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_ADM}/api/master_data/equipment_number`
export const PART_REFERENCE_API = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_ADM}/api/master_data/partbook`

// generic defect
export const POST_DATA_GENERIC_DEFECT = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/service_sheet_detail/create_generic_defect`;

// cbm detail
export const GET_DEFECTS_CBM = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/service_sheet_detail/get_data_detail_cbm?ver=v1`;
