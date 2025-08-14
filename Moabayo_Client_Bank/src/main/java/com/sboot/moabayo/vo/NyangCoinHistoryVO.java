package com.sboot.moabayo.vo;

import java.sql.Date;

import lombok.Data;

@Data
public class NyangCoinHistoryVO {
    private Long historyId;
    private Date createdAt;
    private Long amount;
    private Long balanceAfter;
    private String type;
    private Long nyangCoinId;
}
