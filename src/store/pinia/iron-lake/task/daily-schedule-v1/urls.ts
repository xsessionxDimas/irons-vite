export const CRUD_API_URL = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_ADM}/api/master_data/daily_schedule`
export const BULK_API_URL = `${CRUD_API_URL}/bulk`
export const UPLOAD_API_URL = `${CRUD_API_URL}/validate_upload`
export const EXPORT_API_URL = `${CRUD_API_URL}/export`
export const LOOKUP_API_URL = `${CRUD_API_URL}/lookup`
export const LOOKUP_EQUIPMENT_NUMBER_API_URL = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_ADM}/api/master_data/equipment_number/lookup`
export const LOOKUP_PS_TYPE_API_URL = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_ADM}/api/master_data/daily_schedule/lookup_pstype`
export const LOOKUP_SHIFT_API_URL = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_ADM}/api/master_data/shift/lookup`
export const UPDATE_API_URL = `${CRUD_API_URL}/update`
export const DELETE_API_URL = `${CRUD_API_URL}/update_isdeleted`

