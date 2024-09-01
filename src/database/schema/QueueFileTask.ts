export type QueueFileTask = {
   id?: number,
   module: string,
   type: string,
   fileType: string,
   workorder: string,
   createdBy: string,
   email: string,
   key: string,
   filename: string,
   originalFilename: string,
   blob: Blob,
   errorMessage?: string
   syncDate: string,
   syncStatus: string,
}
