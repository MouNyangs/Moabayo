package com.sboot.moabayo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.sboot.moabayo.dao.BankMapper;
import com.sboot.moabayo.vo.AccountVO;
import com.sboot.moabayo.vo.UserAccountVO;
import com.sboot.moabayo.vo.UserVO;

@Service
public class BankService {
    private final BankMapper bankMapper;

    public BankService(BankMapper bankMapper) {
        this.bankMapper = bankMapper;
    }

    public UserVO getUser(String loginId) {
        return bankMapper.findUserByLoginId(loginId);
    }
    
    public AccountVO getNyangcoinAccount(Long userId) {
        return bankMapper.findNyangcoinAccountByUserId(userId);
    }

//    public NyangCoinVO getNyangCoinByUserId(Long userId) {
//        return bankMapper.findNyangCoinByUserId(userId);
//    }
//
//    public int countHistory(Long nyangId) {
//        return bankMapper.countHistoryByNyangId(nyangId);
//    }
//
//    // page: 1-based로 받되, 안전하게 보정
//    public List<NyangCoinHistoryVO> getHistoryPage(Long nyangId, int page, int size) {
//        int safePage = Math.max(page, 1);
//        int safeSize = Math.max(size, 1);
//        int offset = (safePage - 1) * safeSize;
//        return bankMapper.findHistoryByNyangIdPaged(nyangId, offset, safeSize);
//    }
    
}