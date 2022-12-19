package util

import (
	jwt "github.com/golang-jwt/jwt/v4"
	"github.com/mudssky/simple-http-file-server/goserver/config"
)

type JWT struct {
	Secret []byte
}

// var (
// 	TokenParseError = error.New
// )

func NewJWT(secret []byte) *JWT {
	return &JWT{
		Secret: secret,
	}
}

// 解析 token
func (j *JWT) ParseToken(tokenString string) (*config.CustomClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &config.CustomClaims{}, func(token *jwt.Token) (i interface{}, e error) {
		return j.Secret, nil
	})
	claims, ok := token.Claims.(*config.CustomClaims)
	if ok && token.Valid {
		return claims, nil
	}
	return nil, err
}
