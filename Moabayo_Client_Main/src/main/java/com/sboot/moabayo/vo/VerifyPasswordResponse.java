package com.sboot.moabayo.vo;

import lombok.Data;

@Data
public class VerifyPasswordResponse {
    private boolean ok;
    private String message;

    public static VerifyPasswordResponse of(boolean ok){
        VerifyPasswordResponse r = new VerifyPasswordResponse();
        r.setOk(ok);
        return r;
    }
}