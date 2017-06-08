const util=require('util');
class Base{
  constructor(name){
    this.name=name;
  }
   getName()
   {
     console.log(this.name);
   }

   Greeting()
   {
     console.log(`Nice to meet you ${this.name}`);
   }
}

class Sub{
  constructor(name)
  {
    this.name=name;
  }
}

/**
 * 让Sub类继承自Base类，ps:只会继承Base定义在原型上的属性或者方法，不会继承构造函数内定义的属性或者方法
 */
util.inherits(Sub,Base);
let sub=new Sub('Joe');
console.log(sub)
    sub.Greeting();
let inspect=util.inspect({'name':'Joe',info:{'age':24}},true,null,true);
console.log(inspect);

