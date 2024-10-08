export const CRUD_API_URL = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_IRON_PORTAL}/api/master_cbm_threshold`
export const LOOKUP_UOM_TRANSACTION = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_ADM}/api/master_data/uom/lookup_transaction`
export const DOWNLOAD_TEMPLATE = `${CRUD_API_URL}/download_template`

export const GET_REGISTER_NUMBER_API_URL = `${CRUD_API_URL}/register_number`
export const GET_THRESHOLD_API_URL = `${CRUD_API_URL}/get_data_threshold`
export const GET_LOOKUP_API_URL = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_ADM}/api/master_data/cbm_threshold/lookup_data`

// GENERAL
export const GET_API_URL = `${CRUD_API_URL}`
export const BULK_API_URL = `${CRUD_API_URL}/cbm_threshold_bulk`
export const UPLOAD_API_URL = `${CRUD_API_URL}/validate_upload`
export const EXPORT_API_URL = `${CRUD_API_URL}/export`
export const LOOKUP_API_URL = `${CRUD_API_URL}/lookup`
export const LOOKUP_TRANSACTION_API_URL = `${CRUD_API_URL}/lookup_transaction`
export const INSERT_API_URL = `${CRUD_API_URL}/cbm_threshold`
export const UPDATE_API_URL = `${CRUD_API_URL}/cbm_threshold/update`

// SPECIFIC
export const BULK_API_URL_SPECIFIC = `${CRUD_API_URL}/cbm_threshold_bulk_specific`
export const UPLOAD_API_URL_SPECIFIC = `${CRUD_API_URL}/validate_upload_specific`
export const LOOKUP_TRANSACTION_API_URL_SPECIFIC = `${CRUD_API_URL}/lookup_transaction_specific`
export const INSERT_API_URL_SPECIFIC = `${CRUD_API_URL}/cbm_threshold_specific`
export const UPDATE_API_URL_SPECIFIC = `${CRUD_API_URL}/cbm_threshold/update_specific`
