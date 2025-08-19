package com.sboot.moabayo.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.sboot.moabayo.vo.AccountVO;

@Mapper
public interface AccountMapper {
    List<AccountVO> findAccountsWithHistoryByUserId(@Param("userId") Long userId);
    List<AccountVO> findAccountsByUserId(@Param("userId") Long userId);
}
