<template>
  <v-row>
    <v-col v-for="status in statuses" :key="status" cols="12" md="4">
      <v-card>
        <v-card-title>{{ status }}</v-card-title>
        <v-card-text>
          <draggable
            v-model="tasks[status]"
            :group="{ name: 'tasks', pull: true, put: true }"
            @end="updateTaskStatus"
            item-key="id"
          >
            <template #item="{ element }">
              <v-chip
                :key="element.id"
                class="ma-2"
                color="primary"
              >
                {{ element.name }}
              </v-chip>
            </template>
          </draggable>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import axios from 'axios';
import draggable from 'vuedraggable';

export default {
  components: {
    draggable,
  },
  data() {
    return {
      statuses: ['PENDING', 'TODO', 'INPROGRESS', 'WAITING', 'DONE'],
      tasks: {
        PENDING: [],
        TODO: [],
        INPROGRESS: [],
        WAITING: [],
        DONE: [],
      },
    };
  },
  methods: {
    // Função para atualizar o status das tarefas no backend
    async updateTaskStatus() {
      const tasks = this.tasks; // Estado local das tarefas
      const updates = Object.keys(tasks).flatMap(status => {
        return tasks[status].map(task => {
          return {
            taskId: task.id,
            newStatus: status,
          };
        });
      });

      try {
        // Usando axios.patch para atualizar o status de cada tarefa no backend
        for (const update of updates) {
          await axios.patch(`/api/activitys/${update.taskId}/status/`, {
            status: update.newStatus,
          });
        }
      } catch (error) {
        console.error('Erro ao atualizar status:', error);
      }
    },

    // Função para carregar as tarefas do backend ao iniciar o componente
    async loadTasks() {
      try {
        const response = await axios.get('/api/activitys');
        const tasks = response.data;
        
        // Organize tasks based on status
        tasks.forEach(task => {
          this.tasks[task.status].push(task);
        });
      } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
      }
    },
  },
  created() {
    this.loadTasks();
  },
};
</script>
