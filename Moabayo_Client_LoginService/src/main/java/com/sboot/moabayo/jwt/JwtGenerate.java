package com.sboot.moabayo.jwt;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.UUID;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

public class JwtGenerate {
	
	

	
	private static final String SECRET = "ThisIsASecretKeyThatMustBeOver32Characters!";
	private static final Key key = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));


	// 토큰 만료 시간 : 10분
	/*
	 * private static final long ACCESS_EXPIRATION_TIME = 1000 * 60 * 10; // 10분
	 */	// 액세스 토큰 만료 시간 : 1분
	//private static final long ACCESS_EXPIRATION_TIME = 1000 * 60 * 1; // 1분
	private static final long ACCESS_EXPIRATION_TIME = 1000 * 10; // 10초
	// 또는
	// private static final long ACCESS_EXPIRATION_TIM


	// 리프레시 토큰 만료 시간 : 7일
	private static final long REFRESH_EXPIRATION_TIME = 1000L * 60 * 60 * 24 * 7; // 7일

	//토큰 생성 메서드
	public static String createToken(String username) {
		return Jwts.builder().setSubject(username)				
				.setSubject(username)
	            .setId(UUID.randomUUID().toString())			
				.setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() 
				+ ACCESS_EXPIRATION_TIME))
				.signWith(key) 
				.compact(); 
	}

	// ✅ 리프레시 토큰 생성 메서드
	public static String createRefreshToken(String username) {
		return Jwts.builder().setSubject(username)
				.setSubject(username)
	            .setId(UUID.randomUUID().toString())
				.setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis()
				+ REFRESH_EXPIRATION_TIME))
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
