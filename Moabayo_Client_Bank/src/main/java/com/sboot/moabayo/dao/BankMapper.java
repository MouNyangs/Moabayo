package com.sboot.moabayo.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.sboot.moabayo.vo.AccountVO;
import com.sboot.moabayo.vo.UserAccountVO;
import com.sboot.moabayo.vo.UserVO;


@Mapper
public interface BankMapper {
	// 유저 ID로 유저 반환
	UserVO findUserByLoginId(@Param("loginId") String loginId);
	
	// 냥코인 계좌 찾기
	AccountVO findNyangcoinAccountByUserId(@Param("userId") Long userId);
	
	/*
	 * Long findUserAccountId(@Param("userId") Long userId,
	 * 
	 * @Param("accountId") Long accountId);
	 * 
	 * int updateAccountBalance(@Param("userAccountId") Long userAccountId,
	 * 
	 * @Param("amount") Integer amount);
	 * 
	 * int insertTransaction(@Param("userAccountId") Long userAccountId,
	 * 
	 * @Param("approvedAmount") Integer approvedAmount,
	 * 
	 * @Param("approvedNum") String approvedNum,
	 * 
	 * @Param("accountType") String accountType,
	 * 
	 * @Param("category") String category,
	 * 
	 * @Param("shopName") String shopName,
	 * 
	 * @Param("shopNumber") String shopNumber);
	 */

	Long findUserAccountId(	Long userId, 
							Long accountId);

	int updateBalancePlus(Long userAccountId, 
							 Integer amount);
	
	int updateBalanceMinus(Long userAccountId, 
			 				Integer amount);

	void insertTransaction( Long userAccountId, 
							Integer approvedAmount, 
							String approvedNum, 
							String accountType,
							String category, 
							String shopName, 
							String shopNumber);
}
