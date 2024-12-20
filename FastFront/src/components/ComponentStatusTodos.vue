<template>
  <v-container class="pa-16">
    <v-row>
      <!-- Cada coluna é uma lista de status -->
      <v-col
        v-for="(tasks, status) in taskLists"
        :key="status"
        cols="12"
        md="3"
      >
        <v-card class="pa-2" outlined>
          <v-card-title class="text-h6 text-center">{{ status }}</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <!-- Lista de Tarefas -->
            <div
              class="task-list"
              @dragover.prevent
              @drop="onDrop($event, status)"
            >
              <v-chip
                v-for="(task) in tasks"
                :key="task.id"
                draggable="true"
                @dragstart="onDragStart($event, task)"
                class="ma-2"
                outlined
              >
                {{ task.name }}
              </v-chip>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref } from "vue";

export default {
  name: "TaskBoard",
  setup() {
    // Tarefas por status
    const taskLists = ref({
      "A Fazer": [
        { id: 1, name: "Planejar o projeto" },
        { id: 2, name: "Escrever documentação inicial" },
      ],
      Fazendo: [{ id: 3, name: "Desenvolver componente principal" }],
      "Stand By": [{ id: 4, name: "Aguardar revisão do cliente" }],
      Feito: [{ id: 5, name: "Entregar versão final" }],
    });

    const draggedTask = ref(null);

    const onDragStart = (event, task) => {
      draggedTask.value = task;
    };

    const onDrop = (event, newStatus) => {
      if (draggedTask.value) {
        for (const status in taskLists.value) {
          const index = taskLists.value[status].findIndex(
            (t) => t.id === draggedTask.value.id
          );
          if (index > -1) {
            taskLists.value[status].splice(index, 1);
            break;
          }
        }

        taskLists.value[newStatus].push(draggedTask.value);

        draggedTask.value = null;
      }
    };

    return {
      taskLists,
      onDragStart,
      onDrop,
    };
  },
};
</script>

<style>
.task-list {
    min-height: 150px;
    padding: 8px;
    background-color: #020317a5;
    border: 1px dashed #ddd;
    border-radius: 4px;
}

.task-list > *:not(:last-child) {
  margin-bottom: 8px;
}
</style>
