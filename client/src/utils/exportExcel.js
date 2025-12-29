import * as XLSX from "xlsx";

/* ---------- SINGLE SUMMARY ---------- */
export const exportExcel = (summary, fileName = "Admin_Summary") => {
  const worksheet = XLSX.utils.json_to_sheet([summary]);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Summary");
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

/* ---------- ALL REPORTS (MULTI SHEET) ---------- */
export const exportAllReportsExcel = (summary) => {
  const workbook = XLSX.utils.book_new();

  const overviewSheet = XLSX.utils.json_to_sheet([
    {
      Students: summary.totalStudents,
      Parents: summary.totalParents,
      Outpasses: summary.totalOutpasses
    }
  ]);

  const statusSheet = XLSX.utils.json_to_sheet([
    {
      Pending: summary.pending,
      Approved: summary.approved,
      Completed: summary.completed
    }
  ]);

  const todaySheet = XLSX.utils.json_to_sheet([
    {
      ExitToday: summary.todayExit || 0,
      EntryToday: summary.todayEntry || 0
    }
  ]);

  XLSX.utils.book_append_sheet(workbook, overviewSheet, "Overview");
  XLSX.utils.book_append_sheet(workbook, statusSheet, "Outpass Status");
  XLSX.utils.book_append_sheet(workbook, todaySheet, "Today");

  XLSX.writeFile(workbook, "Admin_All_Reports.xlsx");
};
