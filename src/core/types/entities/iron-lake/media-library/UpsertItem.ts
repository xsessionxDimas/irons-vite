export type UpsertItem = {
  Code: string;
  Description: string;
  FileType: string;
  Files?: File | null;
  AttachmentId: number;
  IsActive: boolean;
};
