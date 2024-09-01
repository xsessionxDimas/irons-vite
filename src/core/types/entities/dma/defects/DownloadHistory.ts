import { Audit } from "@/core/types/intervention/Audit"

export type DownloadHistory = {
    downloadBy: Audit,
    downloadDate?: string,
  }
