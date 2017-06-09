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