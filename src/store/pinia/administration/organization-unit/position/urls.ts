export const BASE_API_URL = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_UTILITY}/api/master_position`
export const GETALL_API_URL = `${BASE_API_URL}/data`
export const CRUD_API_URL = `${BASE_API_URL}/position`
export const BULK_API_URL = `${BASE_API_URL}/position_bulk`
export const UPLOAD_API_URL = `${BASE_API_URL}/validate_upload`
export const EXPORT_API_URL = `${BASE_API_URL}/export`
export const EXPORT_TEMPLATE_API_URL = `${BASE_API_URL}/export_template`
export const LOOKUP_API_URL = `${BASE_API_URL}/lookup`
export const LOOKUP_DMA_API_URL = `${BASE_API_URL}/lookup_dma`
export const UPDATE_API_URL = `${CRUD_API_URL}/update`
export const LOOKUP_POSITION = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_IRONLAKE_MASTER}/api/ironlake/employee/lookup_position`
export const LOOKUP_LOCATION = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_IRONLAKE_MASTER}/api/ironlake/employee/lookup_site`
