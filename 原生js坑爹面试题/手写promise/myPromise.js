//私有的状态 不允许外界访问
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class Promise {
  constructor(executor) {
    //参数校验
    if (typeof executor !== 'function') {
      throw new TypeError(`Promise resolver ${executor} is  not a function`)
    }

    this.initValue()

    try {
      executor(this.resolve, this.reject)
    } catch (error) {
      this.reject(error)
    }
  }
  //初始化状态
  initValue() {
    this.value = null
    this.reason = null
    this.state = PENDING
    this.onFulfilledCallBack = []
    this.onRejectedCallBack = []
    this.resolve = this.resolve.bind(this)
    this.reject = this.reject.bind(this)
  }
  //成功后执行
  resolve(value) {
    const run = (value) => {
      if (this.state === PENDING) {
        this.state = FULFILLED
        try {
          this.onFulfilledCallBack.forEach((fn) => {
            fn(value)
          })
        } catch (error) {
          this.state = PENDING
          this.reject(error)
        }
      }
    }
    this.value = value
    if (value instanceof Promise) {
      value.then((value) => {
        this.value = value
      })
    }
    setTimeout(() => {
      run(this.value)
    }, 0)
  }
  //拒绝后执行
  reject(reason) {
    const run = (reason) => {
      if (this.state === PENDING) {
        this.state = REJECTED
        this.onRejectedCallBack.forEach((fn) => {
          fn(reason)
        })
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
      run(this.reason)
    }, 0)
  }
  //then方法实现
  then(onFulfilled, onRejected) {
    return new Promise((resolve, reject) => {
      //状态为pending
      if (this.state === PENDING) {
        if (onFulfilled) {
          this.onFulfilledCallBack.push((value) => {
            let res = onFulfilled(value)
            if (res instanceof Promise) {
              res.then(resolve, reject)
            } else {
              resolve()
            }
          })
        }

        if (onRejected) {
          this.onRejectedCallBack.push((value) => {
            let res = onRejected(value)
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
