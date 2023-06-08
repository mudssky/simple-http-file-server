// 枚举类型接口
export interface EnumArrayObj {
  value: number | string
  label: string //中文key，方便阅读
  displayText?: string //展示的文字
}
export type KeyType = 'label' | 'value'
export class EnumArray<
  T extends readonly EnumArrayObj[],
> extends Array<EnumArrayObj> {
  private readonly kvMap = new Map<string, EnumArrayObj['value']>()
  private readonly vkMap = new Map<string, EnumArrayObj['value']>()
  private innerList: EnumArrayObj[]
  constructor(list: T) {
    super(...list)
    this.innerList = [...list]
    list.forEach((item) => {
      this.kvMap.set(item.label, item.value)
      this.vkMap.set(`${item.value}`, item.label)
    })
  }

  getLabelByValue(value: T[number]['value']) {
    return this.vkMap.get(`${value}`)
  }
  getValueByLabel(label: T[number]['label']) {
    return this.kvMap.get(label)
  }
  getItemByLabel(label: T[number]['label']) {
    return this.innerList.filter((item) => {
      return item.label === label
    })?.[0]
  }
  getItemByValue(value: T[number]['value']) {
    return this.innerList.filter((item) => {
      return item.value === value
    })?.[0]
  }
  getDisplayTextByLabel(label: T[number]['label']) {
    const item = this.getItemByLabel(label)
    return item?.displayText ?? label
  }
  getDisplayTextByValue(value: T[number]['value']) {
    const item = this.getItemByValue(value)
    return item?.displayText ?? item.label
  }

  // *[Symbol.iterator]() {
  //   for (let i = 0; i < this.innerList.length; i++) {
  //     yield this.innerList[i]
  //   }
  // }
}

export const sexEnum = new EnumArray([
  {
    label: '男',
    value: '1',
  },
  {
    label: '女',
    value: '2',
  },
] as const)

console.log(
  'test enum filter',
  sexEnum.filter((item) => {
    return item.label === '男'
  }),
)
for (const ll of sexEnum) {
  console.log(ll.label)
}
