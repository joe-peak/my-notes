> ## 独立构建 vs 运行时构建
独立构建:需要编译器编译，组件可以使用template选项，不兼容内容安全策略
运行时构建：单独的组件不能使用template选项,只能使用render选项,但是在单文件组件中可以使用template选项，因为单文件组件在构建时最终会被预编译为render函数兼容内容安全策略
>
> ## 命令行工具
>
	npm install -global vue-cli
	vue init webpack project-name

	cd project-name
	npm install
	npm run dev
>
> ## 实例
可以扩展 Vue 构造器，从而用预定义选项创建可复用的组件构造器：
>
	let MyComponent = Vue.extends({
		 // 扩展选项
		});

	// 所有的 `MyComponent` 实例都将以预定义的扩展选项被创建
	let myComponentInstance =new MyComponent();

	尽管可以命令式地创建扩展实例，不过在多数情况下建议将组件构造器注册为一个自定义元素，然后声明式地用在模板中
>
如果在 __*实例创建之后*__ 添加新的属性到实例上，它不会触发视图更新
 Vue 实例暴露了一些有用的实例属性与方法。这些属性与方法都有前缀 __* $*__，以便与代理的属性区分。
 >
 	var data = { a: 1 }
	var vm = new Vue({
	  el: '#example',
	  data: data
	})
	vm.$data === data // -> true
	vm.$el === document.getElementById('example') // -> true
	// $watch 是一个实例方法
	vm.$watch('a', function (newVal, oldVal) {
	  // 这个回调将在 `vm.a`  改变后调用
	})
>
>
	注意，不要在实例属性或者回调函数中（如 vm.$watch('a', newVal => this.myMethod())）使用箭头函数。因为箭头函数绑定父上下文，所以 this 不会像预想的一样是 Vue 实例，而是 this.myMethod 未被定义。
通过使用 __*v-once*__  指令，你也能执行一次性地插值，当数据改变时，插值处的内容不会更新。但请留心这会影响到该节点上所有的数据绑定
>
Mustache 不能在 HTML 属性中使用，应使用 v-bind 指令：
>
	<div :id="dynamicId"></div>
>
	模板表达式都被放在沙盒中，只能访问全局变量的一个白名单，如 Math 和 Date 。你不应该在模板表达式中试图访问 __*用户定义的全局变量*__。
>
> ## 修饰符
修饰符（Modifiers）是以半角句号 . 指明的特殊后缀，用于指出一个指令应该以特殊方式绑定。例如，.prevent 修饰符告诉 v-on 指令对于触发的事件调用 event.preventDefault()：
>
	<form v-on:submit.prevent="onSubmit"></form>
>
> ## 计算缓存 vs Methods
 __*计算属性是基于它们的依赖进行缓存的*__ 。 计算属性只有在它的 __*相关依赖*__ 发生改变时才会重新求值。这就意味着只要依赖message 还没有发生改变，多次访问 reversedMessage 计算属性会立即返回之前的计算结果，而 __*不必再次执行函数*__ 。相比而言，只要发生重新渲染，method 调用总会执行该函数。
我们为什么需要缓存？假设我们有一个性能开销比较大的的计算属性 A ，它需要遍历一个极大的数组和做大量的计算。然后我们可能有其他的计算属性依赖于 A 。如果没有缓存，我们将不可避免的多次执行 A 的 getter！如果你不希望有缓存，请用 method 替代
>
> ## 计算 setter
计算属性默认只有 getter ，不过在需要时你也可以提供一个 setter ：
>
	//...
	computed:{
		'fillName':{
			//getter
			get()
			{
				return this.firstName + ' ' + this.lastName
			},
			//setter
			set(newValue)
			{
				var names = newValue.split(' ')
			    this.firstName = names[0]
			    this.lastName = names[names.length - 1]
			}
		}
	}
	// ...
>
现在在运行 vm.fullName = 'John Doe' 时， setter 会被调用， vm.firstName 和 vm.lastName 也相应地会被更新。
>
> ## class
可以在对象中传入更多属性用来动态切换多个 class 。此外， v-bind:class 指令可以与普通的 class 属性共存。如
>
	<div class="static"
     v-bind:class="{ active: isActive, 'text-danger': hasError }">
	</div>
	
当你在一个定制的组件上用到 class 属性的时候，这些类将被添加到 __*根元素*__ 上面，这个元素上已经存在的类不会被覆盖。

> ## 绑定内联样式
>
对象语法
对象语法十分直观——看着非常像 CSS ，其实它是一个 JavaScript 对象。 CSS 属性名可以用驼峰式（camelCase）或短横分隔命名（kebab-case）：
>
	<div v-bind:style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
>
	data: {
	  activeColor: 'red',
	  fontSize: 30
	}
>
直接绑定到一个样式对象通常更好，让模板更清晰：
>
	<div v-bind:style="styleObject"></div>
>
	data: {
	  styleObject: {
	    color: 'red',
	    fontSize: '13px'
	  }
	}
>
> ## 数组语法
v-bind:style 的数组语法可以将 __*多个样式对象*__ 应用到一个元素上：
>
	<div v-bind:style="[baseStyles, overridingStyles]">
