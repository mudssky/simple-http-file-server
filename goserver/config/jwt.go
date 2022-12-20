package config

import (
	"github.com/golang-jwt/jwt"
)

type JWT struct {
	Secret  string `json:"secret" yaml:"secret"`
	Expires int    `json:"expires" yaml:"expires"`
}

type CustomClaims struct {
	Username string `json:"username" yaml:"username"`
	jwt.StandardClaims
}

type JwtMap struct {
	Username string `json:"username"`
}

// jwt 官方规定的可选字段
// iss (issuer): 签发人
// exp (expiration time): 过期时间
// sub (subject): 主题
// aud (audience): 受众
// nbf (Not Before): 生效时间
// iat (Issued At): 签发时间
// jti (JWT ID): 编号

func (j *JWT) GenJwtToken(cc CustomClaims) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, cc)
	// Sign and get the complete encoded token as a string using the secret
	tokenString, err := token.SignedString([]byte(j.Secret))
	if err != nil {
		return "", err
	}
	return tokenString, nil
}
