export interface ASTElement {
  type: 1 | 3
  tag?: string
  attrsList?: any[]
  parent?: ASTElement
  children: ASTElement[]
  [key: string]: any
}
