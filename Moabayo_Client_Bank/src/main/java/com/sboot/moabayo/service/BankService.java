package com.sboot.moabayo.service;

import com.sboot.moabayo.vo.AccountVO;
import com.sboot.moabayo.vo.UserVO;

public interface BankService {

    /**
     * 계좌 잔액 업데이트
     * @param userId 유저 ID
     * @param accountId 계좌 ID
     * @param amount 결제 금액 (차감)
     */
    void updateAccount(Long userId, Long accountId, Integer amount);

    /**
     * 계좌 거래 로그 추가
     * @param userId 유저 ID
     * @param accountId 계좌 ID
     * @param approvedAmount 승인 금액
     * @param approvedNum 승인 번호 (결제사 TID 등)
     * @param accountType 계좌 타입 (예: "SAVING")
     * @param category 거래 카테고리
     * @param shopName 가맹점명
     * @param shopNumber 가맹점 번호
     */
    void insertAccountTransactionLog(Long userId,
                                     Long accountId,
                                     Integer approvedAmount,
                                     String approvedNum,
                                     String accountType,
                                     String category,
                                     String shopName,
                                     String shopNumber,
                                     String memo);

	UserVO getUser(String loginId);

	AccountVO getNyangcoinAccount(Long userId);
}
