package com.sboot.moabayo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    SecurityFilterChain filter(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            
            // ★ CORS 설정
            .cors(cors -> cors.configurationSource(req -> {
                var c = new org.springframework.web.cors.CorsConfiguration();
                c.setAllowedOrigins(java.util.List.of(
                    "http://localhost:8812",
                    "http://localhost:8811" // 프론트 도메인
                ));
                c.setAllowedMethods(java.util.List.of("GET","POST","PUT","DELETE","OPTIONS"));
                c.setAllowedHeaders(java.util.List.of("*"));
                c.setExposedHeaders(java.util.List.of("Authorization","Refresh-Token"));
                c.setAllowCredentials(true);
                var s = new org.springframework.web.cors.UrlBasedCorsConfigurationSource();
                s.registerCorsConfiguration("/**", c);
                return s.getCorsConfiguration(req);
            }))
            
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/css/**", "/js/**", "/images/**", "/", "/error").permitAll()
                .requestMatchers(HttpMethod.POST, "/user/login").permitAll()
                .anyRequest().permitAll()
            );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
