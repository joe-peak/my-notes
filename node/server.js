const http = require('http');
const port = '3000';
const hostname = 'localhost';

/*let server = http.createServer((req, res) => {
  res.writeHead('200', { 'Content-Type': 'text/html' });
  res.write('<h1>Node Js</h1>');
  res.end('<p>Tourial starts here.</p>');
});

server.listen(port, hostname, () => {
  console.log(`server is running on http://${hostname}:${port}`);
});*/

/**
 * 创建http服务器实例
 */
let serverCopy = new http.Server();
/**
 * 监听request事件
 */
serverCopy.on('request', (req, res) => {
  res.writeHead('200', { 'Content-Type': 'text/html' });
  res.write('<h1>Node Js Copy</h1>');
  res.end('<p>Hello Node</p>');
}).listen(port, hostname, () => {
  console.log(`server is running on http://${hostname}:${port}`);
});