const http = require('http');
const querystring = require('querystring');
let content = querystring.stringify({
  name: 'byvoid',
  email: 'byvoid@byvoid.com',
  address: 'Zijing 2#, Tsinghua University'
});

let options = {
  host: 'www.byvoid.com',
  path: '/application/node/post.php',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': content.length
  }
};

/*let req = http.request(options, (res) => {
  res.setEncoding('utf8');
  res.on('data', (chunck) => {
    console.log(chunck);
  });
});*/

let req = http.request(options);
req.on('response', (res) => {
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(chunk);
  })
});

req.write(content);
req.end();
