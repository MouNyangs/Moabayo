--������
DROP TABLE card_transaction CASCADE CONSTRAINTS;
DROP TABLE admin CASCADE CONSTRAINTS;
DROP TABLE coin_history CASCADE CONSTRAINTS;
DROP TABLE nyang_coin CASCADE CONSTRAINTS;
DROP TABLE account_transaction CASCADE CONSTRAINTS;
DROP TABLE user_card CASCADE CONSTRAINTS;
DROP TABLE user_account CASCADE CONSTRAINTS;
DROP TABLE card_product CASCADE CONSTRAINTS;
DROP TABLE bank_product CASCADE CONSTRAINTS;
DROP TABLE users CASCADE CONSTRAINTS;
DROP TABLE region_stats CASCADE CONSTRAINTS;
DROP TABLE micro_payment_stats CASCADE CONSTRAINTS;
DROP TABLE age_stats CASCADE CONSTRAINTS;
DROP TABLE gender_stats CASCADE CONSTRAINTS;
DROP TABLE industry_codes CASCADE CONSTRAINTS;

drop sequence user_seq;

------------------------------------------------
-- 1. ����� (users)
------------------------------------------------
CREATE TABLE users (
    user_id NUMBER(20,0) PRIMARY KEY,
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
    is_admin NUMBER(1,0)
);

------------------------------------------------
-- 2. ���� ��ǰ (bank_product)
------------------------------------------------
CREATE TABLE bank_product (
    account_id NUMBER(8,0) PRIMARY KEY,
    name VARCHAR2(100) NOT NULL,
    img VARCHAR2(255),
    description VARCHAR2(1000),
    category VARCHAR2(100),
    benefits VARCHAR2(1000),
    interest NUMBER(5,2),
    type VARCHAR2(50)
);

------------------------------------------------
-- 3. ī�� ��ǰ (card_product)
------------------------------------------------
CREATE TABLE card_product (
    card_id NUMBER(8,0) PRIMARY KEY,
    img VARCHAR2(255),
    name VARCHAR2(100) NOT NULL,
    brand VARCHAR2(50),
    description VARCHAR2(1000),
    category VARCHAR2(100),
    benefits VARCHAR2(1000),
    interest NUMBER(5,2),
    type VARCHAR2(50)
);

------------------------------------------------
-- 4. ����� ���� (user_account)
------------------------------------------------
CREATE TABLE user_account (
    user_account_id NUMBER(8,0) PRIMARY KEY,
    user_id NUMBER(20,0) NOT NULL,
    account_id NUMBER(8,0) NOT NULL,
    account_number VARCHAR2(30) UNIQUE NOT NULL,
    account_name VARCHAR2(100),
    CONSTRAINT fk_user_account_user FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_user_account_account FOREIGN KEY (account_id) REFERENCES bank_product(account_id)
);

------------------------------------------------
-- 5. ����� ī�� (user_card)
------------------------------------------------
CREATE TABLE user_card (
    user_card_id NUMBER(8,0) PRIMARY KEY,
    user_id NUMBER(20,0) NOT NULL,
    card_id NUMBER(8,0) NOT NULL,
    CONSTRAINT fk_user_card_user FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_user_card_card FOREIGN KEY (card_id) REFERENCES card_product(card_id)
);

------------------------------------------------
-- 6. ���� �ŷ� (account_transaction)
------------------------------------------------
CREATE TABLE account_transaction (
    account_transaction_id NUMBER(20,0) PRIMARY KEY,
    user_account_id NUMBER(20,0) NOT NULL,
    approved_amount NUMBER(20,2),
    approved_num VARCHAR2(255),
    category VARCHAR2(255),
    date_time DATE,
    shop_name VARCHAR2(255),
    shop_number VARCHAR2(255),
    CONSTRAINT fk_account_transaction_user_account FOREIGN KEY (user_account_id) REFERENCES user_account(user_account_id)
);

------------------------------------------------
-- 7. ������ (nyang_coin)
------------------------------------------------
CREATE TABLE nyang_coin (
    nyang_id NUMBER(20,0) PRIMARY KEY,
    create_date DATE,
    money NUMBER(20,2),
    user_id NUMBER(20,0),
    CONSTRAINT fk_nyang_coin_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);

