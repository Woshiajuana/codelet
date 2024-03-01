export type ASTAttr = {
  name: string
  value: any
  dynamic?: boolean
  start?: number
  end?: number
}

export type ASTNode = ASTElement | ASTText | ASTExpression

export interface ASTElement {
  type: 1
  tag: string
  attrsList: ASTAttr[]
  attrsMap: { [key: string]: any }
  parent: ASTElement | void
  children: ASTNode[]

  start?: number
  end?: number

  text?: string

  [key: string]: any
}

export type ASTText = {
  type: 3
  text: string
  static?: boolean
  isComment?: boolean
  // 2.4 ssr optimization
  ssrOptimizability?: number
  start?: number
  end?: number
}

export type ASTExpression = {
  type: 2
  expression: string
  text: string
  tokens: Array<string | Object>
  static?: boolean
  // 2.4 ssr optimization
  ssrOptimizability?: number
  start?: number
  end?: number
}
