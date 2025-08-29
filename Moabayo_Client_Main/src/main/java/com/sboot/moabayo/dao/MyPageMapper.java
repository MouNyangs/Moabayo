package com.sboot.moabayo.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.sboot.moabayo.vo.UserVO;

@Mapper
public interface MyPageMapper {

	int selectSumBalance(@Param("userId") String userId);

	int selectAccountCount(String userId);

	int selectCardCount(String userId);

	UserVO selectProfile(Long userId);

	void updateProfile(Long userId, UserVO req);

	void updatePassword(Long userId, String enc);
}
