package com.sboot.moabayo.vo;

import lombok.Data;

@Data
public class VerifyPasswordRequest {
    private Long userId;
    private String password;
}