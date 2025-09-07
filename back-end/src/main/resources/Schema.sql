-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    full_name VARCHAR(100),
    active BOOLEAN DEFAULT TRUE
);

-- Add indexes for better performance (compat with older MySQL/MariaDB)
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
