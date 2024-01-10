export const test = (x) => {
  console.log('test function start')
  const value = x ? new Date() : x
  console.log('test function value => ', value)
  console.log('test function end')
}
