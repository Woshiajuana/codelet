import bee, { apiProxy, createApp } from '@bee/core'
import './app.json'
import './app.scss'
import './project.config.json'

bee.use(apiProxy)

createApp()
