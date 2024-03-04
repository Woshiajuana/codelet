import config from './config.js'
import JSON5 from 'json5'

const mode = 'wx'
const eventIdentifier = '__bee_event__'
const tagRE = /\{\{((?:.|\n|\r)+?)\}\}(?!})/
const tagREG = /\{\{((?:.|\n|\r)+?)\}\}(?!})/g

function stringify(o: any) {
  return JSON.stringify(o)
}

function dash2hump(value: string) {
  return value.replace(/-([a-z])/g, function (match, p1) {
    return p1.toUpperCase()
  })
}

function isEmptyObject(obj: any) {
  if (!obj) {
    return true
  }
  /* eslint-disable  no-unreachable-loop */
  for (const key in obj) {
    return false
  }
  return true
}

function stringifyWithResolveComputed(modelValue: any) {
  const result = []
  let inString = false
  const computedStack = []
  let fragment = ''

  for (let i = 0; i < modelValue.length; i++) {
    const char = modelValue[i]
    if (inString) {
      if (char === inString) {
        inString = false
      }
    } else if (char === '"' || char === "'") {
      inString = char
    } else if (char === '[') {
      computedStack.push(char)
      if (computedStack.length === 1) {
        fragment += '.'
        result.push(stringify(fragment))
        fragment = ''
        continue
      }
    } else if (computedStack.length) {
      if (char === ']') {
        computedStack.pop()
        if (computedStack.length === 0) {
          result.push(fragment)
          fragment = ''
          continue
        }
      }
    }
    fragment += char
  }
  if (fragment !== '') {
    result.push(stringify(fragment))
  }
  return result.join('+')
}

export function processBindEvent(el: any) {
  const eventConfigMap: Record<string, any> = {}
  el.attrsList.forEach(function (attr: any) {
    const parsedEvent = parseEvent(attr.name)

    if (parsedEvent) {
      const type = parsedEvent.eventName
      const modifiers = (parsedEvent.modifier || '').split('.')
      const parsedFunc = parseFuncStr2(attr.value)
      if (parsedFunc) {
        if (!eventConfigMap[type]) {
          eventConfigMap[type] = {
            rawName: attr.name,
            configs: [],
          }
        }
        eventConfigMap[type].configs.push(parsedFunc)
        if (modifiers.indexOf('proxy') > -1) {
          eventConfigMap[type].proxy = true
        }
      }
    }
  })

  const modelExp = getAndRemoveAttr(el, config[mode].directive.model).val
  if (modelExp) {
    const match = tagRE.exec(modelExp)
    if (match) {
      const modelProp =
        getAndRemoveAttr(el, config[mode].directive.modelProp).val ||
        config[mode].event.defaultModelProp
      const modelEvent =
        getAndRemoveAttr(el, config[mode].directive.modelEvent).val ||
        config[mode].event.defaultModelEvent
      const modelValuePathRaw = getAndRemoveAttr(el, config[mode].directive.modelValuePath).val
      const modelValuePath =
        modelValuePathRaw === undefined
          ? config[mode].event.defaultModelValuePath
          : modelValuePathRaw
      const modelFilter = getAndRemoveAttr(el, config[mode].directive.modelFilter).val
      let modelValuePathArr
      try {
        modelValuePathArr = JSON5.parse(modelValuePath)
        // modelValuePathArr = JSON.parse(modelValuePath)
      } catch (e) {
        if (modelValuePath === '') {
          modelValuePathArr = []
        } else {
          modelValuePathArr = modelValuePath.split('.')
        }
      }
      if (!isValidIdentifierStr(modelEvent)) {
        console.error(
          `EventName ${modelEvent} which is used in ${config[mode].directive.model} must be a valid identifier!`,
        )
        return
      }
      const modelValue = match[1].trim()
      const stringifiedModelValue = stringifyWithResolveComputed(modelValue)
      // if (forScopes.length) {
      //   stringifiedModelValue = stringifyWithResolveComputed(modelValue)
      // } else {
      //   stringifiedModelValue = stringify(modelValue)
      // }

      if (!eventConfigMap[modelEvent]) {
        eventConfigMap[modelEvent] = {
          configs: [],
        }
      }
      eventConfigMap[modelEvent].configs.unshift({
        hasArgs: true,
        expStr: `[${stringify('__model')},${stringifiedModelValue},${stringify(
          eventIdentifier,
        )},${stringify(modelValuePathArr)},${stringify(modelFilter)}]`,
      })
      addAttrs(el, [
        {
          name: modelProp,
          value: modelExp,
        },
      ])
    }
  }

  for (const type in eventConfigMap) {
    let needBind = false
    // eslint-disable-next-line prefer-const
    let { configs, rawName, proxy } = eventConfigMap[type]
    delete eventConfigMap[type]
    if (proxy) {
      needBind = true
    } else if (configs.length > 1) {
      needBind = true
    } else if (configs.length === 1) {
      needBind = !!configs[0].hasArgs
    }

    const escapedType = dash2hump(type)
    // 排除特殊情况
    if (!isValidIdentifierStr(escapedType)) {
      console.error(
        `EventName ${type} which need be framework proxy processed must be a valid identifier!`,
      )
      needBind = false
    }

    if (needBind) {
      if (rawName) {
        // 清空原始事件绑定
        let has
        do {
          has = getAndRemoveAttr(el, rawName).has
        } while (has)
        // 清除修饰符
        rawName = rawName.replace(/\..*/, '')
      }

      addAttrs(el, [
        {
          name: rawName || config[mode].event.getEvent(type),
          value: '__invoke',
        },
      ])
      eventConfigMap[escapedType] = configs.map((item: any) => {
        return item.expStr
      })
    }
  }

  if (!isEmptyObject(eventConfigMap)) {
    addAttrs(el, [
      {
        name: 'data-eventconfigs',
        value: `{{${config[mode].event.shallowStringify(eventConfigMap)}}}`,
      },
    ])
  }
}

