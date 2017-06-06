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

每个应用将仅仅包含一个 store 实例
Vuex 通过 ***store 选项***，提供了一种机制将状态从根组件『注入』到每一个子组件中（需调用 Vue.use(Vuex)）
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
当映射的计算属性的名称与 state 的子节点名称相同时，我们也可以给 mapState 传一个字符串数组。
>
>
	computed: mapState([
	  // 映射 this.count 为 store.state.count
	  'count'
	])
>
> ## 对象展开运算符
mapState 函数返回的是一个对象。我们如何将它与局部计算属性混合使用呢？通常，我们需要使用一个工具函数将多个对象合并为一个，以使我们可以将最终对象传给 computed 属性
>
	computed: {
	  localComputed () { /* ... */ },
	  // 使用对象展开运算符将此对象混入到外部对象中
	  ...mapState({
	    // ...
	  })
	}
>	
> ## Getters
Vuex 允许我们在 store 中定义『getters』（可以认为是 store 的计算属性）。Getters 接受 state 作为其第一个参数,Getters 也可以接受其他 getters 作为第二个参数
>
	getters: {
	  // ...
	  doneTodosCount: (state, getters) => {
	    return getters.doneTodos.length
	  }
	}
在任何组件中使用它：
>
	computed: {
	  doneTodosCount () {
	    return this.$store.getters.doneTodosCount
	  }
	}
> ## mapGetters 辅助函数
mapGetters 辅助函数仅仅是将 store 中的 getters 映射到局部计算属性,用法与mapState完全一致
> ## Mutations
更改 Vuex 的 store 中的状态的唯一方法是提交 mutation。Vuex 中的 mutations 非常类似于事件：每个 mutation 都有一个字符串的 事件类型 (type) 和 一个 回调函数 (handler)。这个回调函数就是我们实际进行状态更改的地方，并且它会接受 state 作为第一个参数：
>
	const store = new Vuex.Store({
	  state: {
	    count: 1
	  },
	  mutations: {
	    increment (state) {
	      // 变更状态
	      state.count++
	    }
	  }
	})

不能直接调用一个 mutation handler,这个选项更像是事件注册：“当触发一个类型为 increment 的 mutation 时，调用此函数。”要唤醒一个 mutation handler，你需要以相应的 type 调用 store.commit 方法
>
	store.commit('increment')
> ## 提交载荷（Payload）
可以向 store.commit 传入额外的参数，即 mutation 的 载荷（payload）：
>
	// ...
	mutations: {
	  increment (state, n) {
	    state.count += n
	  }
	}
	store.commit('increment', 10)
在大多数情况下，载荷应该是一个对象
>
	// ...
	mutations: {
	  increment (state, payload) {
	    state.count += payload.amount
	  }
	}
	store.commit('increment', {
	  amount: 10
	})
	
	//对象风格的提交方式，等价与上面的提交方式
	store.commit({
	  type: 'increment',
	  amount: 10
	})
Mutations 需遵守 Vue 的响应规则
Vuex 中的 mutation 也需要与使用 Vue 一样遵守一些注意事项：
1.最好提前在你的 store 中***初始化***好所有所需属性。
2.当需要在对象上添加新属性时，你应该
>
	使用 Vue.set(obj, 'newProp', 123), 或者 
以新对象替换老对象。例如，利用 stage-3 的对象展开运算符我们可以这样写：
>
	state.obj={...state.obj,'newProp': 123};
> ## 使用常量替代 Mutation 事件类型
>
	/ mutation-types.js
	export const SOME_MUTATION = 'SOME_MUTATION'
	// store.js
	import Vuex from 'vuex'
	import { SOME_MUTATION } from './mutation-types'

	const store = new Vuex.Store({
	  state: { ... },
	  mutations: {
	    // 我们可以使用 ES2015 风格的计算属性命名功能来使用一个常量作为函数名
	    ***[SOME_MUTATION]*** (state) {
	      // mutate state
	    }
	  }
	})
ps:注意Mutation 事件类型需要包含在[]当中，而且mutation必须是同步函数

> ## 在组件中提交 Mutations

你可以在组件中使用 this.$store.commit('xxx') 提交 mutation，或者使用 mapMutations 辅助函数将组件中的 methods 映射为 store.commit 调用（需要在根节点注入 store）。
>
	import { mapMutations } from 'vuex'

	export default {
	  // ...
	  methods: {
	    ...mapMutations([
	      'increment' // 映射 this.increment() 为 this.$store.commit('increment')
	    ]),
	    ...mapMutations({
	      add: 'increment' //映射 this.add() 为 this.$store.commit('increment')
	    })
	  }
	}