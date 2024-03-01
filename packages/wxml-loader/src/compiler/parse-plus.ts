import type { ASTAttr, ASTElement } from './types'
import { parseHtml } from './html-parser.js'
import { makeAttrsMap } from './utils.js'

export function createASTElement(
  tag: string,
  attrs: Array<ASTAttr>,
  parent: ASTElement | void
): ASTElement {
  return {
    type: 1,
    tag,
    attrsList: attrs,
    attrsMap: makeAttrsMap(attrs),
    rawAttrsMap: {},
    parent,
    children: []
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
