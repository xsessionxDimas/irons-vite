export type TaskReference = {
  workorder: string,
  filename: string,
  file: Blob,
  fileType: string, //image, pdf, exe, etc
  createdDate?: Date
}
