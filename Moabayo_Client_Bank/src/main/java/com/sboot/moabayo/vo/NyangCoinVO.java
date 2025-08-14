package com.sboot.moabayo.vo;

import java.sql.Date;

import lombok.Data;

@Data
public class NyangCoinVO {
    private Long nyangCoinId;   // ★ VO가 이렇게 되어 있다면
    private Long userId;
    private Long balance;
    private Date createdAt; // Oracle DATE면 Timestamp/Date여도 OK
}
