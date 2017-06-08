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
 Vue 实例暴露了一些有用的实例属性与方法。这些属性与方法都有前缀 __*$*__ ，以便与代理的属性区分。
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
	模板表达式都被放在沙盒中，只能访问全局变量的一个白名单，如 Math 和 Date 。你不应该在模板表达式中试图访问用户定义的全局变量。
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

> ## 列表渲染
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
多个勾选框，绑定到同一个数组：
>
	<input type="checkbox" id="jack" value="Jack" v-model="checkedNames">
	<label for="jack">Jack</label>
	<input type="checkbox" id="john" value="John" v-model="checkedNames">
	<label for="john">John</label>
	<input type="checkbox" id="mike" value="Mike" v-model="checkedNames">
	<label for="mike">Mike</label>
	<br>
	<span>Checked names: {{ checkedNames }}</span>
>
	new Vue({
	  el: '...',
	  data: {
	    checkedNames: []
	  }
	})
	//选中的复选框的value值会添加到绑定的数组里面，取消选择则会移除对应的value
单选按钮
v-model的值是选中的按钮的value值
单选择列表
v-model指令绑定在select元素上，其值为选中的option的value值
多选列表
v-model值未一个数组，包含选中的option的value值。

> ## 绑定 value
复选框
>
	<input
	  type="checkbox"
	  v-model="toggle"
	  :true-value="a"
	  :false-value="b"
	>
>
	// 当选中时
	vm.toggle === vm.a
	// 当没有选中时
	vm.toggle === vm.b
单选按钮
>
	input type="radio" v-model="pick" v-bind:value="a">
	// 当选中时
	vm.pick === vm.a
选择列表设置
>
	<select v-model="selected">
	    <!-- 内联对象字面量 -->
	  <option v-bind:value="{ number: 123 }">123</option>
	</select>
>
	// 当选中时
	typeof vm.selected // -> 'object'
	vm.selected.number // -> 123
> ### 修饰符
.lazy ,.number ,.trim

>
> ## 组件
1.全局注册
>
	Vue.component('component-name', {
	  // 选项
	})
ps:要确保在初始化父组件实例 之前 注册了组件
2.局部注册
通过使用组件实例选项注册，可以使组件仅在另一个实例/组件的作用域中可用：
>
	var Child = {
	  template: '<div>A custom component!</div>'
	}
	new Vue({
	  // ...
	  components: {
	    // <my-component> 将只在父模板可用
	    'my-component': Child
	  }
	})

	这种封装也适用于其它可注册的 Vue 功能，如指令。

特殊的 __*is*__ 属性
>
	<table>
  		<my-row>...</my-row>
	</table>
	//自定义组件以上用法无效，应该使用下面的变通使用方法
	<table>
	  <tr is="my-row"></tr>
	</table>
如果您使用来自以下来源之一的字符串模板，这些限制将不适用：
-<script type="text/x-template">
-JavaScript内联模版字符串
-.vue 组件
ps:组件中的data选项必须是一个函数

*注意在 JavaScript 中对象和数组是引用类型，指向同一个内存空间，如果 prop 是一个对象或数组，在子组件内部改变它会影响父组件的状态。*
props验证
>
	Vue.component('example', {
	  props: {
	    // 基础类型检测 （`null` 意思是任何类型都可以）
	    propA: Number,
	    // 多种类型
	    propB: [String, Number],
	    // 必传且是字符串
	    propC: {
	      type: String,
	      required: true
	    },
	    // 数字，有默认值
	    propD: {
	      type: Number,
	      default: 100
	    },
	    // 数组／对象的默认值应当由一个工厂函数返回
	    propE: {
	      type: Object,
	      default: function () {
	        return { message: 'hello' }
	      }
	    },
	    // 自定义验证函数
	    propF: {
	      validator: function (value) {
	        return value > 10
	      }
	    }
	  }
	})

> ## slot分发内容
  编译作用域
