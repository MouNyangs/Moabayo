--삭제문
DROP TABLE gender_stats;
DROP TABLE age_stats;
DROP TABLE micro_payment_stats;
DROP TABLE region_stats;
DROP TABLE amount_stats;
DROP TABLE industry_codes;

--성별에 따른 카드 사용 분석 테이블
CREATE TABLE gender_stats (
    id NUMBER PRIMARY KEY,                          -- 고유 ID
    upjong_cd VARCHAR2(20),                         -- 업종 코드
    ym DATE,                                        -- 기준 년월 (예: 202508)
    block_cd VARCHAR2(20),                          -- 고객 주소 블록 코드
    gender VARCHAR2(10),                            -- 성별 (남, 여)
    age VARCHAR2(20),                               -- 연령대 (예: 20대, 30대)
    amt_corr NUMBER,                                -- 카드 이용 금액 합계
    usect_corr NUMBER                               -- 카드 이용 건수 합계
);

--연령대별에 따른 카드 사용 분석 테이블
CREATE TABLE age_stats (
    id NUMBER PRIMARY KEY,                          -- 고유 ID
    upjong_cd VARCHAR2(20),                         -- 업종 코드
    ym DATE,                                        -- 기준 년월
    block_cd VARCHAR2(20),                          -- 고객 주소 블록 코드
    age VARCHAR2(20),                               -- 연령대
    amt_corr NUMBER,                                -- 카드 이용 금액 합계
    usect_corr NUMBER                               -- 카드 이용 건수 합계
);

--시간별에 따른 카드 사용 분석 테이블
CREATE TABLE micro_payment_stats (
    id NUMBER PRIMARY KEY,                          -- 고유 ID
    upjong_cd VARCHAR2(20),                         -- 업종 코드
    ym DATE,                                        -- 기준 년월
    time_slot VARCHAR2(20),                         -- 시간대 구간 (예: 00~06시)
    block_cd VARCHAR2(20),                          -- 고객 주소 블록 코드
    amt_corr NUMBER,                                -- 카드 이용 금액 합계
    micro_pym NUMBER                                -- 소액 결제 건수
);

--소비지역별에 따른 카드 사용 분석 테이블
CREATE TABLE region_stats (
    id NUMBER PRIMARY KEY,                          -- 고유 ID
    sido VARCHAR2(20),                              -- 가맹점 주소 광역시도 (예: 서울특별시)
    sgg VARCHAR2(20),                               -- 가맹점 주소 시군구 (예: 강남구)
    upjong_class1 VARCHAR2(50),                     -- 업종 대분류
    ymd DATE,                                       -- 기준 일자 (예: 20250807)
    tot_reg_cd VARCHAR2(20),                        -- 고객 주소 집계구 코드
    amt_corr NUMBER,                                -- 카드 이용 금액 합계
    usect_corr NUMBER                               -- 카드 이용 건수 합계
);

--카드이용금액별에 따른 카드 사용 분석 테이블
CREATE TABLE amount_stats (
    id NUMBER PRIMARY KEY,                          -- 고유 ID
    upjong_cd VARCHAR2(20),                         -- 업종 코드 (있을 경우)
    upjong_class1 VARCHAR2(50),                     -- 업종 대분류 (있을 경우)
    ym DATE,                                        -- 기준 년월 (있을 경우)
    ymd DATE,                                       -- 기준 일자 (있을 경우)
    block_cd VARCHAR2(20),                          -- 고객 주소 블록 코드 (있을 경우)
    tot_reg_cd VARCHAR2(20),                        -- 고객 주소 집계구 코드 (있을 경우)
    gender VARCHAR2(10),                            -- 성별 (있을 경우)
    age VARCHAR2(20),                               -- 연령대 (있을 경우)
    time_slot VARCHAR2(20),                         -- 시간대 구간 (있을 경우)
    sido VARCHAR2(20),                              -- 가맹점 광역시도 (있을 경우)
    sgg VARCHAR2(20),                               -- 가맹점 시군구 (있을 경우)
    amt_corr NUMBER,                                -- 카드 이용 금액 합계
    usect_corr NUMBER,                              -- 카드 이용 건수 합계
    micro_pym NUMBER                                -- 소액 결제 건수 (있을 경우)
);

--업종코드 테이블
CREATE TABLE industry_codes (
    upjong_cd VARCHAR2(20) PRIMARY KEY,             -- 업종 코드
    class1 VARCHAR2(100),                           -- 업종 대분류
    class2 VARCHAR2(100),                           -- 업종 중분류
    class3 VARCHAR2(100)                            -- 업종 소분류
);

ALTER TABLE gender_stats DROP COLUMN age;
commit;

select * from gender_stats;
select * from age_stats;
select * from micro_payment_stats;
select * from region_stats;
select * from amount_stats;
select * from industry_codes;