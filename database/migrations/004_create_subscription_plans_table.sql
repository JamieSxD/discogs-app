CREATE TABLE subscription_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  stripe_price_id VARCHAR(255) NOT NULL,
  price_cents INTEGER NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  billing_interval VARCHAR(20) NOT NULL CHECK (billing_interval IN ('month', 'year')),
  alert_limit INTEGER NOT NULL,
  features JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO subscription_plans (name, stripe_price_id, price_cents, billing_interval, alert_limit, features) VALUES
('Free', 'free', 0, 'month', 30, '{"basic_alerts": true, "email_notifications": true}'),
('Collector', 'price_collector_monthly', 199, 'month', 100, '{"priority_notifications": true, "location_filtering": true, "price_history": true, "condition_options": true}'),
('Pro', 'price_pro_monthly', 999, 'month', -1, '{"unlimited_alerts": true, "instant_notifications": true, "bulk_management": true, "analytics": true, "api_access": true, "priority_support": true}');