/*   浅拷贝 */

//method 1
let copy1 = { ...{ x: 1 } }
//mehod 2
let copy2 = Object.assign({}, { x: 1 })

/*  深拷贝 */
// 1.JOSN.stringify()/JSON.parse()
// 2.递归拷贝
function deepClone(obj = {}) {
  let newObj = {}
  if (typeof obj === 'number' || typeof obj === 'string') return obj
  Object.keys(obj).forEach((key) => {
    let value = obj[key]
    if (typeof value === 'function') {
      //如果是函数 通过bind产生新函数
      newObj[key] = value.bind(newObj)
    } else if (Array.isArray(value)) {
      //如果是数组
      newObj[key] = value.map((el) => deepClone(el))
    } else if (typeof value === 'object' && value !== null) {
      //对象类型
      newObj[key] = deepClone(value)
    } else {
      newObj[key] = value
    }
  })
  return newObj
}

//test
// const obj = {
//   a: 1,
//   b: {},
//   c: { j: 2, k: () => {} },
//   e: () => {},
//   f: function() {},
//   g: [() => {}, [1, 2, 3], 3]
// }

// console.log(deepClone(obj))
