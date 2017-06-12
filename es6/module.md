> ### export命令
export命令规定的是对外的接口，必须与模块内部的变量建立一一对应关系。
>
	// 报错
	export 1;

	// 报错
	var m = 1;
	export m;
上面两种写法都会报错，因为没有提供对外的接口。第一种写法直接输出1，第二种写法通过变量m，还是直接输出1。1只是一个值，不是接口。正确的写法是下面这样。
>
	// 写法一
	export var m = 1;

	// 写法二
	var m = 1;
	export {m};

	// 写法三
	var n = 1;
	export {n as m};
上面三种写法都是正确的，规定了对外的接口m。其他脚本可以通过这个接口，取到值1。它们的实质是，在接口名与模块内部变量之间，建立了一一对应的关系。同样的，function和class的输出，也必须遵守以上的写法
export语句输出的接口，与其对应的值是动态绑定关系，即通过该接口，可以取到模块内部实时的值。
>
	export var foo = 'bar';
	setTimeout(() => foo = 'baz', 500);
上面代码输出变量foo，值为bar，500毫秒之后变成baz。
这一点与 CommonJS 规范完全不同。CommonJS 模块输出的是值的缓存，不存在动态更新
>
> ### import命令
>
	// main.js
	import {firstName, lastName, year} from './profile';

	function setName(element) {
	  element.textContent = firstName + ' ' + lastName;
	}
import命令可以接受一对大括号，里面指定要从其他模块导入的变量名。大括号里面的变量名，必须与被导入模块对外接口的名称相同。

如果想为输入的变量重新取一个名字，import命令要使用as关键字，将输入的变量重命名。
>
	import { lastName as surname } from './profile';
>注意，import命令具有提升效果，会提升到整个模块的头部，首先执行。
	foo();

	import { foo } from 'my_module';
上面的代码不会报错，因为import的执行早于foo的调用。这种行为的本质是，import命令是编译阶段执行的，在代码运行之前。
>由于import是静态执行，所以不能使用表达式和变量，这些只有在运行时才能得到结果的语法结构。
>
	// 报错
	import { 'f' + 'oo' } from 'my_module';

	// 报错
	let module = 'my_module';
	import { foo } from module;

	// 报错
	if (x === 1) {
	  import { foo } from 'module1';
	} else {
	  import { foo } from 'module2';
	}
上面三种写法都会报错，因为它们用到了表达式、变量和if结构。在静态分析阶段，这些语法都是没法得到值的。
import语句会执行所加载的模块，因此可以有下面的写法。
>
	import 'lodash';
上面代码 __*仅仅执行lodash模块，但是不输入任何值*__。

> ### 模块整体加载
>注意，模块整体加载所在的那个对象（上例是circle），应该是可以静态分析的，所以不允许运行时改变。下面的写法都是不允许的。
	import * as circle from './circle';

	// 下面两行都是不允许的
	circle.foo = 'hello';
	circle.area = function () {};
>
> ### export default 命令
export default命令，为模块指定默认输出。其他模块加载该模块时，import命令可以为该匿名函数指定任意名字
>
	// export-default.js
	export default function () {
	  console.log('foo');
	}

	// import-default.js
	import customName from './export-default';
	customName(); // 'foo'
上面代码的import命令，可以用任意名称指向export-default.js输出的方法，这时就不需要知道原模块输出的函数名。需要注意的是，这时import命令后面，不使用大括号。
>export default命令用在非匿名函数前，也是可以的。
>
	// export-default.js
	export default function foo() {
	  console.log('foo');
	}

	// 或者写成

	function foo() {
	  console.log('foo');
	}

	export default foo;
上面代码中，foo函数的函数名foo，在模块外部是无效的。加载的时候，视同匿名函数加载。
export default命令用于指定模块的默认输出。显然，__*一个模块只能有一个默认输出，因此export default命令只能使用一次*__。所以，import命令后面才不用加大括号，因为只可能对应一个输出。
本质上，export default就是输出一个叫做default的变量或方法，然后系统允许你为它取任意名字。所以，下面的写法是有效的。
>
	// modules.js
	function add(x, y) {
	  return x * y;
	}
	export {add as default};
	// 等同于
	// export default add;

	// app.js
	import { default as xxx } from 'modules';
	// 等同于
	// import xxx from 'modules';
正是因为export default命令其实只是输出一个叫做default的变量，所以它后面不能跟变量声明语句。
因为export default本质是将该命令后面的值，赋给default变量以后再默认，所以直接将一个值写在export default之后。

	// 正确
	export default 42;

	// 报错
	export 42;
上面代码中，后一句报错是因为没有指定对外的接口，而前一句指定外对接口为default。