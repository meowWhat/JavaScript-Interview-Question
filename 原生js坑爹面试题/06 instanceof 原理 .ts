// 思路：右边变量的原型存在于左边变量的原型链上
function instanceOf(left, right) {
  let leftValue = left.__proto__
  let righValue = right.prototype
  while (true) {
    if (leftValue === null) return false
    if (leftValue === righValue) return true
    leftValue = leftValue.__proto__
  }
}
//test
// function F() {}
// let a = new F()
// function fn() {}

// console.log(instanceOf(fn, F))
// console.log(instanceOf(a, F))
