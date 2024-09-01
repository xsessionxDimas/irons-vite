const SITE_URL = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_UTILITY}/api/master_site`
export const CRUD_API_URL = `${SITE_URL}/site`
export const BULK_API_URL = `${SITE_URL}/site_bulk`
export const UPLOAD_API_URL = `${SITE_URL}/validate_upload`
export const EXPORT_API_URL = `${SITE_URL}/export`
export const LOOKUP_API_URL = `${SITE_URL}/lookup`
export const UPDATE_API_URL = `${CRUD_API_URL}/update`
export const IRONLAKE_CRUD_API_URL = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_IRONLAKE_MASTER}/api/ironlake/site`
