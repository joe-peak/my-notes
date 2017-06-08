let name='';
let setName=(pram)=>{
   name=pram;
};

let sayHello=()=>{
  console.log(`Hello ${name}`);
};

module.exports={
  setName,
  sayHello
};