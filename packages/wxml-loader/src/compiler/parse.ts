import {
  isIgnoreNewlineTag,
  shouldIgnoreFirstNewline,
  isNonPhrasingTag,
  isUnaryTag,
} from './utils.js'

// Regular Expressions for parsing tags and attributes
const attribute = /^\s*([^\s"'<>/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const ncname = '[a-zA-Z_][\\w\\-\\.]*'
const qnameCapture = '((?:' + ncname + '\\:)?' + ncname + ')'
const startTagOpen = new RegExp('^<' + qnameCapture)
const startTagClose = /^\s*(\/?)>/
const endTag = new RegExp('^<\\/' + qnameCapture + '[^>]*>')
const doctype = /^<!DOCTYPE [^>]+>/i
const startComment = /^<!--/
const conditionalComment = /^<!\[/

// 开始标签
function start(tagName: string, attrs: any, unary: boolean, start: number, end: number) {
  //
}

// 结束标签
function end(tagName: string, start: number, end: number) {
  //
}

// 文本
function chars(text: string) {
  //
}

// 注释
function comment(text: string) {
  //
}

export function parse(html: string) {
  const stack: any[] = []

  console.log('html => ', html)
  let index = 0
  let last
  let lastTag = ''
  while (html) {
    let textEnd = html.indexOf('<')
    if (textEnd === 0) {
      // 注释 <!--  -->
      if (startComment.test(html)) {
        const commentEnd = html.indexOf('-->')
        if (commentEnd >= 0) {
          comment(html.substring(4, commentEnd))
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
          !startComment.test(rest) &&
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
        chars(text)
      }
    }
    if (html === last) {
      chars(html)
      break
    }
    break
  }

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

    if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
      parseEndTag(lastTag)
    }
    if (isIgnoreNewlineTag(tagName) && lastTag === tagName) {
      parseEndTag(tagName)
    }

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

    start(tagName, attrs, unary, match.start, match.end)
  }

  function parseEndTag(tagName: string, startIndex?: number, endIndex?: number) {
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
