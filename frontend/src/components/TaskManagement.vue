<template>
  <div
    class="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500"
  >
    <v-container class="py-8">
      <v-card
        class="mx-auto backdrop-blur-sm bg-white/90 rounded-xl shadow-xl"
        max-width="1000"
        elevation="0"
      >
        <v-card-title class="text-center pt-6 pb-2">
          <h1
            class="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text"
          >
            Task Management
          </h1>
        </v-card-title>

        <v-card-text class="px-4 md:px-6">
          <!-- Add Task Form -->
          <v-row class="mb-6">
            <v-col cols="12" md="6">
              <v-text-field
                v-model="newTask"
                label="Add a new task..."
                @keyup.enter="addTask"
                hide-details
                variant="outlined"
                class="rounded-lg"
                bg-color="white"
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="newTaskPriority"
                :items="priorityOptions"
                label="Priority"
                hide-details
                variant="outlined"
                class="rounded-lg"
                bg-color="white"
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-btn
                color="primary"
                block
                @click="addTask"
                :disabled="!newTask.trim()"
                class="rounded-lg h-[56px] text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                elevation="2"
              >
                <v-icon left class="mr-2">mdi-plus</v-icon>
                Add Task
              </v-btn>
            </v-col>
          </v-row>

          <!-- Filters -->
          <v-row class="mb-6">
            <v-col cols="12" sm="6">
              <v-select
                v-model="statusFilter"
                :items="statusOptions"
                label="Status Filter"
                hide-details
                variant="outlined"
                class="rounded-lg"
                bg-color="white"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                v-model="priorityFilter"
                :items="priorityFilterOptions"
                label="Priority Filter"
                hide-details
                variant="outlined"
                class="rounded-lg"
                bg-color="white"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="searchQuery"
                label="Search Tasks"
                hide-details
                variant="outlined"
                class="rounded-lg"
                bg-color="white"
                append-inner-icon="mdi-magnify"
                @input="searchTasks"
              />
            </v-col>
          </v-row>

          <!-- Loader -->
          <v-skeleton-loader
            v-if="loading"
            type="list-item-two-line, actions"
          ></v-skeleton-loader>

          <!-- Task List -->
          <v-list
            class="d-none d-sm-block bg-transparent rounded-xl overflow-hidden"
          >
            <v-list-item
              v-for="task in filteredTasks"
              :key="task.id"
              :class="{
                'bg-gray-50/50 hover:bg-gray-100/50 transition-colors':
                  !task.completed,
                'bg-gray-100/50': task.completed,
              }"
              class="mb-2 rounded-lg"
            >
              <template v-slot:prepend>
                <v-checkbox
                  v-model="task.completed"
                  @change="updateFilteredTasks(task)"
                  hide-details
                  color="success"
                  class="mr-2"
                />
                <v-chip
                  :color="getPriorityColor(task.priority)"
                  size="small"
                  label
                  variant="elevated"
                  class="px-3"
                >
                  {{ task.priority }}
                </v-chip>
              </template>
              <v-list-item-content class="py-2">
                <template v-if="editingId === task._id">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div class="col-span-1 md:col-span-2">
                      <v-text-field
                        v-model="editingText"
                        @keyup.enter="finishEditing(task)"
                        hide-details
                        variant="outlined"
                        density="comfortable"
                        placeholder="Task text"
                        class="mb-2 px-4"
                        autofocus
                      />
                    </div>

                    <div class="w-full">
                      <v-select
                        v-model="editingPriority"
                        :items="priorityOptions"
                        hide-details
                        variant="outlined"
                        density="comfortable"
                        placeholder="Priority"
                        class="mb-2 md:mb-0 px-4"
                        @change="updatePriority(task, editingPriority)"
                      />
                    </div>

                    <div class="flex justify-end md:justify-start items-center">
                      <v-btn
                        prepend-icon="mdi-cancel"
                        color="error"
                        @click="editingId = null"
                        class="rounded-lg w-full md:w-auto ml-4"
                      >
                        Cancel
                      </v-btn>
                      <v-btn
                        prepend-icon="mdi-check-circle"
                        color="success"
                        @click="finishEditing(task)"
                        class="rounded-lg w-full md:w-auto ml-4"
                      >
                        Save
                      </v-btn>
                    </div>
                  </div>
                </template>

                <template v-else>
                  <div
                    class="flex flex-col sm:flex-row items-start sm:items-center gap-2 px-4"
                  >
                    <v-list-item-title
                      :class="{
                        'text-decoration-line-through text-gray-500':
                          task.completed,
                        'font-medium': !task.completed,
                        'break-words w-full': true,
                      }"
                    >
                      {{ task.text }}
                    </v-list-item-title>
                  </div>
                </template>
              </v-list-item-content>

              <template v-slot:append>
                <div class="flex items-center gap-2">
                  <v-btn
                    icon="mdi-pencil"
                    variant="text"
                    size="small"
                    @click="startEditing(task)"
                    class="mr-1"
                  />
                  <v-btn
                    icon="mdi-delete"
                    variant="text"
                    size="small"
                    color="error"
                    @click="openDeleteDialog(task)"
                  />
                </div>
              </template>
            </v-list-item>
          </v-list>

          <v-list-item
            v-for="task in filteredTasks"
            :key="task.id"
            :class="{
              'bg-gray-50/50 hover:bg-gray-100/50 transition-colors':
                !task.completed,
              'bg-gray-100/50': task.completed,
            }"
            class="d-block d-sm-none mb-3 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all"
          >
            <div class="w-full flex flex-col sm:flex-row gap-4 p-4">
              <!-- Checkbox Section -->
              <div class="flex sm:items-center">
                <v-checkbox
                  v-model="task.completed"
                  @change="updateFilteredTasks(task)"
                  hide-details
                  color="success"
                  class="mt-1"
                >
                </v-checkbox>
              </div>
              <!-- Content Section -->
              <div class="flex-grow">
                <template v-if="editingId === task._id">
                  <div class="grid gap-4">
                    <div class="w-full">
                      <label
                        class="text-sm font-medium text-gray-700 mb-1 block"
                      >
                        Task Description
                      </label>
                      <v-text-field
                        v-model="editingText"
                        @keyup.enter="finishEditing(task)"
                        hide-details
                        variant="outlined"
                        density="comfortable"
                        placeholder="Enter task description"
                        class="mb-3"
                        bg-color="white"
                        autofocus
                      />
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          class="text-sm font-medium text-gray-700 mb-1 block"
                        >
                          Priority Level
                        </label>
                        <v-select
                          v-model="editingPriority"
                          :items="priorityOptions"
                          hide-details
                          variant="outlined"
                          density="comfortable"
                          placeholder="Select priority"
                          bg-color="white"
                          @change="updatePriority(task, editingPriority)"
                        />
                      </div>

                      <div class="flex items-end mt-2">
                        <v-btn
                          prepend-icon="mdi-cancel"
                          color="error"
                          @click="editingId = null"
                          class="rounded-lg w-full md:w-auto"
                        >
                          Cancel
                        </v-btn>
                        <v-btn
                          prepend-icon="mdi-check-circle"
                          color="success"
                          @click="finishEditing(task)"
                          class="rounded-lg w-full md:w-auto ml-4"
                        >
                          Save
                        </v-btn>
                      </div>
                    </div>
                  </div>
                </template>

                <template v-else>
                  <div
                    class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                  >
                    <div class="flex-grow">
                      <span
                        :class="{
                          'text-decoration-line-through text-gray-500':
                            task.completed,
                          'text-gray-900': !task.completed,
                          'text-base sm:text-lg font-medium break-words': true,
                        }"
                      >
                        {{ task.text }}
                      </span>
                      <v-chip
                        :color="getPriorityColor(task.priority)"
                        size="small"
                        label
                        variant="elevated"
                        class="px-3 d-flex justify-center mt-2"
                      >
                        {{ task.priority }}
                      </v-chip>
                    </div>

                    <div class="flex items-center gap-2 ml-auto">
                      <div class="flex gap-1">
                        <v-btn
                          icon="mdi-pencil"
                          variant="text"
                          size="small"
                          @click="startEditing(task)"
                          class="rounded-full"
                        />
                        <v-btn
                          icon="mdi-delete"
                          variant="text"
                          size="small"
                          color="error"
                          @click="openDeleteDialog(task)"
                          class="rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </v-list-item>

          <!-- No Tasks Message -->
          <v-row v-if="filteredTasks.length === 0" class="mt-6">
            <v-col cols="12">
              <v-alert
                type="info"
                variant="tonal"
                class="rounded-xl text-center"
                border="start"
              >
                No tasks found matching your filters
              </v-alert>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-container>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card class="rounded-xl">
        <v-card-title class="text-h5 pt-6 pb-2">Delete Task</v-card-title>
        <v-card-text class="pb-6">
          Are you sure you want to delete this task?
        </v-card-text>
        <v-card-actions class="pb-4 px-6">
          <v-spacer />
          <v-btn
            color="gray"
            variant="outlined"
            @click="deleteDialog = false"
            class="rounded-lg mr-2"
          >
            Cancel
          </v-btn>
          <v-btn
            color="error"
            variant="elevated"
            @click="confirmDelete"
            class="rounded-lg"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { api } from '../api/task'
