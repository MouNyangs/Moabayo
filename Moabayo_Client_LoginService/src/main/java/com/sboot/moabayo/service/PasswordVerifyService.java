package com.sboot.moabayo.service;

import org.springframework.stereotype.Service;


// 아직 개발중...
@Service
public class PasswordVerifyService {
    private final User userRepository; // UserMapper 랑 잇기
    private final PasswordEncoder passwordEncoder; // BCrypt

    public PasswordVerifyService(UserRepository userRepository, PasswordEncoder encoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = encoder;
    }

    public boolean verify(Long userId, String raw) {
        if (userId == null || raw == null || raw.isBlank()) return false;
        return userRepository.findById(userId)
                .map(u -> passwordEncoder.matches(raw, u.getPassword()))
                .orElse(false);
    }
}