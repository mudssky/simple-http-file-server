import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getServerStaticUrl } from '../../config'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  setCurrentFileItemAction,
  setFileListAction,
  setSubtitleOptionsAction,
} from '../../store/reducer/playReducer'
import { FileItem } from '../../api'
import { isDanmaku, isSubtitle, isVideo, path } from '../../util/util'
import Artplayer from 'artplayer'
import artplayerPluginDanmuku from 'artplayer-plugin-danmuku'
let player: Artplayer
function getInfoLists(fileList: FileItem[]) {
  const playlist = fileList.filter((item) => {
    return isVideo(item.name)
  })
  const danmakuList = fileList.filter((item) => {
    return isDanmaku(item.name)
  })
  const subtitleList = fileList.filter((item) => {
    return isSubtitle(item.name)
  })
  return {
    playlist,
    danmakuList,
    subtitleList,
  }
}
export function useSetupHook() {
  const location = useLocation()
  const playerRef = useRef<HTMLDivElement>(null)
  const playerContainerRef = useRef(null)
  const dispatch = useAppDispatch()
  const { fileList, subtitleOptions, currentFileItem } = useAppSelector(
    (state) => state.play,
  )
  const { playlist, danmakuList, subtitleList } = useMemo(
    () => getInfoLists(fileList),
    [fileList],
  )
  const loadPlayer = async (options: {
    currentVideoItem: FileItem //当前播放的文件
    fileList: FileItem[] //整个播放列表，包括是视频格式以外的文件
  }) => {
    const { currentVideoItem, fileList } = options
    const videoLink = currentVideoItem.link
    const files = fileList.filter((item) => {
      return !item.isFolder
    })
    dispatch(setFileListAction(files))
    dispatch(setCurrentFileItemAction(currentVideoItem))

    player = new Artplayer({
      container: playerRef.current!,
      url: videoLink,
      title: 'unknown',
      volume: 0.5,
      autoplay: true,
      pip: true,
      autoSize: true,
      autoMini: true,
      screenshot: true,
      setting: true,
      flip: true,
      playbackRate: true,
      aspectRatio: true,
      fullscreen: true,
      fullscreenWeb: true,
      subtitleOffset: true,
      miniProgressBar: true,
      lang: navigator.language.toLowerCase(),
      whitelist: ['*'],
      moreVideoAttr: {
        crossOrigin: 'anonymous',
      },
      plugins: [
        artplayerPluginDanmuku({
          danmuku: '',
          speed: 5, // 弹幕持续时间，单位秒，范围在[1 ~ 10]
          opacity: 1, // 弹幕透明度，范围在[0 ~ 1]
          fontSize: 25, // 字体大小，支持数字和百分比
          color: '#FFFFFF', // 默认字体颜色
          mode: 0, // 默认模式，0-滚动，1-静止
          margin: [10, '25%'], // 弹幕上下边距，支持数字和百分比
          antiOverlap: true, // 是否防重叠
          useWorker: true, // 是否使用 web worker
          synchronousPlayback: false, // 是否同步到播放速度
          filter: (danmu) => danmu.text.length < 50, // 弹幕过滤函数，返回 true 则可以发送
          lockTime: 5, // 输入框锁定时间，单位秒，范围在[1 ~ 60]
          maxLength: 100, // 输入框最大可输入的字数，范围在[0 ~ 500]
          minWidth: 200, // 输入框最小宽度，范围在[0 ~ 500]，填 0 则为无限制
          maxWidth: 400, // 输入框最大宽度，范围在[0 ~ Infinity]，填 0 则为 100% 宽度
          theme: 'dark', // 输入框自定义挂载时的主题色，默认为 dark，可以选填亮色 light
          beforeEmit: (danmu) => !!danmu.text.trim(), // 发送弹幕前的自定义校验，返回 true 则可以发送
          // 通过 mount 选项可以自定义输入框挂载的位置，默认挂载于播放器底部，仅在当宽度小于最小值时生效
          // mount: document.querySelector('.artplayer-danmuku'),
        }),
      ],
      contextmenu: [
        {
          html: 'Custom menu',
          click: function (contextmenu) {
            console.info('You clicked on the custom menu')
            contextmenu.show = false
          },
        },
      ],
    })
    loadSubtitleAndDanmaku(files, currentVideoItem)
  }

  async function loadSubtitleAndDanmaku(
    fileList: FileItem[],
    currentItem: FileItem,
  ) {
    const { playlist, danmakuList, subtitleList } = getInfoLists(fileList)
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
    // console.log({ currentDanmaku, currentSubtitle, currentIndex, currentItem })
    loadSubtitle(currentSubtitle)
    loadDanmaku(currentDanmaku)
    dispatch(
      setSubtitleOptionsAction({
        currentDanmaku,
        currentSubtitle,
      }),
    )
    // return currentSubtitle
  }
  function loadDanmaku(currentDanmaku: FileItem) {
    player.plugins.artplayerPluginDanmuku.config({
      danmuku: getServerStaticUrl(currentDanmaku.link),
    })
    player.plugins.artplayerPluginDanmuku.load()
    dispatch(
      setSubtitleOptionsAction({
        ...subtitleOptions,
        currentDanmaku,
      }),
    )
  }
  function loadSubtitle(currentSubtitle: FileItem) {
    player.subtitle.switch(getServerStaticUrl(currentSubtitle.link))
    dispatch(
      setSubtitleOptionsAction({
        ...subtitleOptions,
        currentSubtitle,
      }),
    )
  }
  // 选择字幕的逻辑
  function chooseSubtitle(
    subList: FileItem[],
    currentFile: FileItem,
    currentIndex: number,
    videoList: FileItem[],
  ): FileItem {
    const baseName = path.basename(currentFile.name)

    // 先按照名字匹配选择
    const nameMatchedList = subList.filter((item) => {
      return item.name.startsWith(baseName)
    })
    if (nameMatchedList.length > 0) {
      return nameMatchedList[0]
    }
    // 名字不匹配的情况，按照顺序匹配
    // 有简繁等多个文件的情况，字幕文件会比视频文件多
    if (subList.length > videoList.length) {
      return subList[currentIndex * 2]
    }
    //其他默认是一对一匹配的情况
    return subList?.[currentIndex]
  }
  // 切换播放列表
  const handleChangeSet = (item: FileItem) => {
    player.video.src = getServerStaticUrl(item.link)
    loadSubtitleAndDanmaku(fileList, item)
    dispatch(setCurrentFileItemAction(item))
  }
  const handleChangeTabs = (key: string) => {
    // console.log(key)
  }
  useEffect(() => {
    if (location.state) {
      console.log('state', location.state)

      loadPlayer(location.state)
    }
    // else {
    //   console.log({ fileList, currentFileItem })

    //   loadPlayer({
    //     fileList,
    //     currentVideoItem: currentFileItem!,
    //   })
    // }

    return () => {
      player.destroy()
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
    playlist,
    danmakuList,
    subtitleList,
    handleChangeSet,
    handleChangeTabs,
    loadDanmaku,
    loadSubtitle,
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
        // console.log('height small')
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
