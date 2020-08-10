## this 的指向

- **作为对象的方法调用**。
  - 当函数作为对象的方法被调用时，this 指向该对象

- **作为普通函数调用**。
  - this 总是指 向全局对象, 也就是window 对象。
  - 在 ECMAScript 5 的 strict 模式下，这种情况下的 this 已经被规定为不会指向全局对象，而 是 undefined：

- **构造器调用**。

  - 通常情况下，构造器里的 this 就指向返回的这个对象

  - 如果构造器**显式地返回了一个 object 类型的对象**，那么此次运算结果最终会返回这个对象，而不是我们之前期待的 this：

    ```js
    var MyClass = function(){
     this.name = 'sven';
     return { // 显式地返回一个对象
     name: 'anne'
     }
    };
    var obj = new MyClass();
    alert ( obj.name ); // 输出：anne 
    ```

    

- `Function.prototype.call `或 `Function.prototype.apply `调用

  - `call()` 方法接受的是**一个参数列表**:`(this, name, price)`
  - `apply()` 方法接受的是**一个包含多个参数的数组**:`(this,[5, 6, 2, 3])`
  - 动态地改变传入函数的 `this`

- ` Function.prototype.bind`

  - `bind()` 方法创建一个新的函数，在 `bind()` 被调用时，这个新函数的 `this` 被指定为 `bind()` 的第一个参数，而其余参数将作为新函数的参数，供调用时使用。

  - ```js
    // 简易版
    Function.prototype.bind = function( context ){
     var self = this; // 保存原函数
     return function(){ // 返回一个新的函数
     return self.apply( context, arguments ); // 执行新的函数的时候，会把之前传入的 context
     // 当作新函数体内的 this
     }
    };
    
    // 复杂些
    Function.prototype.bind = function(){
     var self = this, // 保存原函数
     context = [].shift.call( arguments ), // 需要绑定的 this 上下文
     args = [].slice.call( arguments ); // 剩余的参数转成数组
     return function(){ // 返回一个新的函数
     return self.apply( context, [].concat.call( args, [].slice.call( arguments ) ) );
     // 执行新的函数的时候，会把之前传入的 context 当作新函数体内的 this
     // 并且组合两次分别传入的参数，作为新函数的参数
     }
     }; 
    ```

    

