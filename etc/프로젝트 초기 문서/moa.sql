-- 자식 테이블 먼저 삭제
DROP TABLE habit_habit_log CASCADE CONSTRAINTS;
DROP TABLE habit_log CASCADE CONSTRAINTS;
DROP TABLE habit CASCADE CONSTRAINTS;
DROP TABLE coin_history CASCADE CONSTRAINTS;
DROP TABLE nyang_coin CASCADE CONSTRAINTS;
DROP TABLE transaction CASCADE CONSTRAINTS;
DROP TABLE admin CASCADE CONSTRAINTS;
DROP TABLE Mydata_transaction CASCADE CONSTRAINTS;
DROP TABLE Mydata_account CASCADE CONSTRAINTS;
DROP TABLE "user" CASCADE CONSTRAINTS;

CREATE TABLE "user" (
    id NUMBER(20) PRIMARY KEY,
    create_date DATE,
    account_num VARCHAR2(255),
    address VARCHAR2(255),
    address_detail VARCHAR2(255),
    zip_code VARCHAR2(255),
    email VARCHAR2(255),
    name VARCHAR2(255),
    login_id VARCHAR2(255),
    password VARCHAR2(255),
    phone VARCHAR2(255),
    refresh_token VARCHAR2(255),
    simple_password VARCHAR2(255),
    is_admin NUMBER(1) DEFAULT 0
);

CREATE TABLE nyang_coin (
    id NUMBER(20) PRIMARY KEY,
    create_date DATE,
    money NUMBER(20),
    user_id NUMBER(20),
    FOREIGN KEY (user_id) REFERENCES "user"(id)
);

CREATE TABLE habit (
    id NUMBER(20) PRIMARY KEY,
    create_date DATE,
    habit_name VARCHAR2(255),
    saving NUMBER(20),
    state NUMBER,
    target_money NUMBER(20),
    title VARCHAR2(255),
    user_id NUMBER(20),
    FOREIGN KEY (user_id) REFERENCES "user"(id)
);

CREATE TABLE habit_log (
    id NUMBER(20) PRIMARY KEY,
    create_date DATE,
    save_day DATE,
    save_money NUMBER(20),
    habit_id NUMBER(20),
    FOREIGN KEY (habit_id) REFERENCES habit(id)
);

CREATE TABLE habit_habit_log (
    habit_id NUMBER(20),
    habit_log_id NUMBER(20),
    PRIMARY KEY (habit_id, habit_log_id),
    FOREIGN KEY (habit_id) REFERENCES habit(id),
    FOREIGN KEY (habit_log_id) REFERENCES habit_log(id)
);

CREATE TABLE transaction (
    id NUMBER(20) PRIMARY KEY,
    approved_amount NUMBER(20),
    approved_num VARCHAR2(255),
    card_history_id NUMBER(20),
    card_id NUMBER(20),
    card_type VARCHAR2(255),
    category VARCHAR2(255),
    date_time DATE,
    shop_name VARCHAR2(255),
    shop_number VARCHAR2(255),
    user_id NUMBER(20),
    FOREIGN KEY (user_id) REFERENCES "user"(id)
);

CREATE TABLE coin_history (
    id NUMBER(20) PRIMARY KEY,
    create_date DATE,
    total_amt NUMBER(20),
    trans_amt NUMBER(20),
    trans_type VARCHAR2(255),
    nyang_id NUMBER(20),
    FOREIGN KEY (nyang_id) REFERENCES nyang_coin(id)
);

CREATE TABLE admin (
    id NUMBER(20) PRIMARY KEY,
    user_id NUMBER(20) UNIQUE,
    role VARCHAR2(50),
    create_date DATE,
    FOREIGN KEY (user_id) REFERENCES "user"(id)
);

CREATE TABLE Mydata_account (
    trade_id VARCHAR2(50) PRIMARY KEY,
    trade_date DATE NOT NULL,
    bank_name VARCHAR2(100) NOT NULL,
    account_balance NUMBER(15, 2) NOT NULL
);

