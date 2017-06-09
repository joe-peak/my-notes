const http = require('http');
const querystring = require('querystring');
const util = require('util');

http.createServer((req, res) => {
  let data = '';
  /**
   * 开始接收到消息体(数据)
   */
  req.on('data', (chunk) => {
    data += chunk;
  });

  /**
   * 消息体(数据)接收完成
   */
  req.on('end', () => {
    res.end(util.inspect(querystring.parse(data)))
  });

}).listen('8080');