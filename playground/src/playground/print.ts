import { definePage } from './definePage'

export const print = definePage({
  data: {
    printName: 'print',
  },
  print() {
    console.log(this.data.printName)
  },
})
