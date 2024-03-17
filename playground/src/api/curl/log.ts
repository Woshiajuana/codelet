export const log = (config: any, ...args: any[]) => {
  const { url = '', baseURL = '', method, adapterName } = config
  console.log(
    `${url?.startsWith(`http`) ? url : baseURL + url}`,
    `[${adapterName}] [${method}]`,
    ...args,
  )
}
