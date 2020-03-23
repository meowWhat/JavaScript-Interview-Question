const cache = {} //事件缓存中心

export default class EventHub {
  //订阅事件
  on(eventName, fn) {
    //初始化缓存中心
    cache[eventName] = cache[eventName] || []
    //将订阅的事件存进缓存中心
    cache[eventName].push(fn)
  }
  //解约事件
  off(eventName, fn) {
    //检测
    let index = cache[eventName] && cache[eventName].indexOf(fn)
    if (index === undefined || index === -1) return

    //删除掉对应事件
    cache[eventName].splice(index, 1)
  }
  //触发事件
  emit(eventName, payload) {
    if (Array.isArray(cache[eventName]) && cache[eventName].length > 0) {
      //将缓存中心对应事件的数组遍历,取出里面的fn,并执行 ,附上载荷payload
      cache[eventName].forEach((fn) => fn(payload))
    }
  }
}
