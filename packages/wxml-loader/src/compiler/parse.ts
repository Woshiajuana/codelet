import { shouldIgnoreFirstNewline, isUnaryTag } from './utils.js'
import config from './config.js'
import JSON5 from 'json5'

// Regular Expressions for parsing tags and attributes
const attribute = /^\s*([^\s"'<>/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const ncname = '[a-zA-Z_][\\w\\-\\.]*'
const qnameCapture = '((?:' + ncname + '\\:)?' + ncname + ')'
const startTagOpen = new RegExp('^<' + qnameCapture)
const startTagClose = /^\s*(\/?)>/
const endTag = new RegExp('^<\\/' + qnameCapture + '[^>]*>')
const doctype = /^<!DOCTYPE [^>]+>/i
const comment = /^<!--/
const conditionalComment = /^<!\[/

const tagRES = /(\{\{(?:.|\n|\r)+?\}\})(?!})/
const tagRE = /\{\{((?:.|\n|\r)+?)\}\}(?!})/
const tagREG = /\{\{((?:.|\n|\r)+?)\}\}(?!})/g

function parseHtml(html: string, options: any = {}) {
  console.log('html => ', html)

  const stack: any[] = []

  let index = 0
  let last
  let lastTag = ''
  while (html) {
    let textEnd = html.indexOf('<')
    if (textEnd === 0) {
      // 注释 <!--  -->
      if (comment.test(html)) {
        const commentEnd = html.indexOf('-->')
        if (commentEnd >= 0) {
          options.comment(html.substring(4, commentEnd))
          advance(commentEnd + 3)
          continue
        }
      }

      // 条件注释
      // http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
      if (conditionalComment.test(html)) {
        const conditionalEnd = html.indexOf(']>')

        if (conditionalEnd >= 0) {
          advance(conditionalEnd + 2)
          continue
        }
      }

      // Doctype:
      const doctypeMatch = html.match(doctype)
      if (doctypeMatch) {
        advance(doctypeMatch[0].length)
        continue
      }

      // End tag:
      const endTagMatch = html.match(endTag)
      if (endTagMatch) {
        const curIndex = index
        advance(endTagMatch[0].length)
        parseEndTag(endTagMatch[1], curIndex, index)
        continue
      }

      // Start tag:
      const startTagMatch = parseStartTag()
      if (startTagMatch) {
        handleStartTag(startTagMatch)
        if (shouldIgnoreFirstNewline(lastTag, html)) {
          advance(1)
        }
        continue
      }

      let text, rest, next
      if (textEnd >= 0) {
        rest = html.slice(textEnd)
        while (
          !endTag.test(rest) &&
          !startTagOpen.test(rest) &&
          !comment.test(rest) &&
          !conditionalComment.test(rest)
        ) {
          // < in plain text, be forgiving and treat it as text
          next = rest.indexOf('<', 1)
          if (next < 0) {
            break
          }
          textEnd += next
          rest = html.slice(textEnd)
        }
        text = html.substring(0, textEnd)
        advance(textEnd)
      }

      if (textEnd < 0) {
        text = html
        html = ''
      }

      if (text) {
        options.chars(text)
      }
    }
    if (html === last) {
      options.chars(html)
      break
    }
    break
  }

  // Clean up any remaining tags
  parseEndTag()

  function advance(n: number) {
    index += n
    html = html.substring(n)
  }

  function parseStartTag() {
    const start = html.match(startTagOpen)
    if (start) {
      const match: any = {
        tagName: start[1],
        attrs: [],
        start: index,
      }
      advance(start[0].length)
      let end, attr
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        advance(attr[0].length)
        match.attrs.push(attr)
      }
      if (end) {
        match.unarySlash = end[1]
        advance(end[0].length)
        match.end = index
        return match
      }
    }
  }

  function handleStartTag(match: any) {
    const tagName = match.tagName
    const unarySlash = match.unarySlash

    const unary = isUnaryTag(tagName) || !!unarySlash

    const l = match.attrs.length
    const attrs = new Array(l)
    for (let i = 0; i < l; i++) {
      const args = match.attrs[i]
      const value = args[3] || args[4] || args[5] || ''
      const shouldDecodeNewlines = tagName === 'a' && args[1] === 'href'
      attrs[i] = {
        name: args[1],
        value,
        shouldDecodeNewlines,
      }
    }

    if (!unary) {
      lastTag = tagName
    }

    options.start(tagName, attrs, unary, match.start, match.end)
  }

  function parseEndTag(tagName?: string, start?: number, end?: number) {
    let pos, lowerCasedTagName
    if (start == null) {
      start = index
    }
    if (end == null) {
      end = index
    }

    if (tagName) {
      lowerCasedTagName = tagName.toLowerCase()
    }

    // Find the closest opened tag of the same type
    if (tagName) {
      for (pos = stack.length - 1; pos >= 0; pos--) {
        if (stack[pos].lowerCasedTag === lowerCasedTagName) {
          break
        }
      }
    } else {
      // If no tag name is provided, clean shop
      pos = 0
    }

    if (pos >= 0) {
      // Close all the open elements, up the stack
      for (let i = stack.length - 1; i >= pos; i--) {
        if (i > pos || !tagName) {
          console.error('tag <' + stack[i].tag + '> has no matching end tag.')
        }
        if (options.end) {
          options.end(stack[i].tag, start, end)
        }
      }

      // Remove the open elements from the stack
      stack.length = pos
      lastTag = pos && stack[pos - 1].tag
    } else if (lowerCasedTagName === 'br') {
      if (options.start) {
        options.start(tagName!, [], true, start, end)
      }
    } else if (lowerCasedTagName === 'p') {
      if (options.start) {
        options.start(tagName!, [], false, start, end)
      }
      if (options.end) {
        options.end(tagName!, start, end)
      }
    }
  }
}