CREATE TABLE Mydata_transaction (
    transaction_id NUMBER PRIMARY KEY,
    trade_id VARCHAR2(50) NOT NULL,
    trade_detail_date DATE NOT NULL,
    trade_time DATE NOT NULL,
    transaction_type VARCHAR2(10) NOT NULL,
    trade_type VARCHAR2(50) NOT NULL,
    bankbook_note VARCHAR2(255),
    trade_amount NUMBER(15, 2) NOT NULL,
    balance_after_trade NUMBER(15, 2) NOT NULL,
    CONSTRAINT fk_account_trade
        FOREIGN KEY (trade_id)
        REFERENCES Mydata_account(trade_id)
        ON DELETE CASCADE
);

-- 사용자 테이블: user
INSERT INTO "user" VALUES (1, SYSDATE, '10000001', 'Seoul', 'Apt 101', '01000', 'u1@example.com', 'Alice', 'alice', 'pass1', '010-0001', 'ref1', '1234', 0);
INSERT INTO "user" VALUES (2, SYSDATE, '10000002', 'Busan', 'Apt 202', '02000', 'u2@example.com', 'Bob', 'bob', 'pass2', '010-0002', 'ref2', '2345', 0);
INSERT INTO "user" VALUES (3, SYSDATE, '10000003', 'Daegu', 'Apt 303', '03000', 'u3@example.com', 'Charlie', 'charlie', 'pass3', '010-0003', 'ref3', '3456', 1);
INSERT INTO "user" VALUES (4, SYSDATE, '10000004', 'Incheon', 'Apt 404', '04000', 'u4@example.com', 'David', 'david', 'pass4', '010-0004', 'ref4', '4567', 0);
INSERT INTO "user" VALUES (5, SYSDATE, '10000005', 'Gwangju', 'Apt 505', '05000', 'u5@example.com', 'Eve', 'eve', 'pass5', '010-0005', 'ref5', '5678', 0);

-- 고양이 코인 테이블: nyang_coin
INSERT INTO nyang_coin VALUES (1, SYSDATE, 1000, 1);
INSERT INTO nyang_coin VALUES (2, SYSDATE, 2000, 2);
INSERT INTO nyang_coin VALUES (3, SYSDATE, 3000, 3);
INSERT INTO nyang_coin VALUES (4, SYSDATE, 4000, 4);
INSERT INTO nyang_coin VALUES (5, SYSDATE, 5000, 5);

-- 습관 테이블: habit
INSERT INTO habit VALUES (1, SYSDATE, 'Drink Water', 50, 1, 500, 'Hydrate', 1);
INSERT INTO habit VALUES (2, SYSDATE, 'Walk', 100, 1, 1000, 'Steps', 2);
INSERT INTO habit VALUES (3, SYSDATE, 'Read Book', 150, 0, 1500, 'Reading', 3);
INSERT INTO habit VALUES (4, SYSDATE, 'Yoga', 200, 1, 2000, 'Fitness', 4);
INSERT INTO habit VALUES (5, SYSDATE, 'Meditate', 250, 0, 2500, 'Mind', 5);

-- 습관 로그 테이블: habit_log
INSERT INTO habit_log VALUES (1, SYSDATE, SYSDATE, 50, 1);
INSERT INTO habit_log VALUES (2, SYSDATE, SYSDATE, 100, 2);
INSERT INTO habit_log VALUES (3, SYSDATE, SYSDATE, 150, 3);
INSERT INTO habit_log VALUES (4, SYSDATE, SYSDATE, 200, 4);
INSERT INTO habit_log VALUES (5, SYSDATE, SYSDATE, 250, 5);

-- 습관-습관로그 매핑 테이블: habit_habit_log
INSERT INTO habit_habit_log VALUES (1, 1);
INSERT INTO habit_habit_log VALUES (2, 2);
INSERT INTO habit_habit_log VALUES (3, 3);
INSERT INTO habit_habit_log VALUES (4, 4);
INSERT INTO habit_habit_log VALUES (5, 5);

