package com.sboot.moabayo.vo;

import com.opencsv.bean.CsvBindByName;

import lombok.Data;

@Data
public class PredictionsRowVO {

    // 세그먼트 키
    @CsvBindByName(column = "SIDO")         private String SIDO;
    @CsvBindByName(column = "AGE")          private String AGE;
    @CsvBindByName(column = "GENDER")       private String GENDER;
    @CsvBindByName(column = "YEAR")         private int YEAR;
    @CsvBindByName(column = "MONTH")        private int MONTH;
    @CsvBindByName(column = "TIMEBAND")     private String TIMEBAND; // 점심(11–14)/저녁(18–21)/심야(22–02)/전체

    // 업종 & 점수
    @CsvBindByName(column = "UPJONG")       private String UPJONG;
    @CsvBindByName(column = "UPJONG_NAME")  private String UPJONG_NAME;

    @CsvBindByName(column = "SCORE_RAW")    private double SCORE_RAW;
    @CsvBindByName(column = "SCORE_NORM")   private double SCORE_NORM;     // 0~1
    @CsvBindByName(column = "SCORE_PERCENT")private int SCORE_PERCENT;     // 0~100
}
