package com.sboot.moabayo.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface MyPageMapper {

	int selectSumBalance(@Param("userId") String userId);

	int selectAccountCount(String userId);

	int selectCardCount(String userId);
}
