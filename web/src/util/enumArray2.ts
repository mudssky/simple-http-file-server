// 枚举类型接口
export interface EnumArrayObj {
  value: number | string
  label: string
}

export class EnumArray<
  T extends readonly EnumArrayObj[],
> extends Array<EnumArrayObj> {
  constructor(list: T) {
    super(...list)
  }
}
export const sexEnum = Object.freeze(
  new EnumArray([
    {
      label: '男',
      value: '1',
    },
    {
      label: '女',
      value: '2',
    },
  ] as const),
)
console.log(
  'test enum filter',
  sexEnum.filter((item) => {
    return item.label === '女'
  }),
) //TypeError: Spread syntax requires ...iterable[Symbol.iterator] to be a function
