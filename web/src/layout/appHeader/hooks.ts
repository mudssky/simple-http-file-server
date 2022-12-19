import { Form, message } from 'antd'
import { userInfo } from 'os'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LOGIN, LoginRes } from '../../api/user'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  setLoginModalOptionsAction,
  setUserInfoAction,
} from '../../store/reducer/userReducer'
import { encryptPassword } from '../../util/crypto'
import {
  delLocalStorage,
  getLocalstorage,
  setLocalstorage,
} from '../../util/localStorage'

export function useSetupHook() {
  const userState = useAppSelector((state) => state.user)
  const navigate = useNavigate()
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
  const handleLogoutClick = async () => {
    dispatch(setUserInfoAction(undefined))
    delLocalStorage('userInfo')
    window.location.reload()
  }
  const handleLoginSubmit = async () => {
    const formValuse = await loginForm.validateFields()
    console.log('formValuse', formValuse)
    dispatch(
      setLoginModalOptionsAction({
        ...loginModalOptions,
        confirmLoading: true,
      }),
    )
    const res = await LOGIN({
      username: formValuse.username,
      password: encryptPassword(formValuse.password),
    })
    if (res.code === 0) {
      dispatch(setUserInfoAction(res.data.userInfo))
      setLocalstorage('userInfo', res.data)
      dispatch(
        setLoginModalOptionsAction({
          open: false,
          confirmLoading: false,
        }),
      )
      setLocalstorage('userInfo', res.data)
      // const [header,payload]= decodeJWT(res.data.token)
      // console.log('deocde:', decodeJWT(res.data.token))
    } else {
      message.error(res.msg)
    }
  }
  const loadUserInfo = () => {
    const userInfo = getLocalstorage('userInfo') as LoginRes | null
    if (userInfo) {
      dispatch(setUserInfoAction(userInfo.userInfo))
    }
  }
  useEffect(() => {
    loadUserInfo()
  }, [])

  return {
    loginForm,
    cancelLoginModal,
    handleLoginSubmit,
    showLoginModal,
    handleLogoutClick,
  }
}
