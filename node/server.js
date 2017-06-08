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