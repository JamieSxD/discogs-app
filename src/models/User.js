const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create({ email, password, firstName, lastName }) {
    const passwordHash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS));

    const { rows } = await db.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, email_verification_token)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [email, passwordHash, firstName, lastName, this.generateVerificationToken()]
    );

    return this.sanitizeUser(rows[0]);
  }

  static async updateDiscogsToken(userId, token, username) {
    const { rows } = await db.query(
      `UPDATE users SET
       discogs_token = $1,
       discogs_username = $2,
       updated_at = NOW()
       WHERE id = $3 RETURNING *`,
      [token, username, userId]
    );
    return this.sanitizeUser(rows[0]);
  }

  static async findByEmail(email) {
    const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0] || null;
  }

  static async findById(id) {
    const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    return rows[0] ? this.sanitizeUser(rows[0]) : null;
  }

  static async updateDiscogsToken(userId, token, username) {
    const { rows } = await db.query(
      `UPDATE users SET discogs_token = $1, discogs_username = $2, updated_at = NOW()
       WHERE id = $3 RETURNING *`,
      [token, username, userId]
    );
    return this.sanitizeUser(rows[0]);
  }

  static async updateSubscription(userId, tier, stripeCustomerId, active = true, expiresAt = null) {
    const alertLimits = { free: 30, collector: 100, pro: -1 };

    const { rows } = await db.query(
      `UPDATE users SET
        subscription_tier = $1,
        stripe_customer_id = $2,
        subscription_active = $3,
        subscription_expires_at = $4,
        alert_limit = $5,
        updated_at = NOW()
       WHERE id = $6 RETURNING *`,
      [tier, stripeCustomerId, active, expiresAt, alertLimits[tier], userId]
    );
    return this.sanitizeUser(rows[0]);
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  static sanitizeUser(user) {
    if (!user) return null;
    const { password_hash, discogs_token, ...sanitized } = user;
    return sanitized;
  }

  static generateVerificationToken() {
    return require('crypto').randomBytes(32).toString('hex');
  }
}

module.exports = User;