CREATE TABLE IF NOT EXISTS payment_transactions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    provider VARCHAR(30) NOT NULL,
    payment_reference VARCHAR(120) NOT NULL UNIQUE,
    transaction_reference VARCHAR(120) UNIQUE,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'NGN',
    payment_method VARCHAR(30),
    payment_description VARCHAR(255),
    status ENUM(
        'PENDING',
        'SUCCESS',
        'FAILED',
        'CANCELLED'
    ) NOT NULL DEFAULT 'PENDING',

    response_body JSON,
    failure_reason TEXT,
    credited_at TIMESTAMP NULL,
    wallet_credited BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_payment_transactions_user
        FOREIGN KEY (user_id)
        REFERENCES users(id),


    INDEX idx_payment_user(user_id),

    INDEX idx_payment_status(status)

    -- INDEX idx_payment_reference(payment_reference),

    -- INDEX idx_transaction_reference(transaction_reference)
   
);