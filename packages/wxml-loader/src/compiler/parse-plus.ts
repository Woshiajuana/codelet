import type { ASTElement } from './types'
import { isUnaryTag } from './utils.js'

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

let IS_REGEX_CAPTURING_BROKEN = false
'x'.replace(/x(.)?/g, ((m: any, g: any) => {
  IS_REGEX_CAPTURING_BROKEN = g === ''
}) as any)

function createASTElement(tag: string, attrs: any[], parent?: any): ASTElement {
  return {
    type: 1,
    tag,
    attrsList: attrs,
    parent,
    children: [],
  }
}

function parseHtml(html: string, options: any = {}) {
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

      // 结束标签
      const endTagMatch = html.match(endTag)
      if (endTagMatch) {
        console.log('endTagMatch => ', endTagMatch, html)
        const curIndex = index
        advance(endTagMatch[0].length)
        parseEndTag(endTagMatch[1], curIndex, index)
        continue
      }

      // 开始标签
      const startTagMatch = parseStartTag()
      if (startTagMatch) {
        console.log('startTagMatch => ', startTagMatch, html)
        handleStartTag(startTagMatch)
        continue
      }
    }

    let text, rest, next
    if (textEnd >= 0) {
      // 截取文本
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
      console.log('text => ', 'x' + text + 'x')
      options.chars(text)
    }

    if (html === last) {
      options.chars(html)
      break
    }
  }

  parseEndTag()

  function advance(n: number) {
    index += n
    html = html.substring(n)
  }

  // 解析开始标签
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
      // hackish work around FF bug https://bugzilla.mozilla.org/show_bug.cgi?id=369778
      if (IS_REGEX_CAPTURING_BROKEN && args[0].indexOf('""') === -1) {
        if (args[3] === '') {
          delete args[3]
        }
        if (args[4] === '') {
          delete args[4]
        }
        if (args[5] === '') {
          delete args[5]
        }
      }
      let value
      for (const index of [3, 4, 5]) {
        if (args[index] != null) {
          value = args[index]
          break
        }
      }
      attrs[i] = {
        name: args[1],
        // value: decode(value),
        value,
      }
    }

    if (!unary) {
      stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs })
      lastTag = tagName
    }

    if (options.start) {
      options.start(tagName, attrs, unary, match.start, match.end)
    }
  }

  function parseEndTag(tagName?: any, start?: any, end?: any) {
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

    console.log('parseEndTagparseEndTag', pos, tagName)

    if (pos >= 0) {
      // Close all the open elements, up the stack
      for (let i = stack.length - 1; i >= pos; i--) {
        if ((i > pos || !tagName) && options.warn) {
          options.warn('tag <' + stack[i].tag + '> has no matching end tag.')
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
        options.start(tagName, [], true, start, end)
      }
    } else if (lowerCasedTagName === 'p') {
      if (options.start) {
        options.start(tagName, [], false, start, end)
      }
      if (options.end) {
        options.end(tagName, start, end)
      }
    }
  }
}

export function parsePlus(content: string) {
  const root = createASTElement('temp-node', [])
  let currentParent = root
  const stack: ASTElement[] = [root]

  parseHtml(content, {
    start(tag: string, attrs: any[], unary: boolean) {
      console.log('start => ', tag, attrs, unary)
      const element = createASTElement(tag, attrs, currentParent)
      currentParent.children.push(element)
      if (!unary) {
        currentParent = element
        stack.push(element)
      }
    },
    end(tag: string) {
      console.log('end => ', tag)
      stack.pop()
      currentParent = stack[stack.length - 1]
    },
    // 文本节点
    chars(text: string) {
      currentParent.children.push({
        type: 3,
        text: text,
        parent: currentParent,
        children: [],
      })
    },
    // 注释节点
    comment(text: string) {
      // currentParent.children.push({
      //   type: 3,
      //   text: text,
      //   parent: currentParent,
      //   isComment: true,
      //   children: [],
      // })
    },
  })

  return root
}
