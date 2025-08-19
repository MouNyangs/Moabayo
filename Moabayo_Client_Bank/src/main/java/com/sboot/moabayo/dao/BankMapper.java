package com.sboot.moabayo.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.sboot.moabayo.vo.AccountVO;
import com.sboot.moabayo.vo.NyangCoinHistoryVO;
import com.sboot.moabayo.vo.NyangCoinVO;
import com.sboot.moabayo.vo.UserAccountVO;
import com.sboot.moabayo.vo.UserVO;


@Mapper
public interface BankMapper {
	// 유저 ID로 유저 반환
	UserVO findUserByLoginId(@Param("loginId") String loginId);
	
	// 유저 ID로 냥코인 VO 반환
	NyangCoinVO findNyangCoinByUserId(@Param("userId") Long userId);
	
	// 냥코인 ID로 냥코인 히스토리 개수 반환
	int countHistoryByNyangId(@Param("nyangId") Long nyangId);
	
	// 
	List<NyangCoinHistoryVO> findHistoryByNyangIdPaged(
			@Param("nyangId") Long nyangId,
			@Param("startRow") int startRow, // 1-based
			@Param("endRow") int endRow
			);
	
	// 유저가 가지고 있는 예적금대출 상품 조회
	List<UserAccountVO> findUserAccountsByUserID(@Param("userId") Long userId);    
}
