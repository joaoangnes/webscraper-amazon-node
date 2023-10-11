const { scrapePage } = require("./scraper.js");

async function main() {
  // Not support more than one website
  if (process.argv.length > 2) {
    console.log("too many command line arguments");
    process.exit(1);
  }
  // Constante for search
  const searchFor = "teclado mecanico";
  // Run the scrape script 
  const listProducts = await scrapePage(searchFor);
  console.log(`finished the scrape`)
  // Verify if the list of products is not empty
  if (!listProducts.length > 0) {
    console.log('error in get the list of products');
    process.exit(1)
  }
  // Finish the search with sucess code and show the list of products
  listProducts.forEach((product, index) => {
    console.log(`Product #${index + 1}:`);
    console.log(`  Title: ${product.productTitle}`);
    console.log(`  Price: ${product.productPrice}`);
    console.log(`  Discount: ${product.productDiscount}`);
    console.log('-----------------------');
  });
  process.exit(0);
}

main();
