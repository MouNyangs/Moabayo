package com.sboot.moabayo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.sboot.moabayo.dao.AccountMapper;
import com.sboot.moabayo.vo.AccountVO;

@Service
public class AccountService {
	private final AccountMapper accMap;
	
	public AccountService(AccountMapper accMap) {
		this.accMap = accMap;
	}
	
	public List<AccountVO> getUserAccountsWithHistory(Long userId) {
		return accMap.findAccountsWithHistoryByUserId(userId);
	}
	
	public List<AccountVO> getAccountsByUserId(Long userId) {
		return accMap.findAccountsByUserId(userId);
	}
}
