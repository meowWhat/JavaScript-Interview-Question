function Father(name) {
  this.name = name
}
Father.prototype.sayHi = function() {
  console.log(this.name + this.age)
}

function Son(age, name) {
  Father.call(this, name)
  this.age = age
}

Son.prototype = Object.create(Father.prototype)
Son.prototype.constructor = Son

let a = new Son(18, 20)
a.sayHi()
