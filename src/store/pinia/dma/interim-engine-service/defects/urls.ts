const serviceSheetDetailUrl = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/interim_engine_detail`
export const UPDATE_TASK_WITH_DEFECT = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/interim_engine_detail/update_task_with_defect`;
export const UPDATE_TASK_SHEET_WITH_DEFECT = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/service_sheet_detail/update_task_with_defect`;

export const GET_DEFECT_DETAIL = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/interim_engine_defect_detail/get_data_by_param/`;
export const GET_DEFECTS_HEADER = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/interim_engine_defect_header/get_data_list_by_param?ver=v1`;
export const GET_DEFECTS_DETAIL = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/interim_engine_defect_detail/get_data_list_by_param?ver=v1`;
export const UPDATE_DEFECT_HEADER = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/interim_engine_defect_header/update?ver=v1`;
export const UPDATE_DEFECT_DETAIL = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/interim_engine_defect_detail/update?ver=v1`;
export const GET_DETAIL_FIELD_VALUE = `${serviceSheetDetailUrl}/get_field_value`;

export const GET_DEFECTS_ALL_SECTION = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/interim_engine_defect_header/get_interim_defect_header`
