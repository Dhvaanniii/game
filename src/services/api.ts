const API_BASE_URL = 'http://localhost:3001/api';

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async register(userData: any) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.success) {
      this.token = response.token;
      localStorage.setItem('authToken', response.token);
    }

    return response;
  }

  async login(username: string, password: string) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    if (response.success) {
      this.token = response.token;
      localStorage.setItem('authToken', response.token);
    }

    return response;
  }

  async getCurrentUser() {
    return await this.request('/auth/me');
  }

  async updateProfile(userData: any) {
    return await this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async addCoins(amount: number) {
    return await this.request('/auth/coins', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  }

  // Level methods
  async getLevelsByCategory(category: string) {
    return await this.request(`/levels/${category}`);
  }

  async getLevel(category: string, levelNumber: number) {
    return await this.request(`/levels/${category}/${levelNumber}`);
  }

  async uploadPDF(category: string, file: File) {
    const formData = new FormData();
    formData.append('pdf', file);

    return await this.request(`/levels/upload/${category}`, {
      method: 'POST',
      headers: {
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      body: formData,
    });
  }

  async deleteLevel(levelId: string) {
    return await this.request(`/levels/${levelId}`, {
      method: 'DELETE',
    });
  }

  async updateLevel(levelId: string, updateData: any) {
    return await this.request(`/levels/${levelId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async completeLevel(levelId: string, completionData: any) {
    return await this.request(`/levels/${levelId}/complete`, {
      method: 'POST',
      body: JSON.stringify(completionData),
    });
  }

  // Progress methods
  async getUserProgress(userId: string) {
    return await this.request(`/progress/user/${userId}`);
  }

  async getUserStats(userId: string) {
    return await this.request(`/progress/stats/${userId}`);
  }

  async getWeeklyProgress(userId: string, weekKey: string) {
    return await this.request(`/progress/weekly/${userId}/${weekKey}`);
  }

  async getLeaderboard(category?: string, limit = 10) {
    const endpoint = category 
      ? `/progress/leaderboard/${category}?limit=${limit}`
      : `/progress/leaderboard?limit=${limit}`;
    return await this.request(endpoint);
  }

  // Admin methods
  async getAllUsers() {
    return await this.request('/admin/users');
  }

  async getDashboardStats() {
    return await this.request('/admin/dashboard');
  }

  async getUserDetails(userId: string) {
    return await this.request(`/admin/users/${userId}`);
  }

  async updateUser(userId: string, userData: any) {
    return await this.request(`/admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(userId: string) {
    return await this.request(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
  }

  async getAllLevels() {
    return await this.request('/levels/admin/all');
  }

  logout() {
    this.token = null;
    localStorage.removeItem('authToken');
  }
}

export const apiService = new ApiService();
export default apiService;