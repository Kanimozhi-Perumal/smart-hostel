import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* -------- EXPORT SUMMARY PDF -------- */
export const exportPDF = (summary) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Admin Summary Report", 14, 20);

  doc.setFontSize(11);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

  autoTable(doc, {
    startY: 40,
    head: [["Metric", "Value"]],
    body: [
      ["Total Students", summary.totalStudents],
      ["Total Parents", summary.totalParents],
      ["Total Outpasses", summary.totalOutpasses],
      ["Pending Requests", summary.pending],
      ["Approved Outpasses", summary.approved],
      ["Completed Outpasses", summary.completed],
      ["Today Exit", summary.todayExit || 0],
      ["Today Entry", summary.todayEntry || 0]
    ],
    theme: "grid"
  });

  doc.save("Admin_Summary_Report.pdf");
};

/* -------- EXPORT ALL REPORTS PDF -------- */
export const exportAllReportsPDF = (summary) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Admin – All Reports", 14, 20);

  autoTable(doc, {
    startY: 30,
    head: [["Overview", "Count"]],
    body: [
      ["Students", summary.totalStudents],
      ["Parents", summary.totalParents],
      ["Outpasses", summary.totalOutpasses]
    ]
  });

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    head: [["Outpass Status", "Count"]],
    body: [
      ["Pending", summary.pending],
      ["Approved", summary.approved],
      ["Completed", summary.completed]
    ]
  });

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    head: [["Today Movement", "Count"]],
    body: [
      ["Exit", summary.todayExit || 0],
      ["Entry", summary.todayEntry || 0]
    ]
  });

  doc.save("Admin_All_Reports.pdf");
};
