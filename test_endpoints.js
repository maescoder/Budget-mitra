const http = require('http');

const urls = [
  'http://localhost:5000/api/get-product?productId=apple-iphone-15-128gb-black',
  'http://localhost:5000/api/search-products?productId=apple-iphone-15-128gb-black',
  'http://localhost:5000/api/get-history?productId=apple-iphone-15-128gb-black',
  'http://localhost:5000/api/get-recommendation?productId=apple-iphone-15-128gb-black'
];

urls.forEach(url => {
  http.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => console.log(url, res.statusCode, data.substring(0, 50)));
  }).on('error', (err) => {
    console.log("Error:", url, err.message);
  });
});
