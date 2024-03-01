export function makeMap(str: string, expectsLowerCase?: boolean) {
  const map = Object.create(null)
  const list = str.split(',')
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true
  }
  return expectsLowerCase ? (val: string) => !!map[val.toLowerCase()] : (val: string) => !!map[val]
}

export const isIgnoreNewlineTag = makeMap('pre,textarea', true)

export const shouldIgnoreFirstNewline = function (tag: string, html: string) {
  return tag && isIgnoreNewlineTag(tag) && html[0] === '\n'
}

export const isNonPhrasingTag = makeMap(
  'address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' +
    'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' +
    'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' +
    'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' +
    'title,tr,track',
)

export const isUnaryTag = makeMap(
  'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' + 'link,meta,param,source,track,wbr',
)

export let IS_REGEX_CAPTURING_BROKEN = false
'x'.replace(/x(.)?/g, function (m, g) {
  IS_REGEX_CAPTURING_BROKEN = g === ''
  return m
})

export function makeAttrsMap(attrs: Array<Record<string, any>>): Record<string, any> {
  const map: Record<string, any> = {}
  for (let i = 0, l = attrs.length; i < l; i++) {
    if (map[attrs[i].name]) {
      console.warn('duplicate attribute: ' + attrs[i].name, attrs[i])
    }
    map[attrs[i].name] = attrs[i].value
  }
  return map
}
