const http = require('http');
let req = http.get({
  host: 'www.byvoid.com'
}, (res) => {
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(chunk);
  });
});

/**
 * http.ClientRequest
 */

let reqCopy = http.get({ host: 'www.byvoid.com' });
reqCopy.on('response', (res) => {
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(chunk);
  })
});