-- 거래 내역 테이블: transaction
INSERT INTO transaction VALUES (1, 10000, 'A1001', 1, 10, 'Credit', 'Food', SYSDATE, 'StoreA', '001', 1);
INSERT INTO transaction VALUES (2, 20000, 'A1002', 2, 20, 'Debit', 'Shopping', SYSDATE, 'StoreB', '002', 2);
INSERT INTO transaction VALUES (3, 15000, 'A1003', 3, 30, 'Credit', 'Transport', SYSDATE, 'StoreC', '003', 3);
INSERT INTO transaction VALUES (4, 18000, 'A1004', 4, 40, 'Debit', 'Utilities', SYSDATE, 'StoreD', '004', 4);
INSERT INTO transaction VALUES (5, 22000, 'A1005', 5, 50, 'Credit', 'Health', SYSDATE, 'StoreE', '005', 5);

-- 코인 내역 테이블: coin_history
INSERT INTO coin_history VALUES (1, SYSDATE, 1000, 100, 'deposit', 1);
INSERT INTO coin_history VALUES (2, SYSDATE, 1800, 200, 'withdraw', 2);
INSERT INTO coin_history VALUES (3, SYSDATE, 3100, 300, 'deposit', 3);
INSERT INTO coin_history VALUES (4, SYSDATE, 3700, 400, 'withdraw', 4);
INSERT INTO coin_history VALUES (5, SYSDATE, 4200, 500, 'deposit', 5);

-- 관리자 테이블: admin
INSERT INTO admin VALUES (1, 3, 'ADMIN', SYSDATE);
INSERT INTO admin VALUES (2, 5, 'MANAGER', SYSDATE);
INSERT INTO admin VALUES (3, 1, 'EDITOR', SYSDATE);
INSERT INTO admin VALUES (4, 4, 'VIEWER', SYSDATE);
INSERT INTO admin VALUES (5, 2, 'SUPER_ADMIN', SYSDATE);

-- 마이데이터 계좌 테이블: Mydata_account
INSERT INTO Mydata_account VALUES ('T1001', SYSDATE, 'KB Bank', 500000);
INSERT INTO Mydata_account VALUES ('T1002', SYSDATE, 'Shinhan Bank', 600000);
INSERT INTO Mydata_account VALUES ('T1003', SYSDATE, 'NH Bank', 450000);
INSERT INTO Mydata_account VALUES ('T1004', SYSDATE, 'Woori Bank', 700000);
INSERT INTO Mydata_account VALUES ('T1005', SYSDATE, 'Kakao Bank', 300000);

-- 마이데이터 거래내역 테이블: Mydata_transaction
INSERT INTO Mydata_transaction VALUES (1, 'T1001', SYSDATE, SYSDATE, 'D', 'Transfer', 'Note1', 50000, 450000);
INSERT INTO Mydata_transaction VALUES (2, 'T1002', SYSDATE, SYSDATE, 'W', 'Deposit', 'Note2', 60000, 660000);
INSERT INTO Mydata_transaction VALUES (3, 'T1003', SYSDATE, SYSDATE, 'D', 'Withdrawal', 'Note3', 40000, 410000);
INSERT INTO Mydata_transaction VALUES (4, 'T1004', SYSDATE, SYSDATE, 'D', 'Transfer', 'Note4', 70000, 630000);
INSERT INTO Mydata_transaction VALUES (5, 'T1005', SYSDATE, SYSDATE, 'W', 'Deposit', 'Note5', 30000, 330000);

SELECT * FROM "user";

SELECT * FROM nyang_coin;

SELECT * FROM habit;

SELECT * FROM habit_log;

SELECT * FROM habit_habit_log;

SELECT * FROM transaction;

SELECT * FROM coin_history;

SELECT * FROM admin;

SELECT * FROM Mydata_account;

SELECT * FROM Mydata_transaction;