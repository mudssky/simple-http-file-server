import { AudioItem } from '../aplayer'

interface Props {
  audioList: AudioItem[]
}
export default function Mplayer(props: Props) {
  const { audioList } = props
  return (
    <div className="flex justify-start">
      <div className="w-[90px] h-[90px] bg-orange-100"></div>
      <div>
        {audioList.map((item) => {
          return <div key={item.url}>{item.name}</div>
        })}
      </div>
    </div>
  )
}
