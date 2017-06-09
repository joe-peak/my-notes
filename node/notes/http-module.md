> ### HTTP服务器
>
http.Server是http模块中的服务器对象。它提供了一套封装级别很低的 API，仅仅是流控制和简单的消息解析所有的高层功能都要通过它的接口来实现。
>
	const http=require('http');
	const port='3000';
	const hostname='localhost';

	let server=http.createServer((req,res)=>{
	  res.writeHead('200',{'Content-Type':'text/html'});
	  res.write('<h1>Node Js</h1>');
	  res.end('<p>Tourial starts here.</p>');
	});

	server.listen(port,hostname,()=>{
	  console.log(`server is running on http://${hostname}:${port}`);
	});
>
这段代码中， http.createServer 创建了一个 http.Server 的实例，将一个函数作为 HTTP 请求处理函数。这个函数接受两个参数，分别是请求对象（ req ）和响应对象（ res ）。在函数体内， res 显式地写回了响应代码 200 （表示请求成功），指定响应头为'Content-Type': 'text/html'，然后写入响应体 '&lt;h1&gt;Node.js&lt;/h1&gt;'，通过 res.end结束并发送。最后该实例还调用了 listen 函数，启动服务器并监听 3000 端口
>
> #### 1. http.Server 的事件
http.Server 是一个基于事件的 HTTP 服务器，所有的请求都被封装为独立的事件,它继承自EventEmitter，提供了以下几个事件
>
1. __*request*__ ：当客户端请求到来时，该事件被触发，提供两个参数 __*req*__ 和 __*res*__ ，分别是 __*http.ServerRequest*__ 和 __*http.ServerResponse*__ 的实例，表示请求和响应信息。
2. __*connection*__：当 TCP 连接建立时，该事件被触发，提供一个参数 __*socket*__ ，为net.Socket 的实例。 connection 事件的粒度要大于 request，因为客户端在Keep-Alive 模式下可能会在同一个连接内发送多次请求
3. __*close*__ ：当服务器关闭时，该事件被触发。注意不是在用户连接断开时。
>
在 这 些 事 件 中 ， 最 常 用 的 就 是 request 了 ， 因 此 http 提 供 了 一 个 捷 径 ：
http.createServer([requestListener]) ， 功 能 是 创 建 一 个 HTTP 服 务 器 并 将
requestListener 作为 request 事件的监听函数
>
> #### 2. http.ServerRequest
 __*http.ServerRequest*__ 是 HTTP 请求的实例,包含HTTP请求的相关信息,它一般由http.Server 的 request 事件发送，作为第一个参数传递，通常简称 request 或 req。
>
HTTP 请求一般可以分为两部分： 请求头（Request Header）和请求体（Requset Body）, http.ServerRequest 提供了以下3个事件用于控制请求体
传输:
>
1. __*data*__  ：当请求体数据到来时，该事件被触发。该事件提供一个参数 __*chunk*__，表示接
收到的数据。如果该事件没有被监听，那么请求体将会被抛弃。该事件可能会被调
用多次。
2. __*end*__ ：当 __*请求体数据传输完成时*__，该事件被触发，此后将不会再有数据到来。
3. __*close*__： 用户 *__当前请求结束*__ 时，该事件被触发。不同于 end，如果用户强制终止了
传输，也还是调用close。
>
名 称 | 含 义
---- | ---
complete  | 客户端请求是否已经发送完成
httpVersion |  HTTP 协议版本，通常是 1.0 或 1.1
method |  HTTP 请求方法，如 GET、 POST、 PUT、 DELETE 等
url |  原始的请求路径，例如 /static/image/x.jpg 或 /user?name=byvoid
headers |  HTTP 请求头
trailers |  HTTP 请求尾（不常见）
connection |  当前 HTTP 连接套接字，为 net.Socket 的实例
socket |  connection 属性的别名
client |  client 属性的别名
>
> #### 3. 获取 GET 请求内容
由于 GET 请求直接被嵌入在路径中，URL是完整的请求路径，包括了 ? 后面的部分，因此你可以手动解析后面的内容作为 GET请求的参数。 Node.js 的 url 模块中的 parse 函数提供了这个功能，例如：
>
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
通过 url.parse①，原始的 path 被解析为一个对象，其中 query 就是我们所谓的 GET请求的内容，而路径则是 pathname。
>
	 {
	  protocol: 'http:',
	  slashes: true,
	  auth: null,
	  host: 'localhost:3030',
	  port: '3030',
	  hostname: 'localhost',
	  hash: null,
	  search: '?name=byvoid&email=byvoid@byvoid.com',
	  query: { name: 'byvoid', email: 'byvoid@byvoid.com' },
	  pathname: '/user',
	  path: '/user?name=byvoid&email=byvoid@byvoid.com',
	  href: 'http://localhost:3030/user?name=byvoid&email=byvoid@byvoid.com' }
