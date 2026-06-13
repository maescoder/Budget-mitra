const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const fallbackProducts = [];
const productsPath = path.join(__dirname, '../products_current.csv');

fs.createReadStream(productsPath)
  .pipe(csv())
  .on('data', (data) => fallbackProducts.push(data))
  .on('end', () => {
    console.log('Fallback products loaded:', fallbackProducts.length);
    if(fallbackProducts.length > 0) {
      console.log('Sample:', fallbackProducts[0]);
    }
  });
