# codelet

## 搭建

```sh

```

## 初步版本目标

- 支持 `ts`
- 支持 `sass`
- 支持 `app.json` 自动生成
- 支持分包策略
- 支持事件传递参数

## 问题

- 修复PC端没法捕获错误，wx.onUnhandledRejection

```js
class CustomPromise extends Promise {
  constructor(executor) {
    super((resolve, reject) => {
      executor(resolve, (reason) => {
        onError(reason)
        console.log('executor => ', reason)
        reject(reason)
      })
    })
  }
}
global.Promise = CustomPromise // 替换全局Promise
```
