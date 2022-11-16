export const path = {
  /**
   * 传入文件名，获取扩展名。 获取不到的情况下返回空字符串
   * @param filename
   * @returns
   */
  extname: (filename: string) => {
    const list = filename.split('.')
    if (list.length < 1) {
      return ''
    }
    return list.at(-1) ?? ''
  },
}

export function filesizeFomatter(filesize: number, decimalPlaces = 2) {
  const sizedict = {
    b: 1,
    kb: 1 << 10,
    mb: 1 << 20,
    gb: 1 << 30,
    tb: Math.pow(1024, 4),
    pb: Math.pow(1024, 5),
  }
  type SizeUnit = keyof typeof sizedict
  let unit: Uppercase<SizeUnit> = 'B'
  if (filesize >= sizedict.pb) {
    unit = 'PB'
  } else if (filesize >= sizedict.tb) {
    unit = 'TB'
  } else if (filesize >= sizedict.gb) {
    unit = 'GB'
  } else if (filesize >= sizedict.mb) {
    unit = 'MB'
  } else if (filesize >= sizedict.kb) {
    unit = 'KB'
  } else {
    unit = 'B'
  }
  return (filesize / sizedict[unit.toLowerCase() as SizeUnit]).toFixed() + unit
}