------------------------------------------------
-- 8. ���� �̷� (coin_history)
------------------------------------------------
CREATE TABLE coin_history (
    history_id NUMBER(20,0) PRIMARY KEY,
    create_date DATE,
    total_amt NUMBER(20,2),
    trans_amt NUMBER(20,2),
    trans_type VARCHAR2(255),
    nyang_id NUMBER(20,0),
    CONSTRAINT fk_coin_history_nyang FOREIGN KEY (nyang_id) REFERENCES nyang_coin(nyang_id)
);

------------------------------------------------
-- 9. ������ (admin)
------------------------------------------------
CREATE TABLE admin (
    admin_id NUMBER(20,0) PRIMARY KEY,
    user_id NUMBER(20,0) UNIQUE,
    role VARCHAR2(50),
    create_date DATE,
    CONSTRAINT fk_admin_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);

------------------------------------------------
-- 10. ī�� �ŷ� (card_transaction)
------------------------------------------------
CREATE TABLE card_transaction (
    card_transaction_id NUMBER(20,0) PRIMARY KEY,
    user_card_id NUMBER(20,0) NOT NULL,
    approved_amount NUMBER(20,2),
    approved_num VARCHAR2(255),
    card_type VARCHAR2(255),
    category VARCHAR2(255),
    date_time DATE,
    shop_name VARCHAR2(255),
    shop_number VARCHAR2(255),
    CONSTRAINT fk_card_transaction_user_card FOREIGN KEY (user_card_id) REFERENCES user_card(user_card_id)
);

------------------------------------------------
-- 11. ���� �ڵ� (industry_codes)
------------------------------------------------
CREATE TABLE industry_codes (
    upjong_code VARCHAR2(20) PRIMARY KEY,
    upjong VARCHAR2(100)
);

------------------------------------------------
-- 12. ���� ��� (gender_stats)
------------------------------------------------
CREATE TABLE gender_stats (
    gender_stats_id NUMBER(10,0) PRIMARY KEY,
    upjong_code VARCHAR2(20),
    yearmonth DATE,
    gender VARCHAR2(10),
    card_total NUMBER(12,2),
    CONSTRAINT fk_gender_stats_upjong FOREIGN KEY (upjong_code) REFERENCES industry_codes(upjong_code)
);

------------------------------------------------
-- 13. ���� ��� (age_stats)
------------------------------------------------
CREATE TABLE age_stats (
    age_stats_id NUMBER(10,0) PRIMARY KEY,
    upjong_code VARCHAR2(20),
    yearmonth DATE,
    age_group VARCHAR2(20),
    card_total NUMBER(12,2),
    CONSTRAINT fk_age_stats_upjong FOREIGN KEY (upjong_code) REFERENCES industry_codes(upjong_code)
);

------------------------------------------------
-- 14. �Ҿװ��� ��� (micro_payment_stats)
------------------------------------------------
CREATE TABLE micro_payment_stats (
    payments_stats_id NUMBER(10,0) PRIMARY KEY,
    upjong_code VARCHAR2(20),
    yearmonth DATE,
    time_slot VARCHAR2(20),
    card_total NUMBER(12,2),
    CONSTRAINT fk_micro_payment_upjong FOREIGN KEY (upjong_code) REFERENCES industry_codes(upjong_code)
);

------------------------------------------------
-- 15. ���� ��� (region_stats)
------------------------------------------------
CREATE TABLE region_stats (
    region_stats_id NUMBER(10,0) PRIMARY KEY,
    upjong_code VARCHAR2(20),
    sido VARCHAR2(20),
    sigungu VARCHAR2(20),
    upjong VARCHAR2(50),
    yearmonthdate DATE,
    total_address_code VARCHAR2(20),
    card_total NUMBER(12,2),
    CONSTRAINT fk_region_stats_upjong FOREIGN KEY (upjong_code) REFERENCES industry_codes(upjong_code)
);




/************************************************
 * ���� ������ (1 ~ 10)
 ************************************************/

