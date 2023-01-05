import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getServerStaticUrl } from '../../config'
import Player from 'nplayer'
import { useAppDispatch } from '../../store/hooks'
import {
  setCurrentFileitemAction,
  setPlaylistAction,
} from '../../store/reducer/playReducer'
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
      // player.on('UpdateSize', () => {
      //   console.log(player)
      // })
      // const resizeObserver = new ResizeObserver((entries) => {
      //   console.log({ entries })

      //   // for (let entry of entries) {
      //   //   console.log(entry.target.offsetWidth)
      //   // }
      // })
      // resizeObserver.observe(playerRef.current)
    }
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
  }
}

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
export const useAutoSizeHook = (
  container: Element | null,
  options: {
    defaultSize: {
      width: number
      height: number
    }
  },
) => {
  const { defaultSize } = options
  const [newSize, setNewSize] = useState(defaultSize)
  const resizeObserver = new ResizeObserver((entries) => {
    // console.log({ entries })
    const containerHeight = entries[0].borderBoxSize[0].blockSize
    const containerWidth = entries[0].borderBoxSize[0].inlineSize

    const aspectRadio = defaultSize.width / defaultSize.height
    //  计算宽和高缩小的比例，按照比例低的那个作为基准值
    const widthScale = containerWidth / defaultSize.width
    const heightScale = containerHeight / defaultSize.height
    if (widthScale >= 1 && heightScale >= 1) {
      setNewSize(defaultSize)
    } else {
      if (widthScale < heightScale) {
        // 宽度缩小更多的情况，按照宽度计算高度
        setNewSize({
          width: containerWidth,
          height: containerWidth / aspectRadio,
        })
      } else {
        // 高度缩小更多的情况，按照高度计算宽度
        setNewSize({
          width: containerHeight * aspectRadio,
          height: containerHeight,
        })
      }
    }
  })
  if (container) {
    resizeObserver.observe(container)
  }

  useEffect(() => {
    return () => {
      if (container) {
        resizeObserver.unobserve(container)
      }
    }
  }, [])

  return {
    newSize,
  }
}

export const useNplayerAutoSize = (
  player: Player,
  options: {
    maxHeight: number
    minHeight: number
    maxWidth: number
    minWidth: number
    aspectRatio: number //宽高比
  },
) => {
  const [size, setSize] = useState({
    width: 1280,
    height: 720,
  })
  const { maxHeight, maxWidth, minHeight, minWidth, aspectRatio } = options

  player.on('UpdateSize', () => {
    const width = player.rect.width
    const height = player.rect.height
    // 以宽度为基准
    const needHeight = width / aspectRatio

    if (needHeight > height) {
      setSize({
        width: (height * 9) / 16,
        height: height,
      })
    }

    // setSize({
    //   width: width,
    //   height: needHeight,
    // })

    // if (width >= maxWidth && height >= maxHeight) {
    //   setSize({
    //     width: maxWidth,
    //     height: maxHeight,
    //   })
    // } else if (width < maxWidth && height >= maxHeight) {
    //   setSize({
    //     width: width,
    //     height: (width * 9) / 16,
    //   })
    // }else if (height < maxHeight&&width>=maxWidth ) {
    //   setSize({
    //     width: height*16/9,
    //     height:height,
    //   })
    // }else{
    //   // height<maxHeight&&width<maxWidth
    // }

    // // 宽度增大和高度缩小的情况的情况
    // if (needHeight > height) {

    //   if (width > maxWidth) {
    //       setSize({
    //     width: width,
    //     height: needHeight,
    //   })
    //   }

    // } else {
    //   // 宽度需要调整的情况
    // }
  })
  return { size }
}
