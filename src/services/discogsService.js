const axios = require('axios');

class DiscogsService {
  constructor(userToken) {
    this.api = axios.create({
      baseURL: process.env.DISCOGS_API_URL,
      headers: {
        'User-Agent': process.env.DISCOGS_USER_AGENT,
        'Authorization': `Discogs token=${userToken}`
      }
    });
  }

  async getUserProfile() {
    const response = await this.api.get('/oauth/identity');
    return response.data;
  }

  async getUserCollection(username, page = 1) {
    const response = await this.api.get(`/users/${username}/collection/folders/0/releases`, {
      params: { page, per_page: 50 }
    });
    return response.data;
  }

  async getUserWantlist(username, page = 1) {
    const response = await this.api.get(`/users/${username}/wants`, {
      params: { page, per_page: 50 }
    });
    return response.data;
  }

  async getReleaseMarketplace(releaseId) {
    const response = await this.api.get(`/marketplace/listings`, {
      params: { release_id: releaseId, status: 'For Sale' }
    });
    return response.data;
  }

  async getRelease(releaseId) {
    const response = await this.api.get(`/releases/${releaseId}`);
    return response.data;
  }
}

module.exports = DiscogsService;