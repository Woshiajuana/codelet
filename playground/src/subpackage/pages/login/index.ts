import './index.json'
import './index.wxml'
import './index.scss'
import bee, { createPage } from '@codelet/core'

createPage({
  onLoad() {
    console.log('subpackage login', bee)
  },
  handleJump() {},
})
