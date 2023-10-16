const fs = require("fs");
const path = require('path');
const ExcelJS = require('exceljs');

async function printReport(listProducts){
  console.log('=========== START REPORT ============');
  listProducts.forEach((product, index) => {
    console.log(`Product #${index + 1}:`);
    console.log(`  Title: ${product.productTitle}`);
    console.log(`  Price: ${product.productPrice}`);
    console.log(`  Discount: ${product.productDiscount}`);
    console.log('-----------------------');
  });
  console.log('=========== END REPORT ==============');
}

async function generateExcelReport(products) {
  // Create a new workbook and add a worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Products');

  // Define the columns in your Excel sheet
  worksheet.columns = [
    { header: 'Title', key: 'productTitle', width: 30 },
    { header: 'Brand', key: 'productBrand', width: 15 },
    { header: 'Price', key: 'productPrice', width: 15 },
    { header: 'Discount', key: 'productDiscount', width: 15 },
    { header: 'Link', key: 'link', width: 50 },
  ];

  // Add the product data to the worksheet
  products.forEach(product => {
    worksheet.addRow(product);
  });

  // Define the output file path
  const outputPath = path.join(__dirname, 'product_report.xlsx');

  // Save the workbook to a file
  await workbook.xlsx.writeFile(outputPath);

  console.log(`Report saved to ${outputPath}`);
}

module.exports = {
  generateExcelReport,
  printReport,
};
