package com.sboot.moabayo.vo;

import lombok.Data;

@Data
public class NyangCoinHistoryVO {
	private long history_id;
	private String createDate;
	private long totalAmount;
	private long transactionAmount;
	private long transactionType;
	private long nyangId;
}
