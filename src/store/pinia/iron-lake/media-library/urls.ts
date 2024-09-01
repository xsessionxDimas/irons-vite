export const CRUD_API_URL = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_UTILITY}/api/master_attachment/attachments`
export const EXPORT_API_BY_ID_URL = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_UTILITY}/api/master_attachment/download_by_id`
export const EXPORT_API_BY_URL_URL = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_UTILITY}/api/master_attachment/download_by_url`
export const LOOKUP_API_URL = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_UTILITY}/api/master_attachment/lookup`
export const UPDATE_API_URL = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_UTILITY}/api/master_attachment/upload_attachment`

export const IRONLAKE_ASSET = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/ironlake-asset`

// Daily Outstanding Service (DOS)
export const DOS_CRUD_API_URL = `${IRONLAKE_ASSET}/api/ironlake/daily_outstanding_service`
export const DOS_LOOKUP_STATUS = `${DOS_CRUD_API_URL}/lookup_status`
export const DOS_UPSERT_API_URL = `${DOS_CRUD_API_URL}/upsert`
