<template>
  <v-container class="pa-4">
    <v-card class="mx-auto" max-width="800">
      <v-card-title class="text-h4 mb-4"> Task Management </v-card-title>

      <v-card-text>
        <!-- Add Task Form -->
        <v-row class="mb-4">
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="newTask"
              label="Add a new task..."
              @keyup.enter="addTask"
              hide-details
              dense
              outlined
            />
          </v-col>
          <v-col cols="12" sm="3">
            <v-select
              v-model="newTaskPriority"
              :items="priorityOptions"
              label="Priority"
              hide-details
              dense
              outlined
            />
          </v-col>
          <v-col cols="12" sm="3">
            <v-btn
              color="primary"
              block
              @click="addTask"
              :disabled="!newTask.trim()"
            >
              <v-icon left>mdi-plus</v-icon>
              Add Task
            </v-btn>
          </v-col>
        </v-row>

        <!-- Filters -->
        <v-row class="mb-4">
          <v-col cols="12" sm="6">
            <v-select
              v-model="statusFilter"
              :items="statusOptions"
              label="Status Filter"
              hide-details
              dense
              outlined
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-select
              v-model="priorityFilter"
              :items="priorityFilterOptions"
              label="Priority Filter"
              hide-details
              dense
              outlined
            />
          </v-col>
        </v-row>

        <!-- Task List -->
        <v-list>
          <v-list-item
            v-for="task in filteredTasks"
            :key="task.id"
            :class="{ 'bg-grey-lighten-4': task.completed }"
          >
            <template v-slot:prepend>
              <v-checkbox
                v-model="task.completed"
                @change="updateFilteredTasks(task)"
                hide-details
                color="success"
              />
            </template>

            <v-list-item-content>
              <template v-if="editingId === task.id">
                <v-text-field
                  v-model="editingText"
                  @blur="finishEditing(task)"
                  @keyup.enter="finishEditing(task)"
                  hide-details
                  dense
                  outlined
                  autofocus
                />
              </template>
              <template v-else>
                <v-list-item-title
                  :class="{ 'text-decoration-line-through': task.completed }"
                >
                  {{ task.text }}
                </v-list-item-title>
              </template>
            </v-list-item-content>

            <template v-slot:append>
              <v-chip
                :color="getPriorityColor(task.priority)"
                class="mr-2"
                size="small"
                label
              >
                {{ task.priority }}
              </v-chip>

              <v-btn
                icon="mdi-pencil"
                variant="text"
                size="small"
                @click="startEditing(task)"
                class="mr-2"
              />
              <v-btn
                icon="mdi-delete"
                variant="text"
                size="small"
                color="error"
                @click="openDeleteDialog(task)"
              />
            </template>
          </v-list-item>
        </v-list>

        <!-- No Tasks Message -->
        <v-row v-if="filteredTasks.length === 0" class="mt-4">
          <v-col cols="12" class="text-center">
            <v-alert type="info" text="No tasks found matching your filters" />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title>Delete Task</v-card-title>
        <v-card-text> Are you sure you want to delete this task? </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="deleteDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn color="error" variant="text" @click="confirmDelete">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { api } from '../api/task'

interface Task {
  [x: string]: any
  id: number
  text: string
  completed: boolean
  priority: string
}

const tasks = ref<Task[]>([])
const newTask = ref('')
const newTaskPriority = ref<Task['priority']>('medium')
const editingId = ref<number | null>(null)
const editingText = ref('')
const statusFilter = ref('all')
const priorityFilter = ref('all')
const deleteDialog = ref(false)
const taskToDelete = ref<Task | null>(null)

const loadTasks = async () => {
  tasks.value = await api.getTasks(statusFilter.value, priorityFilter.value)
}

// Watch filters for changes
watch([statusFilter, priorityFilter], async () => {
  await loadTasks()
})

// Load initial data
onMounted(async () => {
  await loadTasks()
})

const priorityOptions = [
  { title: 'Low', value: 'low' },
  { title: 'Medium', value: 'medium' },
  { title: 'High', value: 'high' },
]

const statusOptions = [
  { title: 'All', value: 'all' },
  { title: 'Active', value: 'active' },
  { title: 'Completed', value: 'completed' },
]

const priorityFilterOptions = [
  { title: 'All Priorities', value: 'all' },
  { title: 'Low', value: 'low' },
  { title: 'Medium', value: 'medium' },
  { title: 'High', value: 'high' },
]

const getPriorityColor = (priority: Task['priority']) => {
  switch (priority) {
    case 'high':
      return 'error'
    case 'medium':
      return 'warning'
    case 'low':
      return 'success'
    default:
      return 'grey'
  }
}

const addTask = async () => {
  if (newTask.value.trim()) {
    const task = await api.createTask({
      text: newTask.value,
      completed: false,
      priority: newTaskPriority.value,
    })
    tasks.value.push(task)
    newTask.value = ''
  }
}

const openDeleteDialog = (task: Task) => {
  taskToDelete.value = task
  deleteDialog.value = true
}

const confirmDelete = async () => {
  if (taskToDelete.value) {
    await api.deleteTask(taskToDelete.value._id)
    const index = tasks.value.findIndex(t => t._id === taskToDelete.value!._id)
    if (index > -1) {
      tasks.value.splice(index, 1)
    }
    deleteDialog.value = false
    taskToDelete.value = null
  }
}

const toggleComplete = (task: Task) => {
  const index = tasks.value.findIndex(t => t.id === task.id)
  if (index > -1) {
    tasks.value[index].completed = !tasks.value[index].completed
  }
}

const updateFilteredTasks = async (task: Task) => {
  await api.updateTask(task._id, { completed: task.completed })
  await loadTasks()
}

const startEditing = (task: Task) => {
  editingId.value = task.id
  editingText.value = task.text
}

const finishEditing = async (task: Task) => {
  if (editingText.value.trim()) {
    await api.updateTask(task._id, { text: editingText.value })
    task.text = editingText.value
  }
  editingId.value = null
  editingText.value = ''
}

const filteredTasks = computed(() => {
  return tasks.value.filter(task => {
    const statusMatch =
      statusFilter.value === 'all'
        ? true
        : statusFilter.value === 'completed'
          ? task.completed
          : !task.completed

    const priorityMatch =
      priorityFilter.value === 'all'
        ? true
        : task.priority === priorityFilter.value

    return statusMatch && priorityMatch
  })
})
</script>
