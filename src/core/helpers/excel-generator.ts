import XLSX from "xlsx";
import { saveAs } from "file-saver";

const sheetToBuffer = (s) => {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
  return buf;
};

export const extractToExcel = (dataSheet: string[][], name: string) => {
  const ws = XLSX.utils.aoa_to_sheet(dataSheet);
  ws["!cols"] = calculateColWidth(dataSheet);
  ws["!rows"] = calculateRowHeight(dataSheet.length);
  const filename = `${name}.xlsx`;
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, ws, name);

  const wbout = XLSX.write(wb, {
    bookType: "xlsx",
    type: "binary",
  });

  saveAs(
    new Blob([sheetToBuffer(wbout)], { type: "application/octet-stream" }),
    filename,
  );
};

export const handleDataToExcel = (
  filename: string,
  columns: Array<string>,
  dataParam,
) => {
  let dataSheet: string[][] = [];
  dataSheet.push(columns);
  let data: string[][] = [];
  data = dataParam.map((val) => {
    const dataPerRow: string[] = [];
    for (const key in val) {
      dataPerRow.push(val[key]);
    }
    return dataPerRow;
  });
  dataSheet = [...dataSheet, ...data];
  extractToExcel(dataSheet, filename); // Define ukuran column (?)
};

export const handleArrayToExcel = (filename: string, dataParam) => {
  extractToExcel(dataParam, filename);
};

export const handleArrayToMultipleSheetExcel = (
  filename: string,
  dataParam,
) => {
  const wb = XLSX.utils.book_new();
  dataParam.map((val) => {
    const ws = XLSX.utils.aoa_to_sheet(val.data);
    ws["!cols"] = calculateColWidth(val.data);
    ws["!rows"] = calculateRowHeight(val.data.length);

    XLSX.utils.book_append_sheet(wb, ws, val.name);
  });
  const wbout = XLSX.write(wb, {
    bookType: "xlsx",
    type: "binary",
  });
  saveAs(
    new Blob([sheetToBuffer(wbout)], { type: "application/octet-stream" }),
    `${filename}.xlsx`,
  );
};

const calculateColWidth = (dataSheet) => {
  const colWidth: Array<any> = [];
  const numberOfCols = dataSheet[0].length;

  for (let i = 0; i < numberOfCols; i++) {
    const tempMaxLength: Array<number> = [];

    for (const data of dataSheet) {
      tempMaxLength.push(data[i] != null ? data[i].length : 0);
    }

    colWidth.push({ wch: Math.max(...tempMaxLength) + 3 });
  }

  return colWidth;
};

const calculateRowHeight = (length) => {
  const heights: Array<any> = [];

  for (let i = 0; i < length; i++) {
    heights.push({ hpt: 20 });
  }

  return heights;
};
