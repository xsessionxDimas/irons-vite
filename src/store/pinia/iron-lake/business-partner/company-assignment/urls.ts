const DEFAULT_API = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_UTILITY}/api/master_company_assignment`
export const CRUD_API_URL = `${DEFAULT_API}/company_assignment`
export const BULK_API_URL = `${DEFAULT_API}/company_assignment_bulk`
export const UPLOAD_API_URL = `${DEFAULT_API}/validate_upload`
export const EXPORT_API_URL = `${DEFAULT_API}/export`
export const LOOKUP_API_URL = `${DEFAULT_API}/lookup`
export const UPDATE_API_URL = `${CRUD_API_URL}/update`
