export default {
  wx: {
    typeExtMap: {
      json: '.json',
      script: '.js',
      template: '.wxml',
      styles: '.wxss',
    },
    tabBar: {
      itemKey: 'list',
      iconKey: 'iconPath',
      activeIconKey: 'selectedIconPath',
    },
    event: {
      parseEvent(attr: string) {
        const match = /^(bind|catch|capture-bind|capture-catch):?(.*?)(?:\.(.*))?$/.exec(attr)
        if (match) {
          return {
            prefix: match[1],
            eventName: match[2],
            modifier: match[3],
          }
        }
      },
      getEvent(eventName: string, prefix = 'bind') {
        return prefix + eventName
      },
      defaultModelProp: 'value',
      defaultModelEvent: 'input',
      defaultModelValuePath: 'value',
      shallowStringify(obj: any) {
        const arr = []
        for (const key in obj) {
          let value = obj[key]
          if (Array.isArray(value)) {
            value = `[${value.join(',')}]`
          }
          arr.push(`${key}:${value}`)
        }
        return ` {${arr.join(',')}} `
      },
    },
    wxs: {
      tag: 'wxs',
      module: 'module',
      src: 'src',
      ext: '.wxs',
      templatePrefix: 'module.exports = \n',
    },
    directive: {
      if: 'wx:if',
      elseif: 'wx:elif',
      else: 'wx:else',
      model: 'wx:model',
      modelProp: 'wx:model-prop',
      modelEvent: 'wx:model-event',
      modelValuePath: 'wx:model-value-path',
      modelFilter: 'wx:model-filter',
      for: 'wx:for',
      forIndex: 'wx:for-index',
      forItem: 'wx:for-item',
      key: 'wx:key',
      dynamicClass: 'wx:class',
      dynamicStyle: 'wx:style',
      ref: 'wx:ref',
      show: 'wx:show',
    },
  },
}
