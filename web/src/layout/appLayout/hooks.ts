import { useEffect } from 'react'
import { GET_SERVER_INFO } from '../../api/server'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setServerInfoAction } from '../../store/reducer/serverReducer'

export function useSetupHook() {
  const state = useAppSelector((state) => state.home)
  const dispatch = useAppDispatch()

  const getServerInfo = async () => {
    const res = await GET_SERVER_INFO()
    if (res.code === 0) {
      dispatch(setServerInfoAction(res.data))
    }
  }
  useEffect(() => {
    getServerInfo()
  }, [])
}