function makeAttrsMap(attrs: any[]) {
  const map: Record<string, any> = {}
  for (let i = 0, l = attrs.length; i < l; i++) {
    map[attrs[i].name] = attrs[i].value
  }
  return map
}

function createASTElement(tag: any, attrs: any[], parent?: any) {
  const element = {
    type: 1,
    tag: tag,
    attrsList: attrs,
    attrsMap: makeAttrsMap(attrs),
    parent: parent,
    children: [],
  }
  return element as typeof element & { [key: string]: any }
}

export function parse(content: string) {
  let currentParent: any
  let root: any
  const stack: any[] = []
  const meta: Record<string, any> = {}
  // 用于记录模板用到的组件，匹配引用组件，看是否有冗余
  const tagNames = new Set()

  function getTempNode() {
    return createASTElement('temp-node', [])
  }

  function genTempRoot() {
    // 使用临时节点作为root，处理multi root的情况
    root = currentParent = getTempNode()
    stack.push(root)
  }

  const options = {
    // 开始标签
    start(tag: string, attrs: any, unary: boolean, start: number, end: number) {
      // check namespace.
      // inherit parent ns if there is one
      const ns = currentParent && currentParent.ns

      const element = createASTElement(tag, attrs, currentParent)
      if (ns) {
        ;(element as any).ns = ns
      }

      // multi root
      if (!currentParent) genTempRoot()

      currentParent.children.push(element)
      element.parent = currentParent
      processElement(element, root, options, meta)
      tagNames.add(element.tag)

      if (!unary) {
        currentParent = element
        stack.push(element)
      } else {
        element.unary = true
        closeElement(element, meta, options)
      }
    },

    // 结束标签
    end(tagName: string, start: number, end: number) {
      // remove trailing whitespace
      const element = stack[stack.length - 1]
      if (element) {
        const lastNode = element.children[element.children.length - 1]
        if (lastNode && lastNode.type === 3 && lastNode.text === ' ') {
          element.children.pop()
        }
        // pop stack
        stack.pop()
        currentParent = stack[stack.length - 1]
        closeElement(element, meta, options)
      }
    },

    // 文本
    chars(text: string) {
      if (!currentParent) genTempRoot()

      const children = currentParent.children
      if (currentParent.tag !== 'text') {
        text = text.trim()
      }

      if (text) {
        if (text !== ' ' || !children.length || children[children.length - 1].text !== ' ') {
          const el = {
            type: 3,
            // 支付宝小程序模板解析中未对Mustache进行特殊处理，无论是否decode都会解析失败，无解，只能支付宝侧进行修复
            text: text,
            parent: currentParent,
          }
          children.push(el)
          processText(el)
        }
      }
    },

    // 注释
    comment(text: string) {
      if (!currentParent) genTempRoot()
      if (/mpx_config_/.test(text)) {
        currentParent.children.push({
          type: 3,
          text: text,
          parent: currentParent,
          isComment: true,
        })
      }
    },
  }

  parseHtml(content, options)
}

function addExp(el: any, exp: any, isProps?: any) {
  if (exp) {
    if (!el.exps) {
      el.exps = []
    }
    el.exps.push({ exp, isProps })
  }
}

function processText(el: any) {
  if (el.type !== 3 || el.isComment) {
    return
  }
  const parsed = parseMustacheWithContext(el.text)
  if (parsed.hasBinding) {
    addExp(el, parsed.result)
  }
  el.text = parsed.val
}

function closeElement(el: any, meta: any, options: any) {}

function addAttrs(el: any, attrs: any) {
  const list = el.attrsList
  const map = el.attrsMap
  for (let i = 0, l = attrs.length; i < l; i++) {
    list.push(attrs[i])
    map[attrs[i].name] = attrs[i].value
  }
}

function processElement(el: any, root: any, options: any, meta: any) {
  // 如果已经标记了这个元素要被清除，直接return跳过后续处理步骤
  if (el._atModeStatus === 'mismatch') {
    return
  }
  processBindEvent(el, options)
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
        if (pre2) ret.push(JSON.stringify(pre2))
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
      if (post2) ret.push(JSON.stringify(post2))
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
    result: JSON.stringify(raw2),
    hasBinding: false,
    val: raw2,
    replaced,
  }
}

function parseMustacheWithContext(raw = '') {
  return parseMustache(raw, (exp) => {
    return exp
  })
}

const eventIdentifier = '__mpx_event__'

const mode = 'wx'

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
        result.push(JSON.stringify(fragment))
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
    result.push(JSON.stringify(fragment))
  }
  return result.join('+')
}

function stringify(o: any) {
  return JSON.stringify(o)
}

function processBindEvent(el: any, options: any) {
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
        if (modifiers.indexOf('proxy') > -1 || options.forceProxyEvent) {
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

function hump2dash(value: string) {
  return value.replace(/[A-Z]/g, function (match) {
    return '-' + match.toLowerCase()
  })
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
