import {
  FullscreenExitOutlined,
  FullscreenOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
} from '@ant-design/icons'
import React from 'react'
import { useState } from 'react'
import { PhotoSlider } from 'react-photo-view'
import { IPhotoSliderProps } from 'react-photo-view/dist/PhotoSlider'
// export interface CustomPhotoViewerProps extends IPhotoSliderProps {}
export default function CustomPhotoViewer(props: IPhotoSliderProps) {
  const { ...restProps } = props
  const [isFullScreen, setisFullScreen] = useState(false)
  function toggleFullScreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      const element = document.querySelector('.PhotoView-Portal')
      if (element) {
        element.requestFullscreen()
      }
    }
  }
  React.useEffect(() => {
    document.onfullscreenchange = () => {
      setisFullScreen(Boolean(document.fullscreenElement))
    }
  }, [])
  return (
    <PhotoSlider
      // speed={() => 0}
      toolbarRender={({ onScale, scale, onRotate, rotate }) => {
        return (
          <div className='space-x-5'>
            <PlusCircleOutlined
              className='photo-viewer-toobar-item'
              // style={{
              //   fontSize: '24px',
              //   opacity: '.75',
              //   transition: 'opacity .2s linear',
              // }}
              onClick={() => onScale(scale + 1)}
            />
            <MinusCircleOutlined
              className='photo-viewer-toobar-item'
              onClick={() => onScale(scale - 1)}
            />
            <RotateLeftOutlined
              className='photo-viewer-toobar-item'
              onClick={() => onRotate(rotate - 90)}
            />
            <RotateRightOutlined
              className='photo-viewer-toobar-item'
              onClick={() => onRotate(rotate + 90)}
            />
            {isFullScreen ? (
              <FullscreenExitOutlined
                className='photo-viewer-toobar-item'
                onClick={toggleFullScreen}
              />
            ) : (
              <FullscreenOutlined
                className='photo-viewer-toobar-item'
                onClick={toggleFullScreen}
              />
            )}
          </div>
        )
      }}
      {...restProps}
    />
  )
}
