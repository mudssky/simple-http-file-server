import { ModalProps } from 'antd'

export interface ModalOptions extends ModalProps {
  open: boolean
  confirmLoading: boolean
}
export const DefaultModalOptions: ModalOptions = {
  open: false,
  confirmLoading: false,
}
