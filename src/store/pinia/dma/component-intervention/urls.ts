const baseUrl = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/intervention`;
// listing record untuk dropdown
export const COMPONENT_INTERVENTION_API_URL = `${baseUrl}/get_intervention_list`;
export const INTERVENTION_DETAIL_API_URL = `${baseUrl}/`

// 1 record ini isi 1 aja
export const GENERATE_SERVICE_SHEET_API_URL = `${baseUrl}/get_intervention`;
export const GENERATE_SERVICE_SHEET_API_URL_COSMOS = `${baseUrl}/get_data_by_param`;

// buat check done & total task
export const GET_TASK_PROGRESS_API_URL = `${baseUrl}/get_task_progress`

// bentuk list top brp
// ada sorting: asc desc
// TOP 5 atau 4
export const GENERATE_SERVICE_SHEET_API_URL_3 = `${baseUrl}/get_data_by_param_limit?ver=v1`;


// const serviceSheetHeadeUrl = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/service_sheet_header`
export const GENERAL_SERVICE_SHEET_API_URL = `${baseUrl}/update`
export const GET_SERVER_TIME = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/master_setting/get_server_time`

export const GET_HEADER_FIELD_VALUE = `${baseUrl}/get_field_value`
export const GET_MASTER_SETTING_BY_PARAM = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/master_setting/get_data_by_param`
export const PUT_SERVICE_SHEET_API_URL = `${baseUrl}/update_task`
export const UPDATE_TASK_WITH_DEFECT = `${baseUrl}/update_task_with_defect`
export const GET_DETAIL_FIELD_VALUE = `${baseUrl}/get_field_value`

const DEFECTHEADERURL = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/defect_header`
export const GETDEFECTHEADERBYPARAMURL = `${DEFECTHEADERURL}/get_data_by_param`
export const UPDATEDEFECTHEADERURL = `${DEFECTHEADERURL}/update`

export const GET_PARAM_DATE_EST = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/master_setting/get_data_by_param?ver=v1`
