import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export interface Task {
  _id: string
  text: string
  completed: boolean
  priority: string
}

export const api = {
  async getTasks(statusFilter = 'all', priorityFilter = 'all') {
    const response = await axios.get(`${API_URL}/api/tasks`, {
      params: {
        status: statusFilter,
        priority: priorityFilter,
      },
    })
    return response.data
  },

  async createTask(task: Omit<Task, '_id'>) {
    const response = await axios.post(`${API_URL}/api/tasks`, task)
    return response.data
  },

  async updateTask(id: string, updates: Partial<Task>) {
    const response = await axios.patch(`${API_URL}/api/tasks/${id}`, updates)
    return response.data
  },

  async deleteTask(id: string) {
    await axios.delete(`${API_URL}/api/tasks/${id}`)
  },

  // New search function
  async searchTasks(query: string, priority: string) {
    const response = await axios.get(`${API_URL}/api/tasks/search`, {
      params: {
        query,
        priority,
      },
    })
    return response.data
  },
}
