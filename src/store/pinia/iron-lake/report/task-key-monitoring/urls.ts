const TASK_KEY_MONITORING = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_ADM}/api/master_data/monitoring_task_key`
export const CRUD_API_URL = `${TASK_KEY_MONITORING}`
export const BULK_API_URL = `${TASK_KEY_MONITORING}company_bulk`
export const UPLOAD_API_URL = `${TASK_KEY_MONITORING}validate_upload`
export const EXPORT_API_URL = `${TASK_KEY_MONITORING}/export`
export const LOOKUP_API_URL = `${TASK_KEY_MONITORING}/lookup`
export const UPDATE_API_URL = `${CRUD_API_URL}/update`
