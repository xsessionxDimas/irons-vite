export type SyncMessage = {
   id?: number
   module: string,
   section: string,
   type: string,
   workorder: string,
   key: string | undefined,
   payload: string,
   syncDate: string,
   errorMessage?: string
   itemKey?: string
   syncStatus?: string,
}
