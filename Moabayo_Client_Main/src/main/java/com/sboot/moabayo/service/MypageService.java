package com.sboot.moabayo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sboot.moabayo.dao.MyPageMapper;

@Service
public class MypageService {

	@Autowired
	private MyPageMapper mypagemapper;
	
	public int getSumBalance(String userId) {
			
		return mypagemapper.selectSumBalance(userId);
	}

	public int getAccountCount(String userId) {
		// TODO Auto-generated method stub
		return mypagemapper.selectAccountCount(userId);
	}

	public int getCardCount(String userId) {
		// TODO Auto-generated method stub
		return mypagemapper.selectCardCount(userId);
	}

}
