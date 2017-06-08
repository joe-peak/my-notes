//console.log(process.argv);
/**
 * process.stdout.write只能输出字符串，否则报错
 */
//process.stdout.write('test process.stdout.write');
process.stdout.write(JSON.stringify(process.argv));
/**
 * 恢复标准输入流
 */
process.stdin.resume();
/**
 * 监听流写入
 */
process.on('data',(data)=>{
  process.stdout.write(`Read from console ${data.toString()}`);
});

process.nextTick(()=>{

});
console.log(' ');
console.log(JSON.stringify(process.platform));
console.log(JSON.stringify(process.pid));
console.log(JSON.stringify(process.execPath));
console.log(process.memoryUsage())