//将传入的对象作为原型
function create(obj) {
  function F() {}
  F.prototype = obj
  return new F()
}

//test
// let obj = { age: 52 }
// console.log(create(obj).age === Object.create(obj).age)
