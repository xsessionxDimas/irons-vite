export const CRUD_API_URL = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_IRON_PORTAL}/api/component_replacement`
export const GET_API_URL = `${CRUD_API_URL}`
export const BULK_API_URL = `${CRUD_API_URL}/component_replacement_bulk`
export const UPLOAD_API_URL = `${CRUD_API_URL}/validate_upload`
export const EXPORT_API_URL = `${CRUD_API_URL}/export`
export const LOOKUP_API_URL = `${CRUD_API_URL}/lookup`
export const LOOKUP_ADD_API_URL = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_ADM}/api/master_data/counter_reading/lookup_data` // Lookup sama dengan counter reading
