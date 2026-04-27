// src/libs/xxLib.d.ts
declare module '@/libs/xxLib' {
  // 根据实际导出内容编写类型
  export const someFunction: () => void
  export const xxText: any
  // 如果不知道具体类型，可以暂时用 any
  const content: any
  export default content
}
