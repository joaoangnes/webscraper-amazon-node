const { scrapePage } = require("./scraper.js");

async function main() {
  // Not support more than one website
  if (process.argv.length > 2) {
    console.log("too many command line arguments");
    process.exit(1);
  }
  // Constante for search
  const searchFor = "teclado mecanico";
  const numProductsToScrape = 10;

  try {
    // Run the scrape script
    const listProducts = await scrapePage(searchFor, numProductsToScrape);
    console.log(`finished the scrape`);

    // Verify if the list of products is not empty
    if (listProducts.length === 0) {
      console.log('No products were found.');
      process.exit(1);
    }
    process.exit(0);
  } catch (error) {
    console.error('Error in scraping the page:', error);
    process.exit(1);
  }
}

main();
