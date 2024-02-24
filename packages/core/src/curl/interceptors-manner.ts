export class InterceptorsManner {
  constructor() {
    this.interceptors = []
  }
  use(interceptor) {
    this.interceptors.push(interceptor)
    return this
  }
  eject(interceptor) {
    const index = this.interceptors.indexOf(interceptor)
    if (index !== -1) {
      this.interceptors.splice(index, 1)
    }
  }
  forEach(fn) {
    this.interceptors.forEach((interceptor) => {
      fn(interceptor)
    })
  }
}
