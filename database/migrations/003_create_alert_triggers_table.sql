CREATE TABLE alert_triggers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  alert_id UUID NOT NULL REFERENCES price_alerts(id) ON DELETE CASCADE,
  listing_id VARCHAR(255) NOT NULL,
  listing_url TEXT NOT NULL,
  actual_price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  condition VARCHAR(50) NOT NULL,
  seller_name VARCHAR(255),
  seller_rating DECIMAL(3,2),
  shipping_price DECIMAL(10,2),
  location VARCHAR(255),
  notes TEXT,
  email_sent BOOLEAN DEFAULT false,
  email_sent_at TIMESTAMP,
  triggered_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_alert_triggers_alert_id ON alert_triggers(alert_id);
CREATE INDEX idx_alert_triggers_triggered_at ON alert_triggers(triggered_at);
CREATE INDEX idx_alert_triggers_email_sent ON alert_triggers(email_sent);