import { CheckOutlined, PlayCircleOutlined } from '@ant-design/icons'
import Tabs from 'antd/es/tabs'
import { useAppSelector } from '../../store/hooks'
import { useSetupHook } from './hooks'
import styles from './styles.module.scss'

export default function Play() {
  const {
    playerRef,
    playerContainerRef,
    newSize,
    playlist,
    subtitleList,
    danmakuList,
    handleChangeSet,
    handleChangeTabs,
    loadDanmaku,
    loadSubtitle,
  } = useSetupHook()
  const { currentFileItem: currentVideo, subtitleOptions } = useAppSelector(
    (state) => state.play,
  )
  return (
    <div>
      <div className="flex justify-center">
        <div
          style={{
            height: `${newSize.height}px`,
          }}
          className="flex  mt-[20px] max-h-[720px] min-h-[360px] "
        >
          <div
            ref={playerContainerRef}
            className="flex-grow max-w-[1280px] min-w-[640px]"
          >
            <div
              style={{
                width: `${newSize.width}px`,
              }}
              className=" h-full"
              ref={playerRef}
            />
          </div>
          <div className="flex flex-col   ml-[20px] w-[402px]  border border-solid rounded-2xl border-gray-300 overflow-hidden">
            <div className="bg-white p-4">播放列表 {currentVideo?.path}</div>
            <div
              className={` bg-gray-100 overflow-y-auto ${styles['playlist']}`}
            >
              {playlist.map((item) => {
                return (
                  <div
                    key={item.path}
                    className={`px-[10px] py-[10px] h-12  cursor-pointer break-all ${
                      item.path === currentVideo?.path
                        ? 'bg-slate-400'
                        : 'hover:bg-gray-200'
                    }`}
                    onClick={() => handleChangeSet(item)}
                  >
                    <PlayCircleOutlined />
                    <span title={item.name}> {item.name}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <div
          style={{
            width: `${newSize.width + 422}px`,
          }}
        >
          <div className="text-lg mt-10">字幕列表</div>
          <Tabs
            defaultActiveKey="1"
            onChange={handleChangeTabs}
            items={[
              {
                label: '字幕',
                key: '1',
                children: (
                  <ul className="bg-[#f4f4f4] p-2 h-[400px] overflow-y-auto">
                    {subtitleList.map((item) => {
                      return (
                        <li
                          onClick={() => loadSubtitle(item)}
                          key={item.path}
                          className={`${
                            subtitleOptions.currentSubtitle?.name === item.name
                              ? 'bg-white'
                              : ''
                          } hover:bg-white p-2 cursor-pointer my-2 rounded-sm`}
                        >
                          {subtitleOptions.currentSubtitle?.name ===
                          item.name ? (
                            <CheckOutlined className="text-blue-400" />
                          ) : null}{' '}
                          <span>{item.name}</span>
                        </li>
                      )
                    })}
                  </ul>
                ),
              },
              {
                label: '弹幕',
                key: '2',
                children: (
                  <ul className="bg-[#f4f4f4] p-2 h-[400px] overflow-y-auto">
                    {danmakuList.map((item) => {
                      return (
                        <li
                          key={item.path}
                          className={`${
                            subtitleOptions.currentDanmaku?.name === item.name
                              ? 'bg-white'
                              : ''
                          } hover:bg-white p-2 cursor-pointer my-2 rounded-sm`}
                          onClick={() => loadDanmaku(item)}
                        >
                          {subtitleOptions.currentDanmaku?.name ===
                          item.name ? (
                            <CheckOutlined className="text-blue-400" />
                          ) : null}{' '}
                          <span>{item.name}</span>
                        </li>
                      )
                    })}
                  </ul>
                ),
              },
            ]}
          />
        </div>
      </div>
    </div>
  )
}
