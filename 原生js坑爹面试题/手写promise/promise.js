//私有属性
const PENDING = 'pending' //初始状态，既不是成功，也不是失败状态。
const FULFILLED = 'fulfilled' //意味着操作成功完成
const REJECTED = 'rejected' //意味着操作失败。

class Promise {
  constructor(executor) {
    //Promise构造函数执行时立即调用executor 函数
    //类型检测
    if (typeof executor !== 'function') {
      throw new TypeError(`Promise resolver ${executor} is  not a function`)
    }
    //初始化promosie状态
    this.initValue()

    //执行executor ,传入reject resolve 两个方法
    executor(this.resolve, this.reject)
  }

  initValue() {
    /**
     * 初始化promise状态
     */
    this.state = PENDING //promise状态 默认为pending
    this.value = null //全局管理的 resolve之间传递的值
    this.reason = null //全局管理的 reject传递的值
    //绑定 reject resolve的this
    this.resolve = this.resolve.bind(this)
    this.reject = this.reject.bind(this)
    //提供执行队列 =>发布订阅模式
    this.onFulfilledQueue = []
    this.onRejectedQueue = []
  }
  resolve(value) {
    /**
     * 成功时执行的函数
     */
    const run = () => {
      if (this.state === PENDING) {
        //当用户调用resolve 且状态为pending时
        //我们将执行队列函数依次执行并清空
        this.state = FULFILLED
        while (this.onFulfilledQueue.length > 0) {
          this.onFulfilledQueue.shift()(this.value)
        }
      }
    }
    //注意： 这里判断value 是否是promise实例目的是解决
    // resolve(new promise(...)) 这样的递归
    // 这也是 将 value存放进 this的意义 --自行体会
    // reject 同理
    this.value = value
    if (value instanceof Promise) {
      value.then((value) => {
        this.value = value
      })
    }
    //将run添加进异步队列 使支持同步promise的写法
    setTimeout(() => {
      run()
    }, 0)
  }
  reject(reason) {
    /**
     * 失败时执行的函数 道理同 resolve
     */
    const run = () => {
      if (this.state === PENDING) {
        //当用户调用reject且状态为pending时
        //我们将执行队列函数依次执行并清空
        this.state = REJECTED
        while (this.onRejectedQueue.length > 0) {
          this.onRejectedQueue.shift()(this.reason)
        }
      }
    }
    this.reason = reason

    if (reason instanceof Promise) {
      reason.then(
        () => {},
        (reason) => {
          this.reason = reason
        }
      )
    }
    setTimeout(() => {
      run()
    }, 0)
  }

  then(fulfilledFn, rejectedFn) {
    /**
     * then方法 resolve|reject 后执行的函数
     */
    //return promise 使支持 链式调用 比较核心的做法
    console.log('^^^^')

    return new Promise((resolve, reject) => {
      if (this.state === PENDING) {
        if (fulfilledFn) {
          //最核心的算法
          //为什么需要用发布订阅模式, 因为这一坨需要在 resolve执行后执行
          //这也是promise支持异步的原理,他是等resolve函数执行完再遍历队列执行then里面的函数
          this.onFulfilledQueue.push((value) => {
            let res = fulfilledFn(value)
            //这里的res 就是用户调用then 之后的返回值
            if (res instanceof Promise) {
              //如果res是promise实例 调用用户promise的then方法
              res.then(resolve, reject)
            } else {
              //如果不是promise 使支持then穿透 即 P.then('null').then(()=>{xxx})
              resolve()
            }
          })
        }
        //同理
        if (rejectedFn) {
          this.onRejectedQueue.push((value) => {
            let res = rejectedFn(value)
            if (res instanceof Promise) {
              res.then(resolve, reject)
            } else {
              resolve()
            }
          })
        }
      }
    })
  }
}
