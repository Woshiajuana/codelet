import './index.json'
import './index.wxml'
import './index.scss'
import col, { createPage } from '@codelet/core'

createPage({
  onLoad() {
    console.log('subpackage login', col)
  },
  handleJump() {},
})
