export interface Task {
  id: number // or string based on your database
  _id?: string // Optional if using MongoDB or similar
  text: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
}
