import './index.json'
import './index.wxml'
import './index.scss'
import { createComponent } from '@codelet/core'

createComponent({
  data: {
    title: 'Hello, World!',
  },
  methods: {
    onTap() {
      console.log('onTap')
    },
  },
})
