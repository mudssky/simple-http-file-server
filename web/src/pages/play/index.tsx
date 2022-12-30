import { useAppSelector } from '../../store/hooks'
import { useSetupHook } from './hooks'

export default function Play() {
  const { playerRef } = useSetupHook()
  const { currentFileitem, playlist } = useAppSelector((state) => state.play)
  return (
    <div className='flex justify-center'>
      <div className='flex h-[720px] mt-[20px]'>
        <div className='inline-block w-[1280px]' ref={playerRef} />
        <div className='ml-[20px] w-[402px] max-h-full overflow-y-auto border border-solid rounded border-red-400  '>
          <div>播放列表 {currentFileitem?.path}</div>
          {playlist.map((item) => {
            return (
              <div
                key={item.path}
                className='px-[5px] py-[10px] hover:bg-fuchsia-600 cursor-pointer'
              >
                {item.name}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
