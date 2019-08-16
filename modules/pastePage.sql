

CREATE TABLE IF NOT EXISTS userid (
    table_id INT AUTO_INCREMENT,
    transaction_id VARCHAR(255) NOT NULL,
    transaction_date DATE,
    transaction_time TIME,
    transaction_type VARCHAR(255),
    transaction_amount VARCHAR(255),
    transaction_currency VARCHAR(5),
    transaction_reciept BOOLEAN,
    previous_transaction_hash TEXT,
    transaction_hash TEXT,
    description TEXT,
    PRIMARY KEY (task_id)
)  ENGINE=INNODB;