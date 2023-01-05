import { useAppSelector } from '../../store/hooks'
import { useSetupHook } from './hooks'
import styles from './styles.module.scss'

export default function Play() {
  const { player, playerRef, playerContainerRef, newSize } = useSetupHook()
  const { currentFileitem, playlist } = useAppSelector((state) => state.play)
  return (
    <div className='flex justify-center'>
      <div
        style={{
          height: `${newSize.height}px`,
        }}
        className='flex  mt-[20px] max-h-[720px] min-h-[360px] '
      >
        <div
          ref={playerContainerRef}
          className='flex-grow max-w-[1280px] min-w-[640px]'
        >
          <div
            style={{
              width: `${newSize.width}px`,
            }}
            className=' h-full'
            ref={playerRef}
          />
        </div>
        <div className='flex flex-col   ml-[20px] w-[402px]  border border-solid rounded-2xl border-gray-300 overflow-hidden'>
          <div className='bg-white p-4'>播放列表 {currentFileitem?.path}</div>
          <div className={` bg-gray-100 overflow-y-auto ${styles['playlist']}`}>
            {playlist.map((item) => {
              return (
                <div
                  key={item.path}
                  className='px-[10px] py-[10px] h-12 hover:bg-gray-200 cursor-pointer break-all'
                >
                  <span title={item.name}> {item.name}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
