CREATE TABLE IF NOT EXISTS wallet_history (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  wallet_id BIGINT UNSIGNED NOT NULL,
  transaction_type VARCHAR(20) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  balance_before DECIMAL(10,2) NOT NULL,
  balance_after DECIMAL(10,2) NOT NULL,
  reference_id VARCHAR(200) NOT NULL,
  description TEXT,
  transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,


  FOREIGN KEY (wallet_id)
  REFERENCES wallet(id)
  ON DELETE CASCADE
);