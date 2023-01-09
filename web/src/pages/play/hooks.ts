import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getServerStaticUrl } from '../../config'
import Player from 'nplayer'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  setCurrentFileItemAction,
  setPlaylistAction,
  setSubtitleOptionsAction,
} from '../../store/reducer/playReducer'
import { FileItem } from '../../api'
import { isDanmaku, isSubtitle, isVideo, path } from '../../util/util'
let player: Player
export function useSetupHook() {
  const location = useLocation()
  const playerRef = useRef<HTMLDivElement>(null)
  const playerContainerRef = useRef(null)
  const dispatch = useAppDispatch()
  const { playlist } = useAppSelector((state) => state.play)

  const loadPlayer = () => {
    const {
      fileItem,
      fileList,
    }: {
      fileItem: FileItem
      fileList: FileItem[]
    } = location.state
    const videoLink = getServerStaticUrl(fileItem.link)
    const files = fileList.filter((item) => {
      return !item.isFolder
    })
    const videoList = files.filter((item) => {
      return isVideo(item.name)
    })
    dispatch(setCurrentFileItemAction(fileItem))
    dispatch(setPlaylistAction(videoList))
    loadSubtitles(files, fileItem)
    player = new Player({
      src: videoLink,
    })
    if (playerRef.current) {
      player.mount(playerRef.current)
      // player.video.addTextTrack()
    }
  }
  function loadSubtitles(fileList: FileItem[], currentItem: FileItem) {
    console.log({ fileList })
    const danmakuList = fileList.filter((item) => {
      return isDanmaku(item.name)
    })
    const subtitleList = fileList.filter((item) => {
      return isSubtitle(item.name)
    })
    const currentIndex = playlist.findIndex((item) => {
      return item.path === currentItem.path
    })
    const currentDanmaku = chooseSubtitle(
      danmakuList,
      currentItem,
      currentIndex,
      playlist,
    )
    const currentSubtitle = chooseSubtitle(
      subtitleList,
      currentItem,
      currentIndex,
      playlist,
    )
    dispatch(
      setSubtitleOptionsAction({
        danmakuList,
        subtitleList,
        currentDanmaku,
        currentSubtitle,
      }),
    )
  }
  // 选择字幕的逻辑
  function chooseSubtitle(
    sublist: FileItem[],
    currentFile: FileItem,
    currentIndex: number,
    videoList: FileItem[],
  ): FileItem {
    const baseName = path.basename(currentFile.name)

    // 先按照名字匹配选择
    const nameMatchedList = sublist.filter((item) => {
      return item.name.startsWith(baseName)
    })
    if (nameMatchedList.length > 0) {
      return nameMatchedList[0]
    }
    // 名字不匹配的情况，按照顺序匹配
    // 有简繁等多个文件的情况，字幕文件会比视频文件多
    if (sublist.length > videoList.length) {
      return sublist[currentIndex * 2]
    }
    //其他默认是一对一匹配的情况
    return sublist?.[currentIndex]
  }
  // 切换播放列表
  const handleChangeSet = (item: FileItem) => {
    player.video.src = getServerStaticUrl(item.link)
    dispatch(setCurrentFileItemAction(item))
    player.play()
  }
  const handleChangeTabs = (key: string) => {
    console.log(key)
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
    handleChangeTabs,
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
    // const screenHeight = window.screen.height
    const innerHeight = window.innerHeight
    const innerWidth = window.innerWidth
    // const aspectRadio = defaultSize.width / defaultSize.height
    //  计算宽和高缩小的比例，按照比例低的那个作为基准值
    const widthScale = innerWidth / screenWidth
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
          width: innerWidth < 1700 ? newWidth : defaultSize.width,
          height: newHeight,
        })

        setNewSize({
          width: innerWidth < 1700 ? newWidth : defaultSize.width,
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
