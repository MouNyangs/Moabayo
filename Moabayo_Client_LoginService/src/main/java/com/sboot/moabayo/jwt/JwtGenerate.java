package com.sboot.moabayo.jwt;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.util.Date;

public class JwtGenerate {
	private static final String SECRET = "ThisIsASecretKeyThatMustBeOver32Characters!";
	private static final Key key = Keys.hmacShaKeyFor(SECRET.getBytes());

	private static final long ACCESS_EXPIRATION_TIME = 1000 * 60 * 10; // 10분
	private static final long REFRESH_EXPIRATION_TIME = 1000L * 60 * 60 * 24 * 7; // 7일

	public static String createToken(Long userId, String loginId) {
		return Jwts.builder().setSubject(loginId).claim("userId", userId).setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + ACCESS_EXPIRATION_TIME)).signWith(key).compact();
	}

	public static String createRefreshToken(String loginId) {
		return Jwts.builder().setSubject(loginId).setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + REFRESH_EXPIRATION_TIME)).signWith(key).compact();
	}

	public static Key getKey() {
		return key;
	}
}
