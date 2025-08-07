package com.sboot.moabayo.jwt;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.security.Key;
import java.util.Date;
import io.jsonwebtoken.security.Keys;

public class JwtGenerate {
	// 비밀 키 생성 ( HS256용 랜덤키)
	private static final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
	// 토큰 만료 시간 : 10분
	private static final long EXPIRATION_TIME = 1000 * 60 * 10; //10분
	//토큰 생성 메서드
	public static String createToken(String username) {
		return Jwts.builder().setSubject(username)
				.setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() 
				+ EXPIRATION_TIME))
				.signWith(key) 
				.compact();
	}
	
	public static Key getKey() {
		return key;
	}

}
/**															인증키 == 서명키
   SignatureAlgorithm.HS256 는 sha256 > hash -based message authentication code
    ==> sha256 + salt 						=== sha256 + secret key (hmac sha256)
 */
 