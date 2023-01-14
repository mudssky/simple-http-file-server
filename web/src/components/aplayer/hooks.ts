import { Props } from '.'
import APlayer from 'APlayer'
import 'APlayer/dist/APlayer.min.css'
import { useEffect } from 'react'
let ap: Aplayer
export default function useSetupHook(props: Props) {
  const { playlist } = props
  function InitAplayer() {
    // if (ap) {
    //   ap.destroy()
    // }
    // aplayer会对传入的属性修改
    // 这和react的理念冲突，react的核心是数据不可变，ref和state在被修改的时候都会报错，
    // 因此这边临时深拷贝一份给aplayer用于修改
    const tempPlaylist = JSON.parse(JSON.stringify(playlist))

    ap = new APlayer({
      container: document.getElementById('aplayer'),
      mini: false,
      autoplay: true, //自动播放
      theme: '#FADFA3',
      // loop: 'all',
      // order: 'random',
      // fixed: true,
      preload: 'auto',
      volume: 0.7,
      mutex: true,
      listFolded: false,
      listMaxHeight: 500,
      lrcType: 3,
      audio: tempPlaylist,
    })
  }
  useEffect(() => {
    if (playlist && playlist.length > 0) {
      InitAplayer()
    }

    return () => {
      ap?.destroy()
    }
  }, [playlist])
}
