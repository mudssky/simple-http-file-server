import { EnumArray } from './enumArray'
import { test, expect } from 'vitest'
test('EnumArray should be able to retrieve values by label or value', () => {
  const enumArray = new EnumArray([
    { value: 1, label: 'One' },
    { value: 2, label: 'Two' },
    { value: 3, label: 'Three' },
  ] as const)
  // console.log({ enumArray })

  expect(enumArray.getValueByLabel('One')).toBe(1)
  expect(enumArray.getValueByLabel('Two')).toBe(2)
  expect(enumArray.getValueByLabel('Three')).toBe(3)
  expect(enumArray.getDisplayTextByLabel('One')).toBe('One')
  expect(enumArray.getDisplayTextByLabel('Two')).toBe('Two')
  expect(enumArray.getDisplayTextByLabel('Three')).toBe('Three')

  expect(
    enumArray.filter((item) => {
      // console.log({ item })
      return item.label === 'One'
    })?.[0].value,
  ).toBe(1)
  // new Array()
})

export {}
