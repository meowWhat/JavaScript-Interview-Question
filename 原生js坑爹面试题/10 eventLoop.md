# 浏览器中的 event loop

## 单线程的含义

- 一个 tab 对应 一个 renderer process(多进程的)其中 main thread 负责页面渲染(GUI render engine ) 执行 js (js engine) 和 event loop

## 浏览器端的 event loop

- 一个函数执行栈,一个事件队列,一个微任务队列
- 每从事件队列中取一个事件时,有微任务就把微任务执行完,然后再开始执行事件

## -------宏任务和微任务

### 1) 宏任务 (macrotask) 也叫 tasks

- 一些异步任务的回调会一次进入 macro task queue 等待后续被调用 这些任务包括 定时器,请求,i/o , UIrendering ....

### 2 ) 微任务 (microtask) 也叫 jobs

- 另一些异步的回调会一次进入 micro tsk queue 等待后续被调用 这些任务包括 promise.then() ,Object.observe ,MutationObserver , process.nextTick(Node 独有)....

## 基础题

```javascript
setTimeout(() => {
  console.log(1)
  Promise.resolve(3).then((data) => console.log(data))
}, 0)
setTimeout(() => {
  console.log(2)
}, 0)
```

## 巩固题

```javascript
console.log('script start')
setTimeout(function() {
  console.log('setTimeout')
  Promise.resolve()
    .then(function() {
      console.log('promise3')
    })
    .then(function() {
      console.log('promise4')
    })
}, 0)
Promise.resolve()
  .then(function() {
    console.log('promise1')
  })
  .then(function() {
    console.log('promise2')
  })
console.log('script end')
```

## 总结 浏览器的 event loop

- 一个函数调用栈 执行 js 代码,执行同步代码 将异步任务分成宏任务 和微任务 放进 不同的队列
- 一个 task 队列 //宏任务
- 一个微任务队列
- 当函数调用栈空了 发生 event loop
- **eventloop 会先将微任务队列全部清空 再执行 宏任务队列的任务**

# node 中的 event loop

## 与 浏览器 中的 event loop 不同

- node.js 中 微任务队列 分为两种 next tick queue 和 other microtask queue
  **微任务中先执行 next tick queue 再执行 other microtask queue**
- 宏任务分为六种 大致顺序是 **先 timers 计时器 => i/o 操作(文件读取) => check(setImmediate)**

## 面试题 1 ---node 环境

```javascript
Promise.resolve('123').then((a) => console.log(a))

process.nextTick(() => console.log('nextTick'))
```

## 面试题 2 ---node 环境 -- 顺序不确定

```javascript
setTimeout(() => {
  console.log(1)
})
setImmediate(() => {
  console.log(2)
})
```

## 面试题 2 探讨 让顺序确定

### 永远是 1 , 2 因为准备的时间 >1ms 先执行 timer

```javascript
setTimeout(() => {
  console.log(1)
}, 0)

setImmediate(() => {
  console.log(2)
})
let time = Date.now()
while (Date.now() - time < 10) {}
```

## 让 immediate 先执行

- 因为执行顺序是 timers 计数器 => I/O callback => check(setImmediate) ...
- 一旦读文件 就是到了 io callback 这个环节 那么马上执行的 是 check

```javascript
const fs = require('fs')
fs.readFile(__dirname, () => {
  setTimeout(() => {
    console.log(1)
  }, 0)

  setImmediate(() => {
    console.log(2)
  })
})
```

## ======必杀技 ==

```javascript
console.time('start')
setTimeout(() => {
 console.log(2)
}, 10)
setImmediate(() => {
 console.log(1)
})
new Promise((resolve) => {
 console.log(3)
 resolve()
 console.log(4)
}).then(() => {
 console.log(5)
 console.timeEnd('start')
})
console.log(6)
process.nextTick(() => {
 console.log(7)
})
console.log(8)

3 ,4,6,8 ,7 ,5 ,time,  (time > 10) ? 2 ,1 :  1 ,2
```

# 总结

**程序执行顺序 同步执行完成 => 微任务执行完成 =>宏任务**
