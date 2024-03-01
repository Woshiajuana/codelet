import type { ASTAttr } from './types'
import { shouldIgnoreFirstNewline } from './utils.js'

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

const decodeMap = {
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&amp;': '&',
  '&#39;': "'",
}
const encodedRe = /&(?:lt|gt|quot|amp|#39);/g
function decode(value: any) {
  if (value != null) {
    return value.replace(encodedRe, function (match: any) {
      return (decodeMap as any)[match]
    })
  }
}

export interface HTMLParserOptions {
  start?: (tag: string, attrs: ASTAttr[], unary: boolean, start: number, end: number) => void
  end?: (tag: string, start: number, end: number) => void
  chars?: (text: string, start?: number, end?: number) => void
  comment?: (content: string, start: number, end: number) => void

  // 保留注释
  shouldKeepComment?: boolean

  warn?: Function // allow customizing warning in different environments; e.g. node
}

export function parseHtml(html: string, options: HTMLParserOptions) {
  const stack: any[] = []
  let index = 0
  let last
  while (html) {
    last = html
    let textEnd = html.indexOf('<')
    if (textEnd === 0) {
      // Comment:
      if (comment.test(html)) {
        const commentEnd = html.indexOf('-->')

        if (commentEnd >= 0) {
          if (options.shouldKeepComment && options.comment) {
            options.comment(html.substring(4, commentEnd), index, index + commentEnd + 3)
          }
          advance(commentEnd + 3)
          continue
        }
      }

      // https://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
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
        if (shouldIgnoreFirstNewline(startTagMatch.tagName, html)) {
          advance(1)
        }
        continue
      }
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
        if (next < 0) break
        textEnd += next
        rest = html.slice(textEnd)
      }
      text = html.substring(0, textEnd)
    }

    if (textEnd < 0) {
      text = html
    }

    if (text) {
      advance(text.length)
    }

    if (options.chars && text) {
      options.chars(text, index - text.length, index)
    }

    if (html === last) {
      options.chars && options.chars(html)
      if (!stack.length && options.warn) {
        options.warn(`Mal-formatted tag at end of template: "${html}"`, {
          start: index + html.length,
        })
      }
      break
    }
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
      let end: any, attr: any
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        attr.start = index
        advance(attr[0].length)
        attr.end = index
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

    const unary = !!unarySlash

    const l = match.attrs.length
    const attrs: ASTAttr[] = new Array(l)
    for (let i = 0; i < l; i++) {
      const args = match.attrs[i]
      let value
      for (const index of [3, 4, 5]) {
        if (args[index] != null) {
          value = args[index]
          break
        }
      }
      attrs[i] = {
        name: args[1],
        value: decode(value),
      }
    }

    if (!unary) {
      stack.push({
        tag: tagName,
        lowerCasedTag: tagName.toLowerCase(),
        attrs: attrs,
        start: match.start,
        end: match.end,
      })
    }

    if (options.start) {
      options.start(tagName, attrs, unary, match.start, match.end)
    }
  }

  function parseEndTag(tagName?: any, start?: any, end?: any) {
    let pos, lowerCasedTagName
    if (start == null) start = index
    if (end == null) end = index

    // Find the closest opened tag of the same type
    if (tagName) {
      lowerCasedTagName = tagName.toLowerCase()
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
          options.warn(`tag <${stack[i].tag}> has no matching end tag.`, {
            start: stack[i].start,
            end: stack[i].end,
          })
        }
        if (options.end) {
          options.end(stack[i].tag, start, end)
        }
      }

      // Remove the open elements from the stack
      stack.length = pos
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
