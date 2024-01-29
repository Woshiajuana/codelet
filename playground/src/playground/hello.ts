import { definePage } from './definePage'

export const hello = definePage({
  data: {
    helloName: 'hello world',
  },
  hello() {
    console.log(this.data.helloName)
  },
})
