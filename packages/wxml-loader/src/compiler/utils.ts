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
