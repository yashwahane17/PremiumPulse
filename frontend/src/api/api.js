/**
 * API Service for PremiumPulse Frontend
 * Communicates with FastAPI backend endpoints for both Public Customer Portal and Admin Portal.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

function getAuthHeaders() {
  const token = localStorage.getItem('premiumpulse_token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // ==========================================
  // Public / Customer Auth
  // ==========================================
  async login(email, password) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Login failed. Please check your credentials.');
    }
    return res.json();
  },

  async adminLogin(email, password) {
    const res = await fetch(`${API_BASE_URL}/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Admin authentication failed. Administrator privileges required.');
    }
    return res.json();
  },

  async register(fullName, email, password) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name: fullName, email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Registration failed. Please try again.');
    }
    return res.json();
  },

  async getMe() {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Session expired or unauthorized');
    return res.json();
  },

  // ==========================================
  // Customer Portal Endpoints
  // ==========================================
  async getDashboard() {
    const res = await fetch(`${API_BASE_URL}/dashboard`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch dashboard data');
    return res.json();
  },

  async predictPremium(payload) {
    const res = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Prediction failed. Please check inputs.');
    }
    return res.json();
  },

  async getHistory() {
    const res = await fetch(`${API_BASE_URL}/predictions/history`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch prediction history');
    return res.json();
  },

  async getPredictionDetail(id) {
    const res = await fetch(`${API_BASE_URL}/predictions/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch prediction details');
    return res.json();
  },

  async updateWearable(payload) {
    const res = await fetch(`${API_BASE_URL}/wearable/update`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to update wearable data');
    }
    return res.json();
  },

  async getWearableLatest() {
    const res = await fetch(`${API_BASE_URL}/wearable/latest`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch wearable metrics');
    return res.json();
  },

  async getHealthInsights() {
    const res = await fetch(`${API_BASE_URL}/health/insights`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch health insights');
    return res.json();
  },

  async getModelMetrics() {
    const res = await fetch(`${API_BASE_URL}/model/metrics`);
    if (!res.ok) throw new Error('Failed to fetch ML model metrics');
    return res.json();
  },

  async downloadReportPdf(id) {
    const res = await fetch(`${API_BASE_URL}/reports/${id}/download`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to download PDF report');
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PremiumPulse_Report_${id}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  },

  async getProfile() {
    const res = await fetch(`${API_BASE_URL}/profile`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch user profile');
    return res.json();
  },

  async updateProfile(payload) {
    const res = await fetch(`${API_BASE_URL}/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to update health profile');
    }
    return res.json();
  },

  // ==========================================
  // Admin Portal Endpoints (Role == 'ADMIN')
  // ==========================================
  async getAdminOverview() {
    const res = await fetch(`${API_BASE_URL}/admin/overview`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to fetch admin overview');
    }
    return res.json();
  },

  async getAdminUsers({ q = '', status_filter = 'all', role_filter = 'all' } = {}) {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (status_filter !== 'all') params.set('status_filter', status_filter);
    if (role_filter !== 'all') params.set('role_filter', role_filter);

    const res = await fetch(`${API_BASE_URL}/admin/users?${params.toString()}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to fetch users list');
    }
    return res.json();
  },

  async updateUserStatus(userId, isActive) {
    const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ is_active: isActive }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to update user status');
    }
    return res.json();
  },

  async getAdminPredictions({ q = '', risk_filter = 'all', model_filter = 'all', limit = 50 } = {}) {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (risk_filter !== 'all') params.set('risk_filter', risk_filter);
    if (model_filter !== 'all') params.set('model_filter', model_filter);
    params.set('limit', limit);

    const res = await fetch(`${API_BASE_URL}/admin/predictions?${params.toString()}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to fetch predictions monitoring list');
    }
    return res.json();
  },

  async getAdminAgents() {
    const res = await fetch(`${API_BASE_URL}/admin/agents`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to fetch agent monitoring metrics');
    }
    return res.json();
  },

  async getAdminModels() {
    const res = await fetch(`${API_BASE_URL}/admin/models`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to fetch model monitoring metrics');
    }
    return res.json();
  },

  async getAdminSystemHealth() {
    const res = await fetch(`${API_BASE_URL}/admin/system-health`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to fetch system health');
    }
    return res.json();
  },

  async getAdminAnalytics() {
    const res = await fetch(`${API_BASE_URL}/admin/analytics`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to fetch platform analytics');
    }
    return res.json();
  },

  async getAdminActivityLogs({ limit = 50, activity_type = '' } = {}) {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit);
    if (activity_type) params.append('activity_type', activity_type);

    const res = await fetch(`${API_BASE_URL}/admin/activity?${params.toString()}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to fetch activity logs');
    }
    return res.json();
  }
};
