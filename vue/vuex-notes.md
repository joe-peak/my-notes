1.Vuex 的状态存储是***响应式***的。当 Vue 组件从 store 中读取状态的时候，若 store 中的状态发生变化，那么相应的组件也会相应地得到高效更新。

2.你不能直接改变 store 中的状态。改变 store 中的状态的唯一途径就是***显式地提交(commit) mutations***。这样使得我们可以方便地跟踪每一个状态的变化，从而让我们能够实现一些工具帮助我们更好地了解我们的应用。
>基本用法
>
	import Vue form 'vue'
	import Vuex form 'vuex'
	Vue.use(Vuex);
	export default new Vuex.Store({
		state...
		mutations...
		getter...
		actions...
	});

>每个应用将仅仅包含一个 store 实例
>Vuex 通过 ***store 选项***，提供了一种机制将状态从根组件『注入』到每一个子组件中（需调用 Vue.use(Vuex)）
>
> ## mapState 辅助函数
>
	// 在单独构建的版本中辅助函数为 Vuex.mapState
	import { mapState } from 'vuex'

	export default {
	  // ...
	  computed: ***mapState***({
	    // 箭头函数可使代码更简练
	    count: state => state.count,

	    // 传字符串参数 'count' 等同于 `state => state.count`
	    countAlias: 'count',

	    // 为了能够使用 `this` 获取局部状态，必须使用常规函数
	    countPlusLocalState (state) {
	      return state.count + this.localCount
	    }
	  })
	}
>
>当映射的计算属性的名称与 state 的子节点名称相同时，我们也可以给 mapState 传一个字符串数组。
>
>
	computed: mapState([
	  // 映射 this.count 为 store.state.count
	  'count'
	])
>
> ## 对象展开运算符
>mapState 函数返回的是一个对象。我们如何将它与局部计算属性混合使用呢？通常，我们需要使用一个工具函数将多个对象合并为一个，以使我们可以将最终对象传给 computed 属性
>
	computed: {
	  localComputed () { /* ... */ },
	  // 使用对象展开运算符将此对象混入到外部对象中
	  ...mapState({
	    // ...
	  })
	}	