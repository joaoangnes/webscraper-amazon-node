const pup = require('puppeteer');
const { generateExcelReport, printReport } = require("./report.js");

const url = "https://www.amazon.com.br/";

let count = 1;
const productList = [];

// Function to evaluate each product
async function evaluateProduct(page, querySelectorInformation) {
  // If the querySelector doesn't find anything, return null
  const product = await page.evaluate((querySelectorInfo) => {
    const element = document.querySelector(querySelectorInfo);
    if (!element) return null;
    return element.innerText;
  }, querySelectorInformation);

  return product;
}

async function scrapePage(searchFor, numProductsToScrape) {
  // Call the puppeteer browser
  const browser = await pup.launch({headless: "new"});
  const page = await browser.newPage();

  const delay = (milliseconds) =>
    new Promise((resolve) => setTimeout(resolve, milliseconds));

  console.log(`start the scrapping`);

  // Set screen size
  await page.setViewport({width: 1080, height: 1024});

  // Go to the main page
  await page.goto(url);
  console.log(`actively scraping: ${url}`);

  // Wait for the component load
  await page.waitForSelector("#twotabsearchtextbox"); // ID Input Search Bar

  // Write in the search bar in amazon site
  await page.type("#twotabsearchtextbox", searchFor);

  // Promise to navigate to a next page
  await Promise.all([
    page.waitForNavigation(), 
    await page.click("#nav-search-submit-button")  // Click in the search button
  ]);
  
  try{
    // Get all the products links of the current page
    const links = await page.$$eval(".rush-component > a", e1 => e1.map(link => link.href));
    // Go through all the links
    for (const link of links) {
      if (count === numProductsToScrape){ break }
      console.log("Product: "+count);
      await page.goto(link);
      await page.waitForSelector("#productTitle")
      // Get the product information from the product page
      const productTitle = await page.$eval("#productTitle", element => element.innerText)
      let productBrand = await evaluateProduct(page, ".a-section.a-spacing-none #bylineInfo")
      if (productBrand) { productBrand = productBrand.replace('Marca:', '').trim() }
      const productPrice = await evaluateProduct(page, ".a-offscreen")
      const productDiscount = await evaluateProduct(page, ".a-size-large.a-color-price.savingPriceOverride.aok-align-center.reinventPriceSavingsPercentageMargin.savingsPercentage")
      // Create a object of the product and push it into the list of products
      const productObject = {productTitle, productBrand, productPrice, productDiscount, link}
      productList.push(productObject)
      count++
    }
    await page.close();

    // Generate the Excel report
    await generateExcelReport(productList);
    // Print the list of the products
    await printReport(productList);
    return productList // Return the product list
  } catch(error){
    console.error("Error in scraping the page:", error);
    await browser.close();
    process.exit(1);
  }
}

module.exports = {
  scrapePage,
};
