package com.sboot.moabayo.controller;

import java.io.IOException;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilter extends OncePerRequestFilter {

	private static final String BEAR2 = "Bearer";

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
			throws IOException, ServletException {
		if (request.getRequestURI().equals("/secure")) {
			String auth = request.getHeader("Authorization");
			if (auth == null || !auth.startsWith(BEAR2)) {
				response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
				response.getWriter().write("Auth error");
				return;
			}
			try {//jwt파싱할 파서 생성
				Jwts.parserBuilder()
				.setSigningKey(JwtUtil.getKey())
				//creartToken 에서 사용한 key와
				// 같은 서명키인가 검증
				.build()//파서를 빌드
				.parseClaimsJws(auth.replace(BEAR2, ""));
				//bearer 부분을 제거한 훈수 토큰 문자열을
				//parseClaimsJws 가 서명검증후
				//토큰에서 사용자 정보 꺼내 return

			} catch (JwtException e) {
				response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
				response.getWriter().write("Auth error");
				return;
			}
			chain.doFilter(request, response); // 다음 필터 or 컨트롤러에게 권한을 넘겨줌
		}
	}

}
