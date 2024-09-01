const serviceSheetHeadeUrl = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/service_sheet_header`
const serviceSheetDetailUrl = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/service_sheet_detail`
const offlineServiceSheetHeaderUrl = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/service_sheet_header_offline`
const serviceSheetDetailUrlOffline = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/service_sheet_detail_offline`
export const GENERATE_SERVICE_SHEET_API_URL = `${serviceSheetHeadeUrl}/service_sheet`
export const PUT_SERVICE_SHEET_API_URL = `${serviceSheetDetailUrlOffline}/update_task`
export const GET_TASK_PROGRESS_API_URL = `${serviceSheetDetailUrl}/get_task_progress`
export const GET_SERVICE_SHEET_DETAIL_DATA_BY_PARAM_API_URL = `${serviceSheetDetailUrl}/get_data_by_param`
export const GET_PARAMETER_EHMS_API_URL = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_ADM}/api/master_data/parameter_ehms/rating`
export const GENERAL_SERVICE_SHEET_API_URL = `${offlineServiceSheetHeaderUrl}/update`
export const GENERAL_SERVICE_SHEET_SUBMIT_API_URL = `${offlineServiceSheetHeaderUrl}/update`
export const UPDATE_TASK_FITTER_VALIDATION_URL = `${serviceSheetHeadeUrl}/update_task`
export const GET_DETAIL_FIELD_VALUE = `${serviceSheetDetailUrl}/get_field_value`
export const GET_HEADER_FIELD_VALUE = `${serviceSheetHeadeUrl}/get_field_value`
export const GET_SERVER_TIME = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/master_setting/get_server_time`
export const GET_MASTER_SETTING_BY_PARAM = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/master_setting/get_data_by_param`

// ------- adjustment CBM auto --------
const DEFECTHEADERURL = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/defect_header`
export const GETDEFECTHEADERBYPARAMURL = `${DEFECTHEADERURL}/get_data_by_param`
export const UPDATEDEFECTHEADERURL = `${DEFECTHEADERURL}/update`
export const UPDATEDEFECTHEADERBYSERVICESHEETDETAILURL = `${DEFECTHEADERURL}/update_with_service_detail_id`
// ------- adjustment CBM auto --------

// --------- SUSPENSION CYLINDER ---------
const suspensionCylinderUrl = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/calibration_header`
export const getSCTemplate = `${suspensionCylinderUrl}/calibration_payload`
export const updateTaskSC = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/calibration_detail/update_task`
export const updateHeaderSC = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/calibration_header/update`
// --------- SUSPENSION CYLINDER ---------

// --------- PREVIOIS TANDEM ---------
export const GET_PREVIOUS_TANDEM = `${serviceSheetDetailUrl}/get_previous_tandem`
// --------- PREVIOIS TANDEM ---------

// --------- HM OFFSET ---------
export const GET_HM_OFFSET = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/ironlake-asset/api/ironlake/equipment/get_hm_offset`
// --------- HM OFFSET ---------
