CREATE TABLE price_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  discogs_release_id VARCHAR(255) NOT NULL,
  release_title VARCHAR(500) NOT NULL,
  artist VARCHAR(255) NOT NULL,
  target_price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  condition VARCHAR(50) NOT NULL CHECK (condition IN ('Mint (M)', 'Near Mint (NM or M-)', 'Very Good Plus (VG+)', 'Very Good (VG)', 'Good Plus (G+)', 'Good (G)', 'Fair (F)', 'Poor (P)')),
  location_filter VARCHAR(255),
  location_radius INTEGER DEFAULT 0,
  min_media_condition VARCHAR(50),
  min_sleeve_condition VARCHAR(50),
  exclude_reprints BOOLEAN DEFAULT false,
  only_original_pressing BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  last_checked TIMESTAMP,
  check_frequency_hours INTEGER DEFAULT 6,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_price_alerts_user_id ON price_alerts(user_id);
CREATE INDEX idx_price_alerts_discogs_release_id ON price_alerts(discogs_release_id);
CREATE INDEX idx_price_alerts_is_active ON price_alerts(is_active);
CREATE INDEX idx_price_alerts_last_checked ON price_alerts(last_checked);