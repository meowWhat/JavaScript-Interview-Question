import EventHub from './index'

const eventHub = new EventHub()

let fn = (a) => {
  console.log(a)
}

eventHub.on('xxx', fn)

eventHub.emit('xxx', 'meow~~')