-- users
INSERT INTO users VALUES (1, TO_DATE('2024-01-01','YYYY-MM-DD'), '111-222-333', '����� ������', '101ȣ', '06236', 'user1@example.com', 'ȫ�浿', 'hong1', 'pw1', '010-1111-2222', 'token1', '1111', 0);
INSERT INTO users VALUES (2, TO_DATE('2024-01-02','YYYY-MM-DD'), '222-333-444', '����� ������', '202ȣ', '04123', 'user2@example.com', '��ö��', 'kimcs', 'pw2', '010-2222-3333', 'token2', '2222', 0);
INSERT INTO users VALUES (3, TO_DATE('2024-01-03','YYYY-MM-DD'), '333-444-555', '�λ�� �ؿ�뱸', '303ȣ', '48095', 'user3@example.com', '�̿���', 'leeyh', 'pw3', '010-3333-4444', 'token3', '3333', 0);
INSERT INTO users VALUES (4, TO_DATE('2024-01-04','YYYY-MM-DD'), '444-555-666', '�뱸�� ������', '404ȣ', '42111', 'user4@example.com', '�ڹμ�', 'parkms', 'pw4', '010-4444-5555', 'token4', '4444', 0);
INSERT INTO users VALUES (5, TO_DATE('2024-01-05','YYYY-MM-DD'), '555-666-777', '��õ�� ������', '505ȣ', '21555', 'user5@example.com', '������', 'choije', 'pw5', '010-5555-6666', 'token5', '5555', 1);

-- bank_product
INSERT INTO bank_product VALUES (101, '�������������', 'img1.png', '������ ���� ����', '����', '���ͳݹ�ŷ ����', 0.10, '�����');
INSERT INTO bank_product VALUES (102, 'û�� ����', 'img2.png', 'û�� ���� ���� ��ǰ', '����', '���� ���', 3.20, '����');
INSERT INTO bank_product VALUES (103, '����û����������', 'img3.png', '�������� �ʼ�����', 'û��', '���� ���', 1.50, '����');
INSERT INTO bank_product VALUES (104, '���⿹��', 'img4.png', '�����ݸ� ���� ��ǰ', '����', '���� �ݸ�', 2.80, '����');
INSERT INTO bank_product VALUES (105, '��� ����', 'img5.png', '���̵��� ���� ����', '����', '���б� ����', 2.00, '����');

-- card_product
INSERT INTO card_product VALUES (201, 'card1.png', '�÷�Ƽ�� ī��', 'VISA', '�ؿ� Ưȭ ī��', '�����̾�', '�ؿ� �̿� ������ ����', 15.00, '�ſ�');
INSERT INTO card_product VALUES (202, 'card2.png', 'üũ ī��', 'Master', '�Ǽ��� üũī��', '�Ϲ�', '����ī�� ���', 0.00, 'üũ');
INSERT INTO card_product VALUES (203, 'card3.png', '���� ī��', 'Amex', '���� ���� ī��', '������', '�¶��� ĳ�ù�', 18.00, '�ſ�');
INSERT INTO card_product VALUES (204, 'card4.png', '�װ� ���ϸ��� ī��', 'VISA', '�װ��� ���� ī��', '����', '�װ� ���ϸ��� ����', 20.00, '�ſ�');
INSERT INTO card_product VALUES (205, 'card5.png', '�л� ���� üũī��', 'Master', '�л��� ī��', '�Ϲ�', '������ ����', 0.00, 'üũ');

-- user_account
INSERT INTO user_account VALUES (301, 1, 101, '111-111-111', 'ȫ�浿 ���������');
INSERT INTO user_account VALUES (302, 2, 102, '222-222-222', '��ö�� û������');
INSERT INTO user_account VALUES (303, 3, 103, '333-333-333', '�̿��� û������');
INSERT INTO user_account VALUES (304, 4, 104, '444-444-444', '�ڹμ� ���⿹��');
INSERT INTO user_account VALUES (305, 5, 105, '555-555-555', '������ �������');

-- user_card
INSERT INTO user_card VALUES (401, 1, 201);
INSERT INTO user_card VALUES (402, 2, 202);
INSERT INTO user_card VALUES (403, 3, 203);
INSERT INTO user_card VALUES (404, 4, 204);
INSERT INTO user_card VALUES (405, 5, 205);

-- account_transaction
INSERT INTO account_transaction VALUES (501, 301, 15000, 'AP001', 'ī��', TO_DATE('2024-02-01','YYYY-MM-DD'), '��Ÿ����', '010-1111-1111');
INSERT INTO account_transaction VALUES (502, 302, 50000, 'AP002', '��Ʈ', TO_DATE('2024-02-02','YYYY-MM-DD'), '�̸�Ʈ', '010-2222-2222');
INSERT INTO account_transaction VALUES (503, 303, 200000, 'AP003', '�Ƿ�', TO_DATE('2024-02-03','YYYY-MM-DD'), '���ﺴ��', '010-3333-3333');
INSERT INTO account_transaction VALUES (504, 304, 80000, 'AP004', '����', TO_DATE('2024-02-04','YYYY-MM-DD'), 'YBM���п�', '010-4444-4444');
INSERT INTO account_transaction VALUES (505, 305, 12000, 'AP005', '��ȭ', TO_DATE('2024-02-05','YYYY-MM-DD'), 'CGV', '010-5555-5555');

