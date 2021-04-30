export const createCsvBlob = (csvString: string): Blob =>
  new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csvString], {
    type: "text/csv",
  })
