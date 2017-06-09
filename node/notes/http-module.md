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
1. __*request*__ ：当客户端请求到来时，该事件被触发，提供两个参数 req 和res，分别是 *__http.ServerRequest*__ 和 *__http.ServerResponse*__ 的实例，表示请求和响应信息。
2. __*connection*__：当 TCP 连接建立时，该事件被触发，提供一个参数 *__socket*__ ，为net.Socket 的实例。 connection 事件的粒度要大于 request，因为客户端在
Keep-Alive 模式下可能会在同一个连接内发送多次请求