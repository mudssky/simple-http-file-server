import SvgIcon from '../svgIcon'
type FileExt =
  | 'txt'
  | 'png'
  | 'epub'
  | 'xlxs'
  // 视频格式
  | 'mp4'
  | 'mkv'
  | 'webm'
  // 压缩文件格式
  | 'zip'
  | '7z'
  | 'rar'
  | 'tar'
  // 图片格式
  | 'webp'
  | 'jpg'
  | 'jpeg'
  | 'png'
  | 'bmp'

  // 音频格式
  | 'm4a'
  | 'flac'
  | 'wav'
  | 'mp3'
  | 'ape'

interface Props {
  ext: string
  isFolder: boolean
}
// prettier-ignore

const fileTypeFolder = 'filetype'
const convertIconDict = (extArr: FileExt[], str: string) => {
  const res: any = {}
  extArr.forEach((key) => {
    res[key] = str
  })
  return res
}
const getIcon = (params: Props) => {
  const { isFolder, ext } = params
  if (isFolder) {
    return <SvgIcon name={'filetype-folder'}></SvgIcon>
  }

  const iconDict: {
    [key in FileExt]: string
  } = {
    rar: `${fileTypeFolder}-compress`,
    zip: `${fileTypeFolder}-compress`,
    '7z': `${fileTypeFolder}-compress`,
    tar: `${fileTypeFolder}-compress`,
    xlxs: `${fileTypeFolder}-excel`,
    ppt: `${fileTypeFolder}-ppt`,
    ...convertIconDict(
      ['mp3', 'm4a', 'flac', 'wav', 'ape'],
      `${fileTypeFolder}-audio`
    ),
    pdf: `${fileTypeFolder}-pdf`,
    txt: `${fileTypeFolder}-txt`,
    ...convertIconDict(['mp4', 'mkv', 'webm'], `${fileTypeFolder}-video`),
    doc: `${fileTypeFolder}-word`,
    docx: `${fileTypeFolder}-word`,
    ...convertIconDict(
      ['webp', 'jpg', 'jpeg', 'png', 'bmp'],
      `${fileTypeFolder}-picture`
    ),
  }
  if (ext in iconDict) {
    return <SvgIcon name={iconDict[ext as FileExt]}></SvgIcon>
  }
  return <SvgIcon name="filetype-unknown"></SvgIcon>
}
export default function FileIcon(props: Props) {
  const { isFolder = false, ext } = props
  return getIcon(props)
}
