import request from '../request/request'

export type AudioInfoRes = {
  name: string
  lastModTime: number
  path: string
  isFolder: boolean
  size: number
  rootPath: string
  rootPathEncode: string
  link: string
  fileType: string
  format: string
  title: string
  album: string
  artist: string
  albumArtist: string
  composer: string
  genre: string
  year: number
  track: number
  trackTotal: number
  discNum: number
  discTotal: number
  cover: string
  lyrics: string
  comment: string
  raw: {
    acoustid_fingerprint: string
    acoustid_id: string
    album: string
    artist: string
    artist_credit: string
    artistsort: string
    bpm: string
    comment: string
    compilation: string
    date: string
    disc: string
    discc: string
    discnumber: string
    disctotal: string
    id: string
    lyrics: string
    musicbrainz_artistid: string
    musicbrainz_trackid: string
    originaldate: string
    title: string
    totaldiscs: string
    totaltracks: string
    trackc: string
    tracknumber: string
    tracktotal: string
    vendor: string
  }
}

/**
 * 获取对应路径文件的音频信息
 * @param data
 * @returns
 */
export const AUDIO_INFO = async (data: { path: string }) => {
  return request.post<AudioInfoRes>('/audio/audioInfo', data)
}
