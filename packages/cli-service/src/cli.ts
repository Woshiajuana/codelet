import { bootstrap } from './bootstrap'

bootstrap(process.argv).catch((err) => {
  console.error(err)
  process.exit(1)
})
