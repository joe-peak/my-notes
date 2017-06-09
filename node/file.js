const fs = require('fs');
let open = new Promise((resolve, reject) => {
  fs.open('./content.txt', 'r', ((err, fd) => {
    if (err) {
      console.error(err);
      reject(err);
      retrun;
    }
    resolve(fd);
  }))
});

open.then(res => {
  let buf = new Buffer(40);
  fs.read(res, buf, 0, 40, null, (err, bytesRead, buffer) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`bytesRead:${bytesRead}`);
    console.log(`buffer:${buffer}`);
  });
}).catch((err => {
  cosnole.error(err);
}));