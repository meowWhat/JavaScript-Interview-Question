// 思路：将要改变this指向的方法挂到目标this上执行并返回

;(Function.prototype as any).myCall = function(context) {
  //类型检测
  if (typeof this !== 'function') {
    throw TypeError('not a function')
  }
  //初始化context
  context = context || window
  //将调用的函数挂载到传入的context中
  context.fn = this
  //初始化参数
  let arg = Array.from(arguments).slice(1)
  //执行fn函数 拿到他的返回值
  let result = context.fn(...arg)
  //释放内存
  delete context.fn
  //返回result
  return result
}
// //代码测试
// let fn = function(a) {
//   console.log(this.name + a)
// }

// let obj = {
//   name: 'test'
// }
// ;(fn as any).myCall(obj, '-success!!')
