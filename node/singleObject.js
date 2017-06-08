function Hello()
{
  let name='';
  this.setName=function(param)
  {
    name=param;
  };

  this.sayHello=function()
  {
    console.log(`Hello ${name}`);
  }
}

class Greeting
{
  constructor(){
    this.name='';
  }

  setName(name){
    this.name=name;
  }

  sayHello()
  {
    console.log(`Welcome,${this.name}`);
  }
}

/**
 * 不覆盖exports
 */
//module.exports.Hello=Hello;


/**
 * 覆盖exports
 */
//module.exports=Hello;
module.exports=Greeting;