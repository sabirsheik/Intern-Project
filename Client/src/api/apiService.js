import axiosClient from './axiosClient';

/**
 * Task API Service
 * Handles all task-related API calls with centralized error handling
 */

export const taskAPI = {
  /**
   * GET /api/tasks - Get all tasks with pagination and filtering
   * @param {number} page - Current page (default: 1)
   * @param {number} limit - Items per page (default: 10)
   * @param {string} status - Filter by status: 'pending', 'in_progress', 'completed'
   * @param {number} intern_id - Filter by intern (admin only)
   * @returns {Promise<{ data, pagination }>}
   */
  getAllTasks: async (page = 1, limit = 10, status = null, intern_id = null) => {
    try {
      const params = {
        page,
        limit,
        ...(status && { status }),
        ...(intern_id && { intern_id })
      };
      const response = await axiosClient.get('/tasks', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch tasks' };
    }
  },

  /**
   * GET /api/tasks/:id - Get a single task
   * @param {number} id - Task ID
   * @returns {Promise}
   */
  getTaskById: async (id) => {
    try {
      const response = await axiosClient.get(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch task' };
    }
  },

  /**
   * POST /api/tasks - Create a new task
   * @param {Object} taskData - { intern_id, title, description, deadline, status?, estimated_hours? }
   * @returns {Promise}
   */
  createTask: async (taskData) => {
    try {
      const response = await axiosClient.post('/tasks', taskData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to create task' };
    }
  },

  /**
   * PUT /api/tasks/:id - Update a task
   * @param {number} id - Task ID
   * @param {Object} updates - Fields to update
   * @returns {Promise}
   */
  updateTask: async (id, updates) => {
    try {
      const response = await axiosClient.put(`/tasks/${id}`, updates);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to update task' };
    }
  },

  /**
   * PATCH /api/tasks/:id/status - Update task status
   * @param {number} id - Task ID
   * @param {string} status - New status: 'pending', 'in_progress', 'completed'
   * @returns {Promise}
   */
  updateTaskStatus: async (id, status) => {
    try {
      const response = await axiosClient.patch(`/tasks/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to update task status' };
    }
  },

  /**
   * DELETE /api/tasks/:id - Delete a task
   * @param {number} id - Task ID
   * @returns {Promise}
   */
  deleteTask: async (id) => {
    try {
      const response = await axiosClient.delete(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to delete task' };
    }
  },

  /**
   * GET /api/tasks/intern/:internId - Get tasks for specific intern
   * @param {number} internId - Intern ID
   * @param {number} page - Current page
   * @param {number} limit - Items per page
   * @returns {Promise}
   */
  getInternTasks: async (internId, page = 1, limit = 10) => {
    try {
      const response = await axiosClient.get(`/tasks/intern/${internId}`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch intern tasks' };
    }
  }
};

/**
 * User API Service
 */
export const userAPI = {
  /**
   * GET /api/users - Get all users
   */
  getAllUsers: async () => {
    try {
      const response = await axiosClient.get('/users');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch users' };
    }
  },

  /**
   * POST /api/users - Create new user
   */
  createUser: async (userData) => {
    try {
      const response = await axiosClient.post('/users', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to create user' };
    }
  },

  /**
   * DELETE /api/users/:id - Delete user
   */
  deleteUser: async (id) => {
    try {
      const response = await axiosClient.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to delete user' };
    }
  }
};

/**
 * Internship API Service
 */
export const internshipAPI = {
  /**
   * GET /api/internships - Get all internships
   */
  getAllInternships: async () => {
    try {
      const response = await axiosClient.get('/internships');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch internships' };
    }
  },

  /**
   * POST /api/internships - Create internship
   */
  createInternship: async (internshipData) => {
    try {
      const response = await axiosClient.post('/internships', internshipData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to create internship' };
    }
  }
};

/**
 * Intern Dashboard API Service  
 */
export const internAPI = {
  /**
   * GET /api/intern/dashboard - Get intern dashboard data
   */
  getDashboard: async () => {
    try {
      const response = await axiosClient.get('/intern/dashboard');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch dashboard data' };
    }
  },

  /**
   * GET /api/intern/tasks - Get intern's tasks
   */
  getTasks: async (page = 1, limit = 6, status = null) => {
    try {
      const params = { page, limit, ...(status && { status }) };
      const response = await axiosClient.get('/intern/tasks', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch tasks' };
    }
  },

  /**
   * PATCH /api/intern/task/:id/status - Update task status
   */
  updateTaskStatus: async (id, status) => {
    try {
      const response = await axiosClient.patch(`/intern/task/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to update task status' };
    }
  },

  /**
   * GET /api/intern/notifications - Get notifications
   */
  getNotifications: async () => {
    try {
      const response = await axiosClient.get('/intern/notifications');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch notifications' };
    }
  },

  /**
   * PUT /api/intern/profile - Update profile
   */
  updateProfile: async (profileData) => {
    try {
      const response = await axiosClient.put('/intern/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to update profile' };
    }
  }
};

/**
 * Report API Service
 */
export const reportAPI = {
  /**
   * GET /api/reports - Get all reports
   */
  getAllReports: async () => {
    try {
      const response = await axiosClient.get('/reports');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch reports' };
    }
  },

  /**
   * POST /api/reports - Submit report
   */
  submitReport: async (content) => {
    try {
      const response = await axiosClient.post('/reports', { content });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to submit report' };
    }
  }
};