分发内容是在父作用域内编译。
>单个 Slot
除非子组件模板包含至少一个 *<slot>* 插口，否则父组件的内容将会被 *丢弃* 。当子组件模板只有一个没有属性的 slot 时，父组件整个内容片段将插入到 slot 所在的 DOM 位置，并替换掉 slot 标签本身。
最初在 <slot> 标签中的任何内容都被视为备用内容。备用内容在子组件的作用域内编译，并且只有在宿主元素为空，且没有要插入的内容时才显示备用内容。
假定 my-component 组件有下面模板：
>
	<div>
	  <h2>我是子组件的标题</h2>
	  <slot>
	    只有在没有要分发的内容时才会显示。
	  </slot>
	</div>
父组件模版
>
	<div>
	  <h1>我是父组件的标题</h1>
	  <my-component>
	    <p>这是一些初始内容</p>
	    <p>这是更多的初始内容</p>
	  </my-component>
	</div>
渲染结果
>
	<div>
	  <h1>我是父组件的标题</h1>
	  <div>
	    <h2>我是子组件的标题</h2>
	    <p>这是一些初始内容</p>
	    <p>这是更多的初始内容</p>
	  </div>
	</div>
具名 Slot
<slot> 元素可以用一个特殊的属性 __*name*__ 来配置如何分发内容。多个 slot 可以有不同的名字。 __*具名 slot 将匹配内容片段中有对应 slot 特性的元素*__。
仍然可以有一个匿名 slot ，它是默认 slot ，作为找不到匹配的内容片段的备用插槽。如果没有默认的 slot ，这些找不到匹配的内容片段将被抛弃。
例如，假定我们有一个 app-layout 组件，它的模板为：
>
	<div class="container">
	  <header>
	    <slot name="header"></slot>
	  </header>
	  <main>
	    <slot></slot>
	  </main>
	  <footer>
	    <slot name="footer"></slot>
	  </footer>
	</div>
父组件模版:
>
	<app-layout>
	  <h1 slot="header">这里可能是一个页面标题</h1>
	  <p slot="footer">这里有一些联系信息</p>
	  <p>主要内容的一个段落。</p>
	  <p>另一个主要段落。</p>
	</app-layout>
渲染结果为：
>
	<div class="container">
	  <header>
	    <h1>这里可能是一个页面标题</h1>
	  </header>
	  <main>
	    <p>主要内容的一个段落。</p>
	    <p>另一个主要段落。</p>
	  </main>
	  <footer>
	    <p>这里有一些联系信息</p>
	  </footer>
	</div>
>作用域插槽
在子组件中，只需将数据传递到插槽，就像你将 prop 传递给组件一样：
>
	<div class="child">
	  <slot text="hello from child"></slot>
	</div>
在父级中，具有特殊属性 __*scope*__ 的 <template> 元素，表示它是作用域插槽的模板。scope 的值对应一个临时变量名，此变量接收从子组件中传递的 prop 对象：
	<div class="parent">
	  <child>
	    <template scope="props">
	      <span>hello from parent</span>
	      <span>{{ props.text }}</span>
	    </template>
	  </child>
	</div>
如果我们渲染以上结果，得到的输出会是：
>
	<div class="parent">
	  <div class="child">
	    <span>hello from parent</span>
	    <span>hello from child</span>
	  </div>
	</div>
作用域插槽更具代表性的用例是列表组件，允许组件自定义应该如何渲染列表每一项：
>
	<my-awesome-list :items="items">
	  <!-- 作用域插槽也可以是具名的 -->
	  <template slot="item" scope="props">
	    <li class="my-fancy-item">{{ props.text }}</li>
	  </template>
	</my-awesome-list>
列表组件的模板：
>
	<ul>
	  <slot name="item"
	    v-for="item in items"
	    :text="item.text">
	    <!-- 这里写入备用内容 -->
	  </slot>
	</ul>
> ## 动态组件
通过使用保留的 <component> 元素，动态地绑定到它的 is 特性，我们让多个组件可以使用同一个挂载点，并动态切换：
>
	var vm = new Vue({
	  el: '#example',
	  data: {
	    currentView: 'home'
	  },
	  components: {
	    home: { /* ... */ },
	    posts: { /* ... */ },
	    archive: { /* ... */ }
	  }
	})

>
	<component v-bind:is="currentView">
	  <!-- 组件在 vm.currentview 变化时改变！ -->
	</component>