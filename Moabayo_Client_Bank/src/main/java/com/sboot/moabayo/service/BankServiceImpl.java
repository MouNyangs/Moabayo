package com.sboot.moabayo.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sboot.moabayo.dao.BankMapper;
import com.sboot.moabayo.vo.AccountTxMeta;
import com.sboot.moabayo.vo.AccountTxMetaHolder;
import com.sboot.moabayo.vo.AccountVO;
import com.sboot.moabayo.vo.UserVO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BankServiceImpl implements BankService {
    private final BankMapper bankMapper;

    public UserVO getUser(String loginId) {
        return bankMapper.findUserByLoginId(loginId);
    }
    
    public AccountVO getNyangcoinAccount(Long userId) {
        return bankMapper.findNyangcoinAccountByUserId(userId);
    }

    // 계좌 업데이트 및 결제 로그 추가
    @Override
    @Transactional
    public void updateBalancePlus(Long userId, Long accountId, Integer amount) {
        // 유저 계좌 조회
        Long userAccountId = bankMapper.findUserAccountId(userId, accountId);

        if (userAccountId == null) {
            throw new IllegalArgumentException("계좌를 찾을 수 없습니다.");
        }

        // 잔액 증가
        int updated = bankMapper.updateBalancePlus(userAccountId, amount);
        if (updated == 0) {
            throw new IllegalStateException("계좌 잔액 업데이트 실패");
        }
    }
    
    // 계좌 업데이트 및 결제 로그 추가
    @Override
    @Transactional
    public void updateBalanceMinus(Long userId, Long accountId, Integer amount) {
        // 유저 계좌 조회
        Long userAccountId = bankMapper.findUserAccountId(userId, accountId);

        if (userAccountId == null) {
            throw new IllegalArgumentException("계좌를 찾을 수 없습니다.");
        }

        // 잔액 차감
        int updated = bankMapper.updateBalanceMinus(userAccountId, amount);
        if (updated == 0) {
            throw new IllegalStateException("계좌 잔액 업데이트 실패");
        }
    }

    @Override
    @Transactional
    public void insertAccountTransactionLog(Long userId, Long accountId, Integer approvedAmount,
                                            String approvedNum, String accountType, String category,
                                            String shopName, String shopNumber, String memo) {
        Long userAccountId = bankMapper.findUserAccountId(userId, accountId);

        if (userAccountId == null) {
            throw new IllegalArgumentException("계좌를 찾을 수 없습니다.");
        }

        bankMapper.insertTransaction(userAccountId, approvedAmount, approvedNum,
                accountType, category, shopName, shopNumber, memo);
    }
    
    @Override
    @Transactional
    public void transfer(Long senderUserId, Long receiverUserId, Integer amount,
                         String approvedNum, String memo) {

        // 1) 계좌 존재 확인 (냥코인 상품 account_id = 100 사용)
        final long NYANGCOIN_ACCOUNT_ID = 100L;

        AccountVO fromAcc = getNyangcoinAccount(senderUserId);
        AccountVO toAcc   = getNyangcoinAccount(receiverUserId);
        if (fromAcc == null) throw new IllegalArgumentException("보내는 계좌가 없습니다.");
        if (toAcc   == null) throw new IllegalArgumentException("받는 계좌가 없습니다.");

        // (선택) 잔액 체크를 엄격히 하려면 BankMapper에 잔액 조회 쿼리 추가해서 비교하세요.

        // 2) 출금 (AOP가 거래로그 남김)
        AccountTxMetaHolder.set(AccountTxMeta.builder()
            .approvedAmount(amount)
            .approvedNum(approvedNum)
            .accountType("WITHDRAW")
            .category("TRANSFER_OUT")
            .shopName("계좌이체") // 원하는 표현으로
            .memo(memo)
            .build()
        );
        updateBalanceMinus(senderUserId, NYANGCOIN_ACCOUNT_ID, amount);

        // 3) 입금 (AOP가 거래로그 남김)
        AccountTxMetaHolder.set(AccountTxMeta.builder()
            .approvedAmount(amount)
            .approvedNum(approvedNum)
            .accountType("DEPOSIT")
            .category("TRANSFER_IN")
            .shopName("계좌이체")
            .memo(memo)
            .build()
        );
        updateBalancePlus(receiverUserId, NYANGCOIN_ACCOUNT_ID, amount);
    }
    
}