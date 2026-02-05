import * as XLSX from "xlsx";

interface ExportData {
  products: any[];
  packagingSizes: any[];
  shopName: string;
  categoryName: string;
  date: string;
  totals: Record<string, number>;
}

export const exportToExcel = ({
  products,
  packagingSizes,
  shopName,
  categoryName,
  date,
  totals,
}: ExportData) => {
  try {
    // Create workbook
    const wb = XLSX.utils.book_new();

    // Prepare data for main sheet
    const mainData = [
      // Header row
      ["Product Name", ...packagingSizes.map((size) => size.size)],
      // Data rows
      ...products.map((product) => [
        product.product_name,
        ...packagingSizes.map((size) => product[size.psid] || 0),
      ]),
      // Totals row
      ["TOTAL", ...packagingSizes.map((size) => totals[size.psid] || 0)],
    ];

    // Create main sheet
    const ws = XLSX.utils.aoa_to_sheet(mainData);

    // Set column widths
    const colWidths = [
      { wch: 40 }, // Product Name column width
      ...packagingSizes.map(() => ({ wch: 15 })), // Size columns width
    ];
    ws["!cols"] = colWidths;

    // Add sheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Closing Stock");

    // Create metadata sheet
    const metadata = [
      ["Report Information"],
      ["Shop:", shopName],
      ["Category:", categoryName],
      ["Date:", date],
      ["Total Products:", products.length],
      ["Generated On:", new Date().toLocaleString()],
      [""],
      ["Size Information"],
      ...packagingSizes.map((size) => [size.size, size.size_title]),
    ];

    const metadataWs = XLSX.utils.aoa_to_sheet(metadata);
    const metadataColWidths = [{ wch: 30 }, { wch: 30 }];
    metadataWs["!cols"] = metadataColWidths;
    XLSX.utils.book_append_sheet(wb, metadataWs, "Report Info");

    // Generate filename
    const fileName = `Closing_Stock_${shopName.replace(/\s+/g, "_")}_${categoryName}_${date}.xlsx`;

    // Save the workbook
    XLSX.writeFile(wb, fileName);

    return true;
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    return false;
  }
};
