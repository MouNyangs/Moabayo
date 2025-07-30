
-- Table: user
CREATE TABLE user (
    id BIGINT(20) PRIMARY KEY,
    create_date DATETIME(6),
    modify_date DATETIME(6),
    account_num VARCHAR(255),
    address VARCHAR(255),
    address_detail VARCHAR(255),
    zip_code VARCHAR(255),
    auto_login INT,
    email VARCHAR(255),
    hash_code VARCHAR(255),
    mydata_access_token VARCHAR(255),
    name VARCHAR(255),
    password VARCHAR(255),
    phone VARCHAR(255),
    refresh_token VARCHAR(255),
    simple_password VARCHAR(255),
    is_admin BOOLEAN DEFAULT FALSE
);

-- Table: transaction
CREATE TABLE transaction (
    id BIGINT(20) PRIMARY KEY,
    approved_amount BIGINT(20),
    approved_num VARCHAR(255),
    card_history_id BIGINT(20),
    card_id BIGINT(20),
    card_type VARCHAR(255),
    category VARCHAR(255),
    date_time DATETIME(6),
    shop_name VARCHAR(255),
    shop_number VARCHAR(255),
    user_id BIGINT(20),
    FOREIGN KEY (user_id) REFERENCES user(id)
);

-- Table: nyang_coin
CREATE TABLE nyang_coin (
    id BIGINT(20) PRIMARY KEY,
    create_date DATETIME(6),
    modify_date DATETIME(6),
    end_date DATETIME(6),
    money BIGINT(20),
    user_id BIGINT(20),
    FOREIGN KEY (user_id) REFERENCES user(id)
);

-- Table: habit
CREATE TABLE habit (
    id BIGINT(20) PRIMARY KEY,
    create_date DATETIME(6),
    modify_date DATETIME(6),
    end_date DATETIME(6),
    habit_name VARCHAR(255),
    saving BIGINT(20),
    state INT,
    target_money BIGINT(20),
    title VARCHAR(255),
    user_id BIGINT(20),
    FOREIGN KEY (user_id) REFERENCES user(id)
);

-- Table: habit_log
CREATE TABLE habit_log (
    id BIGINT(20) PRIMARY KEY,
    create_date DATETIME(6),
    save_day DATETIME(6),
    save_money BIGINT(20),
    habit_id BIGINT(20),
    FOREIGN KEY (habit_id) REFERENCES habit(id)
);

-- Table: habit_habit_log
CREATE TABLE habit_habit_log (
    habit_id BIGINT(20),
    habit_log_id BIGINT(20),
    PRIMARY KEY (habit_id, habit_log_id),
    FOREIGN KEY (habit_id) REFERENCES habit(id),
    FOREIGN KEY (habit_log_id) REFERENCES habit_log(id)
);

-- Table: coin_history
CREATE TABLE coin_history (
    id BIGINT(20) PRIMARY KEY,
    create_date DATETIME(6),
    modify_date DATETIME(6),
    total_amt BIGINT(20),
    trans_amt BIGINT(20),
    trans_type VARCHAR(255),
    tikkle_id BIGINT(20),
    FOREIGN KEY (tikkle_id) REFERENCES tikkle(id)
);

-- Add is_admin column to user table
ALTER TABLE user ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;

-- Table: admin
CREATE TABLE admin (
    id BIGINT(20) PRIMARY KEY,
    user_id BIGINT(20) UNIQUE,
    role VARCHAR(50),
    create_date DATETIME(6),
    FOREIGN KEY (user_id) REFERENCES user(id)
);