function stringifyAttr(val: any) {
  if (typeof val === 'string') {
    const hasSingle = val.indexOf("'") > -1
    const hasDouble = val.indexOf('"') > -1
    // 移除属性中换行
    val = val.replace(/\n/g, '')

    if (hasSingle && hasDouble) {
      val = val.replace(/'/g, '"')
    }
    if (hasDouble) {
      return `'${val}'`
    } else {
      return `"${val}"`
    }
  }
}
export function serialize(root: any) {
  function walk(node: any) {
    let result = ''
    if (node) {
      if (node.type === 3) {
        if (node.isComment) {
          result += '<!--' + node.text + '-->'
        } else {
          result += node.text
        }
      }
      if (node.type === 1) {
        if (node.tag !== 'temp-node') {
          result += '<' + node.tag
          node.attrsList.forEach(function (attr: any) {
            result += ' ' + attr.name
            const value = attr.value
            if (value != null) {
              result += '=' + stringifyAttr(value)
            }
          })
          if (node.unary) {
            result += '/>'
          } else {
            result += '>'
            node.children.forEach(function (child: any) {
              result += walk(child)
            })
            result += '</' + node.tag + '>'
          }
        } else {
          node.children.forEach(function (child: any) {
            result += walk(child)
          })
        }
      }
    }
    return result
  }

  return walk(root)
}
