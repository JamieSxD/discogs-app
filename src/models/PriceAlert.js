const db = require('../config/database');

class PriceAlert {
  static async create(alertData) {
    const {
      userId, discogsReleaseId, releaseTitle, artist, targetPrice,
      currency = 'USD', condition, locationFilter, locationRadius = 0,
      minMediaCondition, minSleeveCondition, excludeReprints = false,
      onlyOriginalPressing = false
    } = alertData;

    const { rows } = await db.query(
      `INSERT INTO price_alerts (
        user_id, discogs_release_id, release_title, artist, target_price,
        currency, condition, location_filter, location_radius,
        min_media_condition, min_sleeve_condition, exclude_reprints,
        only_original_pressing
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *`,
      [
        userId, discogsReleaseId, releaseTitle, artist, targetPrice,
        currency, condition, locationFilter, locationRadius,
        minMediaCondition, minSleeveCondition, excludeReprints,
        onlyOriginalPressing
      ]
    );

    return rows[0];
  }

  static async findByUserId(userId, limit = 50, offset = 0) {
    const { rows } = await db.query(
      `SELECT * FROM price_alerts
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    return rows;
  }

  static async findById(id) {
    const { rows } = await db.query('SELECT * FROM price_alerts WHERE id = $1', [id]);
    return rows[0] || null;
  }

  static async findActiveAlerts() {
    const { rows } = await db.query(
      `SELECT * FROM price_alerts
       WHERE is_active = true
       AND (last_checked IS NULL OR last_checked < NOW() - INTERVAL '1 hour' * check_frequency_hours)`
    );
    return rows;
  }

  static async updateLastChecked(id) {
    await db.query(
      'UPDATE price_alerts SET last_checked = NOW() WHERE id = $1',
      [id]
    );
  }

  static async toggleActive(id, isActive) {
    const { rows } = await db.query(
      'UPDATE price_alerts SET is_active = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [isActive, id]
    );
    return rows[0];
  }

  static async delete(id) {
    const { rows } = await db.query(
      'DELETE FROM price_alerts WHERE id = $1 RETURNING *',
      [id]
    );
    return rows[0];
  }

  static async countByUserId(userId) {
    const { rows } = await db.query(
      'SELECT COUNT(*) as count FROM price_alerts WHERE user_id = $1',
      [userId]
    );
    return parseInt(rows[0].count);
  }
}

module.exports = PriceAlert;