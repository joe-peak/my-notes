const EventEmitter=require('events').EventEmitter;
const event=new EventEmitter();

event.on('someEvent',(data)=>{
    console.log(data.name,'I listened an event.');
});

setTimeout(()=>{
  event.emit('someEvent',{name:'Joe'});
},1000);

/**
 * 移除指定类型的事件及其对应的监听器,回调韩寒诉必须是已经注册过的listener
 */
event.removeListener('someEvent',()=>{

});

/**
 * 移除指定事件类型的所有监听器,若没有提供参数，则会移除所有的事件监听器
 */
event.removeAllListeners('someEvent');