CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  discogs_username VARCHAR(255),
  discogs_token TEXT,
  subscription_tier VARCHAR(50) DEFAULT 'free' CHECK (subscription_tier IN ('free', 'collector', 'pro')),
  alert_limit INTEGER DEFAULT 30,
  alerts_used INTEGER DEFAULT 0,
  stripe_customer_id VARCHAR(255),
  subscription_active BOOLEAN DEFAULT false,
  subscription_expires_at TIMESTAMP,
  email_verified BOOLEAN DEFAULT false,
  email_verification_token VARCHAR(255),
  password_reset_token VARCHAR(255),
  password_reset_expires TIMESTAMP,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_discogs_username ON users(discogs_username);
CREATE INDEX idx_users_subscription_tier ON users(subscription_tier);