-- nyang_coin
INSERT INTO nyang_coin VALUES (601, TO_DATE('2024-01-10','YYYY-MM-DD'), 100.00, 1);
INSERT INTO nyang_coin VALUES (602, TO_DATE('2024-01-11','YYYY-MM-DD'), 250.50, 2);
INSERT INTO nyang_coin VALUES (603, TO_DATE('2024-01-12','YYYY-MM-DD'), 500.00, 3);
INSERT INTO nyang_coin VALUES (604, TO_DATE('2024-01-13','YYYY-MM-DD'), 750.75, 4);
INSERT INTO nyang_coin VALUES (605, TO_DATE('2024-01-14','YYYY-MM-DD'), 1000.00, 5);

-- coin_history
INSERT INTO coin_history VALUES (701, TO_DATE('2024-01-20','YYYY-MM-DD'), 100.00, 100.00, '����', 601);
INSERT INTO coin_history VALUES (702, TO_DATE('2024-01-21','YYYY-MM-DD'), 200.50, 100.50, '����', 602);
INSERT INTO coin_history VALUES (703, TO_DATE('2024-01-22','YYYY-MM-DD'), 400.00, 100.00, '���', 603);
INSERT INTO coin_history VALUES (704, TO_DATE('2024-01-23','YYYY-MM-DD'), 650.75, 150.75, '����', 604);
INSERT INTO coin_history VALUES (705, TO_DATE('2024-01-24','YYYY-MM-DD'), 800.00, 200.00, '���', 605);

-- admin
INSERT INTO admin VALUES (801, 1, 'SUPER_ADMIN', TO_DATE('2024-01-01','YYYY-MM-DD'));
INSERT INTO admin VALUES (802, 2, 'OPERATOR', TO_DATE('2024-01-02','YYYY-MM-DD'));
INSERT INTO admin VALUES (803, 3, 'VIEWER', TO_DATE('2024-01-03','YYYY-MM-DD'));
INSERT INTO admin VALUES (804, 4, 'OPERATOR', TO_DATE('2024-01-04','YYYY-MM-DD'));
INSERT INTO admin VALUES (805, 5, 'VIEWER', TO_DATE('2024-01-05','YYYY-MM-DD'));

-- card_transaction
INSERT INTO card_transaction VALUES (901, 401, 35000, 'CT001', '�ſ�', '������', TO_DATE('2024-03-01','YYYY-MM-DD'), '�Ƶ�����', '02-1111-1111');
INSERT INTO card_transaction VALUES (902, 402, 80000, 'CT002', 'üũ', '��Ʈ', TO_DATE('2024-03-02','YYYY-MM-DD'), '�Ե���Ʈ', '02-2222-2222');
INSERT INTO card_transaction VALUES (903, 403, 150000, 'CT003', '�ſ�', '����', TO_DATE('2024-03-03','YYYY-MM-DD'), '���Ż�', '02-3333-3333');
INSERT INTO card_transaction VALUES (904, 404, 500000, 'CT004', '�ſ�', '����', TO_DATE('2024-03-04','YYYY-MM-DD'), '�����װ�', '02-4444-4444');
INSERT INTO card_transaction VALUES (905, 405, 12000, 'CT005', 'üũ', '������', TO_DATE('2024-03-05','YYYY-MM-DD'), 'GS25', '02-5555-5555');

CREATE SEQUENCE user_seq
START WITH 1
INCREMENT BY 1
NOCACHE;

commit;

SELECT * FROM users;
SELECT * FROM bank_product;
SELECT * FROM card_product;
SELECT * FROM user_account;
SELECT * FROM user_card;
SELECT * FROM account_transaction;
SELECT * FROM nyang_coin;
SELECT * FROM coin_history;
SELECT * FROM admin;
SELECT * FROM card_transaction;
SELECT * FROM industry_codes;
SELECT * FROM gender_stats;
SELECT * FROM age_stats;
SELECT * FROM micro_payment_stats;
SELECT * FROM region_stats;