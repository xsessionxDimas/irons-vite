type EmbedReport = {
  reportId: string,
  reportName: string,
  embedUrl: string,
}

type EmbedToken = {
  token: string | null,
  tokenId: string | null,
  expiration: string,
}

export type PbiConfig = {
  type: string | null,
  embedReport: Array<EmbedReport>,
  embedToken: EmbedToken,
};
