import { definePage } from './definePage'
import { hello } from './hello'
import { print } from './print'

const home = definePage({
  mixins: [hello, print],
  data: {
    name: 'name',
    age: 1,
  },
  home() {
    const name = this.data.name
    const age = this.data.age
    const printName = this.data.printName
  },
})
