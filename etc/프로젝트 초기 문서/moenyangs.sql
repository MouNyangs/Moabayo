-- Table: user
CREATE TABLE "user" (
    id NUMBER(20) PRIMARY KEY,
    create_date TIMESTAMP(6),
    modify_date TIMESTAMP(6),
    account_num VARCHAR2(255),
    address VARCHAR2(255),
    address_detail VARCHAR2(255),
    zip_code VARCHAR2(255),
    auto_login NUMBER(1),
    email VARCHAR2(255),
    hash_code VARCHAR2(255),
    mydata_access_token VARCHAR2(255),
    name VARCHAR2(255),
    login_id VARCHAR2(255),
    password VARCHAR2(255),
    phone VARCHAR2(255),
    refresh_token VARCHAR2(255),
    simple_password VARCHAR2(255),
    is_admin NUMBER(1) DEFAULT 0
);

-- Table: transaction
CREATE TABLE transaction (
    id NUMBER(20) PRIMARY KEY,
    approved_amount NUMBER(20),
    approved_num VARCHAR2(255),
    card_history_id NUMBER(20),
    card_id NUMBER(20),
    card_type VARCHAR2(255),
    category VARCHAR2(255),
    date_time TIMESTAMP(6),
    shop_name VARCHAR2(255),
    shop_number VARCHAR2(255),
    user_id NUMBER(20),
    FOREIGN KEY (user_id) REFERENCES "user"(id)
);

-- Table: nyang_coin
CREATE TABLE nyang_coin (
    id NUMBER(20) PRIMARY KEY,
    create_date TIMESTAMP(6),
    modify_date TIMESTAMP(6),
    end_date TIMESTAMP(6),
    money NUMBER(20),
    user_id NUMBER(20),
    FOREIGN KEY (user_id) REFERENCES "user"(id)
);

-- Table: habit
CREATE TABLE habit (
    id NUMBER(20) PRIMARY KEY,
    create_date TIMESTAMP(6),
    modify_date TIMESTAMP(6),
    end_date TIMESTAMP(6),
    habit_name VARCHAR2(255),
    saving NUMBER(20),
    state NUMBER,
    target_money NUMBER(20),
    title VARCHAR2(255),
    user_id NUMBER(20),
    FOREIGN KEY (user_id) REFERENCES "user"(id)
);

-- Table: habit_log
CREATE TABLE habit_log (
    id NUMBER(20) PRIMARY KEY,
    create_date TIMESTAMP(6),
    save_day TIMESTAMP(6),
    save_money NUMBER(20),
    habit_id NUMBER(20),
    FOREIGN KEY (habit_id) REFERENCES habit(id)
);

-- Table: habit_habit_log
CREATE TABLE habit_habit_log (
    habit_id NUMBER(20),
    habit_log_id NUMBER(20),
    PRIMARY KEY (habit_id, habit_log_id),
    FOREIGN KEY (habit_id) REFERENCES habit(id),
    FOREIGN KEY (habit_log_id) REFERENCES habit_log(id)
);

-- Table: coin_history
CREATE TABLE coin_history (
    id NUMBER(20) PRIMARY KEY,
    create_date TIMESTAMP(6),
    modify_date TIMESTAMP(6),
    total_amt NUMBER(20),
    trans_amt NUMBER(20),
    trans_type VARCHAR2(255),
    nyang_id NUMBER(20),
    FOREIGN KEY (nyang_id) REFERENCES nyang_coin(id)
);

-- 수정된 부분: 이미 user 테이블에 is_admin이 포함됨으로, 이 ALTER 문은 제거함

-- Table: admin
CREATE TABLE admin (
    id NUMBER(20) PRIMARY KEY,
    user_id NUMBER(20) UNIQUE,
    role VARCHAR2(50),
    create_date TIMESTAMP(6),
    FOREIGN KEY (user_id) REFERENCES "user"(id)
);

-- 계좌 테이블 (account_table)
CREATE TABLE Mydata_account (
    trade_id VARCHAR2(50) PRIMARY KEY,      -- 거래고유번호, PK
    trade_date DATE NOT NULL,              -- 거래일자 (계좌 기준)
    bank_name VARCHAR2(100) NOT NULL,      -- 개설기관명
    account_balance NUMBER(15, 2) NOT NULL -- 계좌 잔액
);

-- 거래내역 테이블 (transaction_table)
CREATE TABLE Mydata_transaction (
    transaction_id NUMBER PRIMARY KEY, -- 거래내역 고유번호 (PK)
    trade_id VARCHAR2(50) NOT NULL,                     -- 계좌 테이블의 거래고유번호 (FK)
    trade_detail_date DATE NOT NULL,                    -- 거래내역 날짜
    trade_time TIME NOT NULL,                           -- 거래시간
    transaction_type VARCHAR2(10) NOT NULL,             -- 입출금구분 (예: 입금, 출금)
    trade_type VARCHAR2(50) NOT NULL,                    -- 거래구분 (예: 이체, 카드결제 등)
    bankbook_note VARCHAR2(255),                         -- 통장인자내용
    trade_amount NUMBER(15, 2) NOT NULL,               -- 거래금액
    balance_after_trade NUMBER(15, 2) NOT NULL,        -- 거래 후 잔액
    CONSTRAINT fk_account_trade
        FOREIGN KEY (trade_id)
        REFERENCES account_table(trade_id)
        ON DELETE CASCADE
);
