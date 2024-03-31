import { parseEvent } from '../utils'
import { createBehavior } from './createBehavior'
import { type Event } from './types'

function dash2hump(value: string) {
  return value.replace(/-([a-z])/g, function (_, p1) {
    return p1.toUpperCase()
  })
}

// 运行时 拓展的一些辅助函数
export const RuntimeBehavior = createBehavior({
  data: {
    error: '',
  },
  methods: {
    __invoke($event: Event) {
      const { type } = $event
      const { eventconfigs: eventConfigs } = parseEvent($event)
      const fallbackType = dash2hump(type)
      const curEventConfig: any[] = eventConfigs[type] || eventConfigs[fallbackType] || []

      let returnedValue
      curEventConfig.forEach((item) => {
        const callbackName = item[0]
        if (callbackName) {
          const params =
            item.length > 1
              ? item.slice(1).map((item: any) => {
                  if (item === '__bee_event__') {
                    return $event
                  } else {
                    return item
                  }
                })
              : [$event]
          if (typeof (this as any)[callbackName] === 'function') {
            returnedValue = (this as any)[callbackName].apply(this, params)
          } else {
            console.error(`实例属性[${callbackName}]不起作用，请检查。`)
          }
        }
      })
      return returnedValue
    },
  },
})
