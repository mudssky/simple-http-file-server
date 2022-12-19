import CryptoJS from 'crypto-js'
import bcrypt from 'bcryptjs'
export function decodeJWT(token: string): [header: object, payload: object] {
  const jwtList = token.split('.')
  if (jwtList.length !== 3) {
    throw new Error(`unexpected token: ${token}`)
  }
  console.log('jwt list', jwtList)

  return jwtList.slice(0, 2).map((tokenpart: string) => {
    // return JSON.parse(window.atob(tokenpart))
    return JSON.parse(
      CryptoJS.enc.Base64.parse(tokenpart).toString(CryptoJS.enc.Utf8),
    )
  }) as [header: object, payload: object]
}

/**
 * 哈希加密，防止密码的明文在http传输的过程泄露
 */
export function encryptPassword(password: string) {
  const salt = bcrypt.genSaltSync(10)
  return bcrypt.hashSync(password, salt)
}
