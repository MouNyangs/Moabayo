package com.sboot.moabayo.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sboot.moabayo.dao.BankMapper;
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

        // 잔액 차감
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
	public UserVO getUserByAccountId() {
		// TODO Auto-generated method stub
		return null;
	}

    
    
    
}