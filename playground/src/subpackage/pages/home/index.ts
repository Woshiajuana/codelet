import './index.json'
import './index.wxml'
import './index.scss'
import bee, { createPage } from '@bee/core'

createPage({
  onLoad() {
    console.log('subpackage home', bee)
  },
  handleJump() {},
})
