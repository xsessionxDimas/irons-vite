export const CRUD_API_URL = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_IRON_PORTAL}/api/master_cbm_status`
export const GET_API_URL = `${CRUD_API_URL}`
/** @note General API */
export const EXPORT_API_URL_GENERAL = `${CRUD_API_URL}/general_export`
export const LOOKUP_API_URL_GENERAL = `${CRUD_API_URL}/general_lookup`
export const LOOKUP_TRANSACTION_API_URL_GENERAL = `${CRUD_API_URL}/general_lookup_transaction`
export const UPDATE_API_URL_GENERAL = `${CRUD_API_URL}/cbm_status_general/update`

/** @note Specific API */
export const LOOKUP_API_URL_SPECIFIC = `${CRUD_API_URL}/specific_lookup`
export const LOOKUP_TRANSACTION_API_URL_SPECIFIC = `${CRUD_API_URL}/specific_lookup_transaction`
export const UPLOAD_API_URL_SPECIFIC = `${CRUD_API_URL}/specific_validate_upload`
export const BULK_API_URL_SPECIFIC = `${CRUD_API_URL}/cbm_status_specific_bulk`
export const UPDATE_API_URL_SPECIFIC = `${CRUD_API_URL}/cbm_status_specific/update`
export const EXPORT_API_URL_SPECIFIC = `${CRUD_API_URL}/specific_export`
export const INSERT_API_URL_SPECIFIC = `${CRUD_API_URL}/cbm_status_specific_bulk`
