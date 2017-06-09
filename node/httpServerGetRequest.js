const http = require('http');
const util = require('util');
const url = require('url');
const port = '3030';
const hostname = 'localhost';
server = new http.Server();
server.on('request', (req, res) => {
  let parseUrl = url.parse(req.url, true);
  res.writeHead('200', { 'Content-Type': 'text/html' });
  res.write('<h1>Node Js</h1>');
  res.end(`<p>url: ${util.inspect(parseUrl, true, null, true)}</p>`);
});
server.listen(port, hostname, () => {
  console.log(`Server in running on the http://${hostname}:${port}`);
});