function parseEvent(attr: string) {
  const match = /^(bind|catch|capture-bind|capture-catch):?(.*?)(?:\.(.*))?$/.exec(attr)
  if (match) {
    return {
      prefix: match[1],
      eventName: match[2],
      modifier: match[3],
    }
  }
}

function parseFuncStr2(str: string) {
  const funcRE = /^([^()]+)(\((.*)\))?/
  const match = funcRE.exec(str)
  if (match) {
    const funcName = parseMustacheWithContext(match[1]).result
    const hasArgs = !!match[2]
    let args = match[3] ? `,${match[3]}` : ''
    const ret = /(,|^)\s*(\$event)\s*(,|$)/.exec(args)
    if (ret) {
      const subIndex = ret[0].indexOf('$event')
      if (subIndex) {
        const index1 = ret.index + subIndex
        const index2 = index1 + 6
        args = args.substring(0, index1) + stringify(eventIdentifier) + args.substring(index2)
      }
    }
    return {
      hasArgs,
      expStr: `[${funcName + args}]`,
    }
  }
}

function getAndRemoveAttr(el: any, name: any, removeFromMap = true) {
  let val, has
  const list = el.attrsList
  for (let i = 0, l = list.length; i < l; i++) {
    if (list[i].name === name) {
      val = list[i].value
      has = true
      list.splice(i, 1)
      break
    }
  }
  if (removeFromMap && val === el.attrsMap[name]) {
    delete el.attrsMap[name]
  }
  return {
    has,
    val,
  }
}

function isValidIdentifierStr(str: string) {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(str)
}

function addAttrs(el: any, attrs: any) {
  const list = el.attrsList
  const map = el.attrsMap
  for (let i = 0, l = attrs.length; i < l; i++) {
    list.push(attrs[i])
    map[attrs[i].name] = attrs[i].value
  }
}

function parseMustacheWithContext(raw = '') {
  return parseMustache(raw, (exp) => {
    return exp
  })
}

function parseMustache(raw = '', expHandler = (exp: any) => exp, strHandler = (str: any) => str) {
  let replaced = false
  if (tagRE.test(raw)) {
    const ret = []
    let lastLastIndex = 0
    let match
    while ((match = tagREG.exec(raw))) {
      const pre = raw.substring(lastLastIndex, match.index)
      if (pre) {
        const pre2 = strHandler(pre)
        if (pre2 !== pre) replaced = true
        if (pre2) ret.push(stringify(pre2))
      }

      const exp = match[1].trim()
      if (exp) {
        const exp2 = expHandler(exp)
        if (exp2 !== exp) replaced = true
        if (exp2) ret.push(`(${exp2})`)
      }

      lastLastIndex = tagREG.lastIndex
    }

    const post = raw.substring(lastLastIndex)
    if (post) {
      const post2 = strHandler(post)
      if (post2 !== post) replaced = true
      if (post2) ret.push(stringify(post2))
    }

    let result
    if (ret.length === 1) {
      result = ret[0]
    } else {
      result = `(${ret.join('+')})`
    }

    return {
      result,
      hasBinding: true,
      val: replaced ? `{{${result}}}` : raw,
      replaced,
    }
  }

  const raw2 = strHandler(raw)
  if (raw2 !== raw) replaced = true

  return {
    result: stringify(raw2),
    hasBinding: false,
    val: raw2,
    replaced,
  }
}
