const fs=require('fs');
      /**
       * 异步读取文件
       */
      fs.readFile('server.js','UTF-8',(err,stata)=>{
        if(err)
        {
          console.log(err)
        }
        else{
          console.log(typeof stata);
        }
      });

      /**
       * 同步读取文件
       */
let fsSync=fs.readFileSync('server.js','UTF-8');
      console.log(fsSync);
      console.log('This is end.');

    