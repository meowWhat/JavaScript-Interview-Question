// 思路：类似call，但返回的是函数
;(Function.prototype as any).myBind = function(context) {
  if (typeof this !== 'function') {
    throw TypeError('not a function')
  }
  context = context || window
  context.fn = this
  let arg = Array.from(arguments).slice(1)
  return function F() {
    if (this instanceof F) {
      return new context.fn(...arg, ...arguments)
    } else {
      return context.fn.apply(context, arg.concat(...arguments))
    }
  }
}
// //test
// function fn() {
//   console.log(this.age + arguments[0])
// }

// ;(fn as any).myBind({ age: 20 })(30)
