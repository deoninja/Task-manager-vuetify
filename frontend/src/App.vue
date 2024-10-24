<template>
  <v-app>
    <v-main>
      <TaskManagement />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TaskManagement from './components/TaskManagement.vue'

export default defineComponent({
  name: 'App',
  components: {
    TaskManagement,
  },
})
</script>
