export const CRUD_API_URL = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_ADM}/api/master_data/daily_schedule`
export const BULK_API_URL = `${CRUD_API_URL}/bulk`
export const UPLOAD_API_URL = `${CRUD_API_URL}/validate_upload`
export const EXPORT_API_URL = `${CRUD_API_URL}/export`
export const LOOKUP_API_URL = `${CRUD_API_URL}/lookup`
export const LOOKUP_EQUIPMENT_NUMBER_API_URL = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_ADM}/api/master_data/equipment_number/lookup`
export const LOOKUP_PS_TYPE_API_URL = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_ADM}/api/master_data/daily_schedule/lookup_pstype`
export const LOOKUP_SHIFT_API_URL = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_ADM}/api/master_data/shift/lookup`
export const UPDATE_API_URL = `${CRUD_API_URL}/update`

export const IRONLAKE_ASSET = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/ironlake-asset`

// Daily Outstanding Service (DOS)
export const DOS_CRUD_API_URL = `${IRONLAKE_ASSET}/api/ironlake/daily_outstanding_service`
export const DOS_LOOKUP_STATUS = `${DOS_CRUD_API_URL}/lookup_status`
export const DOS_LOOKUP_EQUIPMENT = `${DOS_CRUD_API_URL}/lookup_equipment_number`
export const DOS_EXPORT_API_URL = `${DOS_CRUD_API_URL}/export`
export const DOS_UPSERT_API_URL = `${DOS_CRUD_API_URL}/upsert`

export const DELETE_API_URL = `${CRUD_API_URL}/update_isdeleted`

// Equipment
export const EQP_CRUD_API_URL = `${IRONLAKE_ASSET}/api/ironlake/equipment`
