import xlsx from 'xlsx';

export * from 'xlsx';

export function createSimpleWorkbookAOA(aoa, sheetName = 'Export') {
  const workbook = xlsx.utils.book_new();
  const sheet = xlsx.utils.aoa_to_sheet(aoa);
  xlsx.utils.book_append_sheet(workbook, sheet, sheetName);
  return xlsx.write(workbook, { type: 'buffer' });
}
