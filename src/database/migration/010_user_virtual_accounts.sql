CREATE TABLE IF NOT EXISTS user_virtual_accounts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    provider VARCHAR(30) NOT NULL DEFAULT 'MONNIFY',
    account_reference VARCHAR(120) NOT NULL UNIQUE,
    account_number VARCHAR(20) NOT NULL UNIQUE,
    bank_name VARCHAR(100),
    bank_code VARCHAR(20),
    account_name VARCHAR(150),
    currency VARCHAR(10) DEFAULT 'NGN',
    status ENUM(
        'ACTIVE',
        'INACTIVE'
    ) DEFAULT 'ACTIVE',

    response_body JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,


    CONSTRAINT fk_virtual_account_user
        FOREIGN KEY(user_id)
        REFERENCES users(id),


    INDEX idx_virtual_account_user(user_id),

    INDEX idx_virtual_account_reference(account_reference)

);