// import type { Task } from '../types/task'

interface Task {
  _id: string // Add this line
  id: number // Assuming you still want to keep this, but note you might not need it.
  text: string
  completed: boolean
  priority: string
}
const tasks = ref<Task[]>([])
const newTask = ref('')
const newTaskPriority = ref<Task['priority']>('medium')
const editingId = ref<string | null>(null)
const editingText = ref('')
const editingPriority = ref('')
const statusFilter = ref('all')
const priorityFilter = ref('all')
const deleteDialog = ref(false)
const taskToDelete = ref<Task | null>(null)
const searchQuery = ref('')
const loading = ref(false)

// Load tasks based on filters
const loadTasks = async () => {
  loading.value = true
  tasks.value = await api.getTasks(statusFilter.value, priorityFilter.value)
  if (tasks.value) {
    loading.value = false
  } else {
    loading.value = false
  }
}

// Search Task
const searchTasks = async () => {
  loading.value = true
  tasks.value = await api.searchTasks(searchQuery.value, priorityFilter.value)
  if (tasks.value) {
    loading.value = false
  } else {
    loading.value = false
  }
}

// Watch for filter changes and load tasks
watch([statusFilter, priorityFilter], async () => {
  if (!searchQuery.value) {
    await loadTasks()
  } else {
    await searchTasks()
  }
})

// Watch the searchQuery for changes
watch(searchQuery, async () => {
  if (searchQuery.value) {
    await searchTasks() // Perform the search when a query is input
  } else {
    await loadTasks() // Load all tasks if the search query is cleared
  }
})

// onMounted to load tasks initially
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
      return 'gray'
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

const updateFilteredTasks = async (task: Task) => {
  await api.updateTask(task._id, { completed: task.completed })
  await loadTasks()
}

const startEditing = (task: Task) => {
  editingId.value = task._id
  editingText.value = task.text
  editingPriority.value = task.priority
}

const finishEditing = async (task: Task) => {
  if (editingText.value.trim() || editingPriority.value !== task.priority) {
    await api.updateTask(task._id, {
      text: editingText.value,
      priority: editingPriority.value,
    })
    task.text = editingText.value
    task.priority = editingPriority.value
  }
  editingId.value = null
  editingText.value = ''
  editingPriority.value = ''
}

const updatePriority = async (task: Task, newPriority: string) => {
  await api.updateTask(task._id, { priority: newPriority })
  task.priority = newPriority
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
