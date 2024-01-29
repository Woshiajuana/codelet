import { definePage } from './definePage'

const home = definePage({
  mixins: [],
  data: {
    name: 'name',
  },
  home() {
    const s = this.data.name
  },
})
