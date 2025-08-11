package com.sboot.moabayo.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.sboot.moabayo.vo.CardProductVO;

@Mapper
public interface CardProductMapper {
    List<CardProductVO> getRecommendCards();
    List<CardProductVO> getCardProducts();
}