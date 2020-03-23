function myNew(fun: Function) {
  return function(...params: Array<unknown>) {
    // 创建一个新对象且将其隐式原型指向构造函数原型
    let obj = Object.create(fun.prototype)
    // 执行构造函数
    fun.call(obj, ...params)
    // 返回该对象
    return obj
  }
}
//test
// class Person {
//   [key: string]: string | (() => void)
//   constructor(name, age) {
//     this.name = name
//     this.age = age
//   }
//   sayHi() {
//     console.log('sayhi')
//   }
// }

// let a = myNew(Person)('张三', 18)
// console.log(a)
