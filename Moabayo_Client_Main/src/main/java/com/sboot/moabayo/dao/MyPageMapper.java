package com.sboot.moabayo.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.sboot.moabayo.vo.UserVO;

@Mapper
public interface MyPageMapper {

	int selectSumBalance(@Param("userId") String userId);

	int selectAccountCount(@Param("userId") String userId);

	int selectCardCount(@Param("userId") String userId);

	UserVO selectProfile(@Param("userId") Long userId);

	void updateProfile(@Param("userId") Long userId, @Param("p") UserVO req);

	void updatePassword(@Param("userId") Long userId, @Param("enc") String enc);
}
