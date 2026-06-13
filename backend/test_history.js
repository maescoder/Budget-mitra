const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const fallbackHistory = [];
const historyPath = path.join(__dirname, '../price_history_monthly.csv');

fs.createReadStream(historyPath)
  .pipe(csv())
  .on('data', (data) => fallbackHistory.push(data))
  .on('end', () => {
    console.log('Fallback history loaded:', fallbackHistory.length);
    const rows = fallbackHistory.filter(h => h.product_key === 'apple-iphone-15-128gb-black');
    console.log('History rows for iphone:', rows.length);
  });
