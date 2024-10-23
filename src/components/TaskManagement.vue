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
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="3">
            <v-select
              v-model="newTaskPriority"
              :items="priorityOptions"
              label="Priority"
              hide-details
              dense
              outlined
            ></v-select>
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
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6">
            <v-select
              v-model="priorityFilter"
              :items="priorityFilterOptions"
              label="Priority Filter"
              hide-details
              dense
              outlined
            ></v-select>
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
              ></v-checkbox>
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
                ></v-text-field>
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
              ></v-btn>

              <v-btn
                icon="mdi-delete"
                variant="text"
                size="small"
                color="error"
                @click="openDeleteDialog(task)"
              ></v-btn>
            </template>
          </v-list-item>
        </v-list>

        <!-- No Tasks Message -->
        <v-row v-if="filteredTasks.length === 0" class="mt-4">
          <v-col cols="12" class="text-center">
            <v-alert
              type="info"
              text="No tasks found matching your filters"
            ></v-alert>
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
          <v-spacer></v-spacer>
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

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import type { Task } from '@/types/task'

export default defineComponent({
  name: 'TaskManagement',

  setup() {
    const tasks = ref<Task[]>([])
    const newTask = ref('')
    const newTaskPriority = ref<Task['priority']>('medium')
    const editingId = ref<number | null>(null)
    const editingText = ref('')
    const statusFilter = ref('all')
    const priorityFilter = ref('all')
    const deleteDialog = ref(false)
    const taskToDelete = ref<Task | null>(null)

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

    const addTask = () => {
      if (newTask.value.trim()) {
        tasks.value.push({
          id: Date.now(),
          text: newTask.value,
          completed: false,
          priority: newTaskPriority.value,
        })
        newTask.value = ''
      }
    }

    const openDeleteDialog = (task: Task) => {
      taskToDelete.value = task
      deleteDialog.value = true
    }

    const confirmDelete = () => {
      if (taskToDelete.value) {
        const index = tasks.value.findIndex(
          t => t.id === taskToDelete.value!.id,
        )
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

    const updateFilteredTasks = (task: Task) => {
      const index = tasks.value.findIndex(t => t.id === task.id)
      if (index > -1) {
        tasks.value[index].completed = task.completed
      }
      filteredTasks.value = tasks.value.filter(task => {
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
    }
    const startEditing = (task: Task) => {
      editingId.value = task.id
      editingText.value = task.text
    }

    const finishEditing = (task: Task) => {
      if (editingText.value.trim()) {
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

    return {
      tasks,
      newTask,
      newTaskPriority,
      editingId,
      editingText,
      statusFilter,
      priorityFilter,
      deleteDialog,
      priorityOptions,
      statusOptions,
      priorityFilterOptions,
      filteredTasks,
      addTask,
      confirmDelete,
      openDeleteDialog,
      toggleComplete,
      startEditing,
      finishEditing,
      getPriorityColor,
      updateFilteredTasks,
    }
  },
})
</script>
