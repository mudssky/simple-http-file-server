// 枚举类型接口
export interface EnumArrayObj {
  value: number | string
  label: string //中文key，方便阅读
  displayText?: string //展示的文字,只有和label不同的时候使用，
}

type ValueOf<T extends readonly EnumArrayObj[]> = T[number]['value']
type LabelOf<T extends readonly EnumArrayObj[]> = T[number]['label']
type ItemOf<T extends readonly EnumArrayObj[]> = {
  value: ValueOf<T>
  label: LabelOf<T>
  displayText?: string
}
/**
 * 枚举数组类，继承了Array
 */
export class EnumArray<
  T extends readonly EnumArrayObj[],
> extends Array<EnumArrayObj> {
  private readonly kvMap = new Map<string, ValueOf<T>>()
  private readonly vkMap = new Map<string, LabelOf<T>>()
  constructor(list: T) {
    super(list.length)
    for (let i = 0; i < list.length; i++) {
      const item = list[i]
      this[i] = item
      this.kvMap.set(item.label, item.value)
      this.vkMap.set(item.value + '', item.label)
    }
  }

  getLabelByValue(value: ValueOf<T>) {
    return this.vkMap.get(value + '')
  }

  getValueByLabel(label: LabelOf<T>) {
    return this.kvMap.get(label)
  }
  getItemByLabel(label: LabelOf<T>): ItemOf<T> | undefined {
    return this.find((item) => {
      return item.label === label
    })
  }
  getItemByValue(value: ValueOf<T>): ItemOf<T> | undefined {
    return this.find((item) => {
      return item.value === value
    })
  }
  getDisplayTextByLabel(label: LabelOf<T>) {
    const item = this.getItemByLabel(label)
    return item?.displayText ?? label
  }
  getDisplayTextByValue(value: ValueOf<T>) {
    const item = this.getItemByValue(value)
    return item?.displayText ?? item?.label
  }
}
export function createEnum<T extends readonly EnumArrayObj[]>(enums: T) {
  return Object.freeze(new EnumArray(enums))
}
const sexList = [
  {
    label: '男',
    value: 1,
  },
  {
    label: '女',
    value: 2,
  },
] as const
const sexEnum = createEnum(sexList)

export type ll = LabelOf<typeof sexList>
sexEnum.getValueByLabel('女')
