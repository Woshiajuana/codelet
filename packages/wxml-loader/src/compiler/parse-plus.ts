import type { ASTAttr, ASTElement } from './types'
import { parseHtml } from './html-parser.js'
import { makeAttrsMap } from './utils.js'

export function createASTElement(
  tag: string,
  attrs: Array<ASTAttr>,
  parent: ASTElement | void,
): ASTElement {
  return {
    type: 1,
    tag,
    attrsList: attrs,
    attrsMap: makeAttrsMap(attrs),
    rawAttrsMap: {},
    parent,
    children: [],
  }
}

export function parsePlus(content: string) {
  const root = createASTElement('temp-node', [])
  let currentParent = root
  const stack: ASTElement[] = [root]

  parseHtml(content, {
    start(tag, attrs, unary, start, end) {
      const element = createASTElement(tag, attrs, currentParent)
      element.start = start
      element.end = end
      currentParent.children.push(element)

      if (!unary) {
        currentParent = element
        stack.push(element)
      } else {
        element.unary = true
      }
    },
    end(_, __, end) {
      const element = stack[stack.length - 1]
      element.end = end
      stack.length -= 1
      currentParent = stack[stack.length - 1]
    },
    // 文本节点
    chars(text, start?: number, end?: number) {
      const children = currentParent.children
      if (currentParent.tag !== 'text') {
        text = text.trim()
      }

      if (text) {
        if (text !== ' ' || !children.length || children[children.length - 1].text !== ' ') {
          children.push({
            type: 3,
            text,
            start,
            end,
          })
        }
      }
    },
    // 注释节点
    comment(text, start, end) {
      if (currentParent) {
        currentParent.children.push({
          type: 3,
          text,
          isComment: true,
          start,
          end,
        })
      }
    },
  })

  return root
}