>
> ### 4. 获取 POST 请求内容
POST 请求的内容全部都在请求体中。 Node.js 默认是不会解析请求体的，当你需要的时候，需要手动来做。实现方法：
>
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
>
> ### 5. http.ServerResponse
 __*http.ServerResponse*__ 是返回给客户端的信息，决定了用户最终能看到的结果。它也是由 http.Server 的 *__request*__ 事件发送的，作为第二个参数传递，一般简称为response 或 res。
 http.ServerResponse 有三个重要的成员函数，用于 __*返回响应头*__、__*响应内容*__ 以及 __*结束请求*__
 1. response.writeHead(statusCode, [headers])：__*向请求的客户端发送响应头*__ 。
statusCode 是 HTTP 状态码，如 200 （请求成功）、 404 （未找到）等。 headers
是一个类似关联数组的对象，表示响应头的每个属性。该函数在一个请求内最多只
能调用一次，如果不调用，则会自动生成一个响应头
2. response.write(data, [encoding])：__*向请求的客户端发送响应内容*__ 。 data 是
一个 Buffer 或字符串，表示要发送的内容。如果 data 是字符串，那么需要指定
encoding 来说明它的编码方式，默认是 utf-8。在 response.end 调用之前，
response.write 可以被多次调用。
3. response.end([data], [encoding])：结束响应，告知客户端所有发送已经完
成。当所有要返回的内容发送完毕的时候，该函数 必须 被调用一次。它接受两个可
选参数，意义和 response.write 相同。如果不调用该函数，客户端将永远处于
等待状态。
>
> ## HTTP 客户端
http 模块提供了两个函数 __*http.request*__ 和 __*http.get*__，功能是*作为客户端向 HTTP
服务器发起请求*。
http.request(options, callback)发起 HTTP请求。接受两个参数， option 是
一个类似关联数组的对象，表示请求的参数， callback 是请求的回调函数。 __option__
常用的参数如下所示。
1. host ：请求网站的域名或 IP 地址。
2. port ：请求网站的端口，默认 80。
3. method ：请求方法，默认是 GET。
4. path ：请求的相对于根的路径，默认是“/”。 QueryString 应该包含在其中。
例如 /search?query=byvoid。
5. headers ：一个关联数组对象，为请求头的内容。
callback 传递一个参数，为 __*http.ClientResponse*__ 的实例。
 __http.request 返回一个 http.ClientRequest 的实例__
>
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

	let req = http.request(options, (res) => {
	  res.setEncoding('utf8');
	  res.on('data', (chunck) => {
	    console.log(chunck);
	  });
	});

	req.write(content);
	req.end();
>ps:不要忘了通过 req.end() 结束请求，否则服务器将不会收到信息。
>
http.get(options, callback) http 模块还提供了一个更加简便的方法用于处
理GET请求： http.get。它是 http.request 的简化版，唯一的区别在于http.get
自动将请求方法设为了 GET 请求，同时不需要手动调用 req.end()。
>
	const http = require('http');
	let req = http.get({
	  host:'www.byvoid.com'
	}, (res) => {
	  res.setEncoding('utf8');
	  res.on('data', (chunk) => {
	    console.log(chunk);
	  });
	});
>
> ### 1. http.ClientRequest
 __*http.ClientRequest*__ 是由 http.request 或 http.get 返回的对象，表示一
个已经产生而且正在进行中的 HTTP请求实例。它提供一个 __*response*__ 事件，即 http.request
或 http.get 第二个参数指定的回调函数的绑定对象。我们也可以显式地绑定这个事件的
监听函数：
>
	let reqCopy = http.get({ host: 'www.byvoid.com' });
	reqCopy.on('response', (res) => {
	  res.setEncoding('utf8');
	  res.on('data', (chunk) => {
	    console.log(chunk);
	  })
	});
http.ClientRequest 像 http.ServerResponse 一样也提供了 __*write*__ 和 __*end*__ 函
数，用于向服务器发送请求体,所有写结束以后必须调用 end函数以通知服务器，否则请求无效
1. request.abort()：终止正在发送的请求
2. request.setTimeout(timeout,callback):：设置请求超时时间， timeout 为毫秒数。当请求超时以后， callback 将会被调用
> ### 2. http.ClientResponse
http.ClientResponse 与 http.ServerRequest 相似，提供了三个事件 data、 end
和 close，分别在数据到达、传输结束和连接结束时触发，其中 data 事件传递一个参数
chunk，表示接收到的数据。
http.ClientResponse 还提供了以下几个特殊的函数。
1. response.setEncoding([encoding])：设置默认的编码，当 data 事件被触发
时，数据将会以 encoding 编码。默认值是 null，即不编码，以 Buffer 的形式存
储。常用编码为 utf8。
2. response.pause()：暂停接收数据和发送事件，方便实现下载功能。
3. response.resume()：从暂停的状态中恢复。