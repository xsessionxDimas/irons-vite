/* intervention endpoints */
export const BASE_URL = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/intervention`
export const GET_DATA_LIST_BY_PARAM = `${BASE_URL}/get_data_list_by_param?ver=v1`
export const UPDATE_DATA = `${BASE_URL}/update?ver=v1`
export const UPDATE_DATA_TASK = `${BASE_URL}/update_task?ver=v1`
export const UPDATE_TASK_WITH_DEFECT = `${BASE_URL}/update_task_with_defect?ver=v1`
export const GET_DETAIL_FIELD_VALUE = `${BASE_URL}/get_field_value`
export const GET_LAST_SYNC_DATE = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/history_intervention_sync/get_data_list_by_param_limit`
export const UPLOAD_URL = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/attachment/upload`
export const SYNC_DATA_PORTAL_FORM = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/intervention/sync_intervention`
export const OFFSET_DATE_EST_URL = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/master_setting/get_data_by_param?ver=v1`
export const GET_DEFECT_HEADER = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/intervention_defect_header/get_data_by_param?ver=v1`
export const GET_DEFECT_DETAIL = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/intervention_defect_detail/get_data_by_param?ver=v1`
export const GET_DEFECTS_HEADER = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/intervention_defect_header/get_data_list_by_param?ver=v1`
export const GET_DEFECTS_DETAIL = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/intervention_defect_detail/get_data_list_by_param?ver=v1`
export const GET_DEFECTS_COUNT = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/intervention/get_defect_identified_count`
export const UPDATE_DEFECT_DETAIL = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/intervention_defect_detail/update?ver=v1`
export const UPDATE_DEFECT_DETAIL_BY_FITTER = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/intervention_defect_detail/update_by_fitter?ver=v1`
export const GET_DEFECTS_ALL_SECTION = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/intervention_defect_header/get_intervention_defect_header`
export const UPDATE_DEFECT_HEADER = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/intervention_defect_header/update?ver=v1`;

// service form
export const SERVICE_FORM_BASE_URL = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/service_sheet_header_offline`
export const SERVICE_FORM_DETAIL_BASE_URL = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/service_sheet_detail`
export const SERVICE_FORM_DETAIL_BASE_URL_OFFLINE = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/service_sheet_detail_offline`
export const UPDATE_SERVICE_SHEET_HEADER = `${SERVICE_FORM_BASE_URL}/update?ver=v1`
export const UPDATE_SERVICE_SHEET_HEADER_SUBMIT = `${SERVICE_FORM_BASE_URL}/update_task?ver=v1`
export const UPDATE_SERVICE_SHEET_DETAIL = `${SERVICE_FORM_DETAIL_BASE_URL_OFFLINE}/update_task?ver=v1`
export const UPDATE_SERVICE_SHEET_DEFECT_TASK = `${SERVICE_FORM_DETAIL_BASE_URL}/update_task_with_defect?ver=v1`
export const UPDATE_SERVICE_SHEET_DEFECT_TASK_MULTIPLE = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/service_sheet_detail/update_task_with_defect_multiple?ver=v1`
export const UPDATE_SERVICE_FORM_DEFECT_DATA = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/defect_header/update_with_service_detail_id?ver=v1`
export const UPDATE_SERVICE_FORM_DEFECT_DETAIL_FITTER = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/defect_detail/update_by_fitter?ver=v1`;
export const UPDATE_SERVICE_FORM_GENERIC_DEFECT = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/service_sheet_detail/create_generic_defect?ver=v1`;
// suspension service form
export const updateTaskSC = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/calibration_detail/update_task?ver=v1`
export const updateHeaderSC = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/calibration_header/update?ver=v1`
// generic
export const POST_GENERIC_DEFECT = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/intervention/create_generic_defect?ver=v1`;
