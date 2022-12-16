import { Form } from 'antd'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setLoginModalOptionsAction } from '../../store/reducer/userReducer'

export function useSetupHook() {
  const userState = useAppSelector((state) => state.user)
  const { loginModalOptions } = userState
  const dispatch = useAppDispatch()
  const [loginForm] = Form.useForm()
  const cancelLoginModal = () => {
    dispatch(
      setLoginModalOptionsAction({
        ...loginModalOptions,
        open: false,
      }),
    )
  }
  const showLoginModal = () => {
    dispatch(
      setLoginModalOptionsAction({
        ...loginModalOptions,
        open: true,
      }),
    )
  }
  const handleLoginSubmit = async () => {
    const formValuse = await loginForm.validateFields()
    console.log('formValuse', formValuse)
  }

  return {
    loginForm,
    cancelLoginModal,
    handleLoginSubmit,
    showLoginModal,
  }
}
