CREATE TABLE IF NOT EXISTS wallet_history (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  wallet_id BIGINT UNSIGNED NOT NULL,
  transaction_type VARCHAR(20) NOT NULL, -- credit, debit
  amount DECIMAL(10,2) NOT NULL,
  balance_before DECIMAL(10,2) NOT NULL,
  balance_after DECIMAL(10,2) NOT NULL,
  reference_id VARCHAR(200) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT uq_wallet_history UNIQUE (wallet_id, reference_id, transaction_type),

  CONSTRAINT fk_wallet_history_wallet
    FOREIGN KEY (wallet_id)
    REFERENCES wallet(id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);