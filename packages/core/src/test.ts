import { promisify } from './utils'

function test(
  options: {
    a: number
    success?: (ss: string) => void
  },
  b: string,
) {
  return options.a + b
}

const testP = promisify(test)

testP({ a: 1 }, '1').then((res) => {})

const getLocation = promisify(wx.getLocation)

getLocation({}).then((res) => {
  res.altitude
})

wx.getLocation({})
