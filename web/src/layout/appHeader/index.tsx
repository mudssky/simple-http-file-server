import { QrcodeOutlined } from '@ant-design/icons'
import { Button, Popover, Row, Form, Input, Modal } from 'antd'

import { QRCodeSVG } from 'qrcode.react'

import { useAppSelector } from '../../store/hooks'
import { useSetupHook } from './hooks'

export default function AppHeader() {
  const { serverInfo } = useAppSelector((state) => state.server)
  const userState = useAppSelector((state) => state.user)
  const { loginModalOptions } = userState
  const { loginForm, cancelLoginModal, handleLoginSubmit, showLoginModal } =
    useSetupHook()
  return (
    <div>
      <Row justify={'space-between'} align="middle">
        <Popover
          overlayClassName="w-[150px]"
          content={
            <Row justify={'center'}>
              <QRCodeSVG
                // 开发环境地址设置
                value={
                  import.meta.env.DEV
                    ? `http://${serverInfo.localIpList?.[1]}:${
                        import.meta.env.VITE_PORT
                      }`
                    : `http://${serverInfo.localIpList?.[1]}:${serverInfo.port}`
                }
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
        <Button onClick={showLoginModal}>登录</Button>
      </Row>
      <Modal
        title="用户登录"
        open={loginModalOptions.open}
        onCancel={cancelLoginModal}
        onOk={handleLoginSubmit}
      >
        <Form form={loginForm} layout='vertical'>
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
