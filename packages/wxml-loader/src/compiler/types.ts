export type ASTAttr = {
  name: string
  value: any
  dynamic?: boolean
  start?: number
  end?: number
}

export interface ASTElement {
  type: 1 | 3
  tag?: string
  attrsList?: any[]
  parent?: ASTElement
  children: ASTElement[]
  [key: string]: any
}