>ps:当 v-bind:style 使用需要特定前缀的 CSS 属性时，如 transform ，Vue.js 会自动侦测并添加相应的前缀。
>
> ## 多重值
>
从 2.3 开始你可以为 style 绑定中的属性提供一个包含多个值的数组，常用于提供多个带前缀的值：
>
	<div :style="{ display: ["-webkit-box", "-ms-flexbox", "flex"] }">

> ## 条件渲染之用 key 管理可复用的元素
Vue 会尽可能高效地渲染元素，通常会复用已有元素而不是从头开始渲染。这么做，除了使 Vue 变得非常快之外，还有一些有用的好处。例如，如果你允许用户在不同的登录方式之间切换:
>
	<template v-if="loginType === 'username'">
	  <label>Username</label>
	  <input placeholder="Enter your username">
	</template>
	<template v-else>
	  <label>Email</label>
	  <input placeholder="Enter your email address">
	</template>
那么在上面的代码中切换 loginType 将不会清除用户已经输入的内容。因为两个模版使用了相同的元素，<input> 不会被替换掉——仅仅是替换了它的的 placeholder。
这样也不总是符合实际需求，所以 Vue 为你提供了一种方式来声明“这两个元素是完全独立的——不要复用它们”。只需添加一个具有唯一值的 key 属性即可：
>
	<template v-if="loginType === 'username'">
	  <label>Username</label>
	  <input placeholder="Enter your username" key="username-input">
	</template>
	<template v-else>
	  <label>Email</label>
	  <input placeholder="Enter your email address" key="email-input">
	</template>
> __*注意, 以上<label> 元素仍然会被高效地复用，因为它们没有添加 key 属性。*__
> __*注意， v-show 不支持 <template> 语法，也不支持 v-else。*__
v-if 是“真正的”条件渲染，因为它会确保在切换过程中条件块内的事件监听器和子组件适当地被 __*销毁和重建*__。
v-if 也是 __*惰性*__ 的：如果在初始渲染时条件为假，则什么也不做——直到条件第一次变为真时，才会开始渲染条件块。
相比之下， v-show 就简单得多——不管初始条件是什么，元素总是会被渲染，并且只是简单地基于 CSS 进行切换。
一般来说， v-if 有更高的切换开销，而 v-show 有更高的初始渲染开销。因此，如果需要非常频繁地切换，则使用 v-show 较好；如果在运行时条件不太可能改变，则使用 v-if 较好。
>当 v-if 与 v-for 一起使用时，v-for 具有比 v-if 更高的优先级。

> ##列表渲染
在 v-for 块中，我们 __*拥有对父作用域属性的完全访问权限*__。v-for 还支持一个可选的第二个参数为当前项的索引
>
	<ul id="example-2">
	  <li v-for="(item, index) in items">
	    {{ parentMessage }} - {{ index }} - {{ item.message }}
	  </li>
	</ul>
>可以用 of 替代 in 作为分隔符，因为它是最接近 JavaScript 迭代器的语法
>
	(item, index) of items
> ## 对象迭代 v-for
>
	<ul id="repeat-object" class="demo">
	  <li v-for="value in object">
	    {{ value }}
	  </li>
	</ul>
	new Vue({
	  el: '#repeat-object',
	  data: {
	    object: {
	      FirstName: 'John',
	      LastName: 'Doe',
	      Age: 30
	    }
	  }
	})
	
可以提供第二个的参数为 __*键名*__ ：
>
	<div v-for="(value, key) in object">
	  {{ key }} : {{ value }}
	</div>
第三个参数为 __*索引*__：
>
	<div v-for="(value, key, index) in object">
	  {{ index }}. {{ key }} : {{ value }}
	</div>
> __*在遍历对象时，是按 Object.keys() 的结果遍历，但是不能保证它的结果在不同的 JavaScript 引擎下是一致的。*__
>
> ## 注意事项
由于 JavaScript 的限制， Vue 不能检测以下变动的数组：
1.当你利用索引直接设置一个项时，例如： vm.items[indexOfItem] = newValue
2.当你修改数组的长度时，例如： vm.items.length = newLength
为了解决第一类问题，以下两种方式都可以实现和 vm.items[indexOfItem] = newValue 相同的效果， 同时也将触发状态更新：
>
	// Vue.set
	Vue.set(example1.items, indexOfItem, newValue)
>
	// Array.prototype.splice`
	example1.items.splice(indexOfItem, 1, newValue)
为了解决第二类问题，你也同样可以使用 splice：
>
	example1.items.splice(newLength)
>
> ## 事件处理器
有时也需要在内联语句处理器中访问原生 DOM 事件。可以用特殊变量 __*$event*__ 把它传入方法：
>
	<button v-on:click="warn('Form cannot be submitted yet.', $event)">Submit</button>
>
	// ...
	methods: {
	  warn: function (message, event) {
	    // 现在我们可以访问原生事件对象
	    if (event) event.preventDefault()
	    alert(message)
	  }
	}
>
>self事件修饰符
	<!-- 只当事件在该元素本身（而不是子元素）触发时触发回调 -->
	<div v-on:click.self="doThat">...</div>

> ## 表单控件
复选框
单个勾选框，__*逻辑值*__：
>
	<input type="checkbox" id="checkbox" v-model="checked">
	<label for="checkbox">{{ checked }}</label>