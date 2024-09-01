const COMPANY_URL = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_UTILITY}/api/master_company/`
export const CRUD_API_URL = `${COMPANY_URL}company`
export const BULK_API_URL = `${COMPANY_URL}company_bulk`
export const UPLOAD_API_URL = `${COMPANY_URL}validate_upload`
export const EXPORT_API_URL = `${COMPANY_URL}export`
export const LOOKUP_API_URL = `${COMPANY_URL}lookup`
export const UPDATE_API_URL = `${CRUD_API_URL}/update`
