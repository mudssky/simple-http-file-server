import { useEffect, useRef } from 'react'
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
  const playerRef = useRef<HTMLDivElement>(null)
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
  useEffect(() => {
    loadPlayer()
    return () => {
      player.dispose()
    }
  }, [])

  return {
    playerRef,
  }
}
