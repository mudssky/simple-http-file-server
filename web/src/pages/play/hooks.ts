import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getServerStaticUrl } from '../../config'
import Player from 'nplayer'
import { useAppDispatch } from '../../store/hooks'
import {
  setCurrentFileitemAction,
  setPlaylistAction,
} from '../../store/reducer/playReducer'
import { FileItem } from '../../api'
let player: Player
export function useSetupHook() {
  const location = useLocation()
  const playerRef = useRef<HTMLDivElement>(null!)
  const playerContainerRef = useRef(null)
  const dispatch = useAppDispatch()
  // const { currentFileitem, playlist } = useAppSelector((state) => state.play)

  const loadPlayer = () => {
    const { fileitem, filelist } = location.state
    const videoLink = getServerStaticUrl(fileitem.link)
    dispatch(setCurrentFileitemAction(fileitem))
    dispatch(setPlaylistAction(filelist))
    player = new Player({
      src: videoLink,
    })
    if (playerRef.current) {
      player.mount(playerRef.current)
    }
  }
  // 切换播放列表
  const handleChangeSet = (item: FileItem) => {
    player.video.src = getServerStaticUrl(item.link)
    dispatch(setCurrentFileitemAction(item))
    player.play()
  }
  useEffect(() => {
    loadPlayer()
    return () => {
      player.dispose()
    }
  }, [])
  const { newSize } = useWindowAutoSizeHook(playerContainerRef.current, {
    defaultSize: {
      width: 1280,
      height: 720,
    },
    minSize: {
      width: 640,
      height: 360,
    },
  })
  return {
    player,
    playerRef,
    playerContainerRef,
    newSize,
    handleChangeSet,
  }
}
// 根据窗口大小，缩放播放器大小的逻辑
export const useWindowAutoSizeHook = (
  container: Element | null,
  options: {
    defaultSize: {
      width: number
      height: number
    }
    minSize: {
      width: number
      height: number
    }
  },
) => {
  const { defaultSize, minSize } = options
  const [newSize, setNewSize] = useState(defaultSize)
  window.onresize = () => {
    const screenWidth = window.screen.width
    const screenHeight = window.screen.height
    const innerHeight = window.innerHeight
    const innterWidth = window.innerWidth
    // const aspectRadio = defaultSize.width / defaultSize.height
    //  计算宽和高缩小的比例，按照比例低的那个作为基准值
    const widthScale = innterWidth / screenWidth
    const heightScale = innerHeight / window.outerHeight

    const aspectRadio = defaultSize.width / defaultSize.height
    if (widthScale >= 1 && heightScale >= 1) {
      setNewSize(defaultSize)
    } else {
      if (widthScale < heightScale) {
        // 宽度缩小更多的情况，按照宽度计算高度
        // console.log('width small')
        const tempWidth = defaultSize.width * widthScale
        const newWidth = tempWidth < minSize.width ? minSize.width : tempWidth
        const newHeight = newWidth / aspectRadio
        console.log({
          width: innterWidth < 1700 ? newWidth : defaultSize.width,
          height: newHeight,
        })

        setNewSize({
          width: innterWidth < 1700 ? newWidth : defaultSize.width,
          height: innerHeight < 900 ? newHeight : defaultSize.height,
        })
      } else {
        console.log('height small')
        // 高度缩小更多的情况，按照高度计算宽度
        const tempHeight = defaultSize.height * heightScale
        const newHeight =
          tempHeight < minSize.height ? minSize.height : tempHeight
        const newWidth = newHeight * aspectRadio

        setNewSize({
          width: newWidth,
          height: newHeight,
        })
      }
    }
  }

  return {
    newSize,
  }
}