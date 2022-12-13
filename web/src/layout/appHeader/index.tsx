import { QrcodeOutlined } from '@ant-design/icons'
import { Popover, Row } from 'antd'
import { QRCodeSVG } from 'qrcode.react'
import { useAppSelector } from '../../store/hooks'

export default function AppHeader() {
  const { serverInfo } = useAppSelector((state) => state.server)
  return (
    <Row justify={'space-between'}>
      <Popover
        overlayClassName="w-[150px]"
        content={
          <Row justify={'center'}>
            <QRCodeSVG
              value={`http://${serverInfo.localIpList?.[1]}:${serverInfo.port}`}
            />
          </Row>
        }
        title="扫码访问"
      >
        <QrcodeOutlined className="cursor-pointer text-xl text-white mr-2" />
        <span className="text-[20px]  text-white cursor-pointer">
          文件服务器
        </span>
      </Popover>
    </Row>
  )
}
