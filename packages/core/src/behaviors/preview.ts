import { isArray, isObject, isString } from '@daysnap/utils'

import { col } from '../codelet'
import { createBehavior } from '../create'
import { parseEvent } from '../utils'

export const PreviewBehavior = createBehavior({
  methods: {
    previewImage(event: unknown) {
      let { urls = [], current = '' } = parseEvent(isObject(event) ? event : {})
      if (isString(event)) {
        current = event
        urls = [current]
      } else if (isArray(event)) {
        urls = event
        current = urls[0]
      } else if (isObject(event)) {
        const res = parseEvent(event)
        if (res.current) {
          current = res.current
        }
        if (res.urls) {
          urls = res.urls
        }
        if (!current && urls.length) {
          current = urls[0]
        }
        if (!urls.length && current) {
          urls = [current]
        }
      }
      if (!urls.length) {
        return
      }
      col.previewImage({ urls, current })
    },
  },
})
