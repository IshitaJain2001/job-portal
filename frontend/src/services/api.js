
const API_BASE_URL = 'http://localhost:5000/api';

const getAuthToken = () => localStorage.getItem('authToken');

const apiCall = async (endpoint, method = 'GET', body = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API Error');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth APIs
export const authAPI = {
  register: (email, password, name, userType, companyName = null) =>
    apiCall('/auth/register', 'POST', {
      email,
      password,
      name,
      userType,
      companyName,
    }),

  login: (email, password) =>
    apiCall('/auth/login', 'POST', { email, password }),

  getCurrentUser: () => apiCall('/auth/me', 'GET'),
};

// Jobs APIs
export const jobsAPI = {
  getAllJobs: (category = null, location = null, search = null) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (location) params.append('location', location);
    if (search) params.append('search', search);

    return apiCall(`/jobs${params.toString() ? '?' + params : ''}`, 'GET');
  },

  getMyJobs: () => apiCall('/jobs/my-jobs', 'GET'),

  getJobById: id => apiCall(`/jobs/${id}`, 'GET'),

  createJob: jobData => apiCall('/jobs', 'POST', jobData),

  updateJob: (id, jobData) => apiCall(`/jobs/${id}`, 'PUT', jobData),

  deleteJob: id => apiCall(`/jobs/${id}`, 'DELETE'),
};

// Saved Jobs APIs
export const savedJobsAPI = {
  getSavedJobs: () => apiCall('/savedjobs', 'GET'),

  saveJob: jobId => apiCall(`/savedjobs/${jobId}`, 'POST'),

  removeSavedJob: jobId => apiCall(`/savedjobs/${jobId}`, 'DELETE'),
};

// Applications APIs
export const applicationsAPI = {
  applyToJob: (jobId, coverLetter = '', resume = '') =>
    apiCall(`/applications/${jobId}`, 'POST', { coverLetter, resume }),

  getMyApplications: () => apiCall('/applications/user-applications', 'GET'),

  getReceivedApplications: () => apiCall('/applications/my-applications', 'GET'),

  updateApplicationStatus: (applicationId, status) =>
    apiCall(`/applications/${applicationId}/status`, 'PUT', { status }),
};
