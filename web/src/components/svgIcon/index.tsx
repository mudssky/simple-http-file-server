import { useMemo } from 'react'

interface SvgIconProps extends React.SVGProps<SVGSVGElement> {
  prefix?: string
  name: string
  color?: string
  size?: number | string
}

export default function SvgIcon(props: SvgIconProps) {
  const { prefix = 'icon', name, color, size = 16, ...restProps } = props
  const symbolId = useMemo(() => `#${prefix}-${name}`, [prefix, name])
  return (
    <svg
      aria-hidden='true'
      width={size}
      height={size}
      fill={color}
      {...restProps}
    >
      <title>{name}</title>
      <use href={symbolId} fill={color} />
    </svg>
  )
}
