<template>
  <v-container>
    <h1>{{ project.name }}</h1>
    <v-row>
      <v-col v-for="status in statuses" :key="status" cols="4">
        <h2>{{ status }}</h2>
        <v-card
          v-for="activity in activities[status]"
          :key="activity.id"
          class="mb-3"
          draggable="true"
          @dragstart="onDragStart(activity)"
        >
          <v-card-title>{{ activity.name }}</v-card-title>
          <v-card-subtitle>{{ activity.description_activity }}</v-card-subtitle>
        </v-card>
        <!-- Drop Area -->
        <div
          class="drop-area"
          @dragover.prevent
          @drop="onDrop(status)"
          style="border: 2px dashed #ccc; padding: 1em; text-align: center;"
        >
          Solte aqui para mover para {{ status }}
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      project: {},
      statuses: ["PENDING", "TODO", "INPROGRESS", "WAITING", "DONE"],
      activities: {
        PENDING: [],
        TODO: [],
        INPROGRESS: [],
        WAITING: [],
        DONE: [],
      },
      draggedActivity: null, // Atividade sendo arrastada
    };
  },
  methods: {
    onDragStart(activity) {
      // Armazena a atividade sendo arrastada
      this.draggedActivity = activity;
    },
async onDrop(newStatus) {
  if (!this.draggedActivity || !this.statuses.includes(newStatus)) {
    console.error("Status inválido ou nenhuma atividade arrastada");
    return;
  }

  try {
    await axios.patch(`http://localhost:8000/activitys/${this.draggedActivity.id}/status/`, {
      status: newStatus, // Envia o status correto
    });

    const currentStatus = this.draggedActivity.status;

    // Atualiza localmente
    this.activities[currentStatus] = this.activities[currentStatus].filter(
      (activity) => activity.id !== this.draggedActivity.id
    );

    this.draggedActivity.status = newStatus;
    this.activities[newStatus].push(this.draggedActivity);

    this.draggedActivity = null; // Reseta após mover
  } catch (error) {
    console.error("Erro ao mover atividade:", error.response?.data || error.message);
    alert("Não foi possível mover a atividade. Tente novamente.");
  }
}
  },
  async created() {
    const projectId = parseInt(this.$route.params.id, 10);
    try {
      const projectResponse = await axios.get(`http://localhost:8000/projects/${projectId}`);
      this.project = projectResponse.data;

      const activitiesResponse = await axios.get("http://localhost:8000/activitys");
      activitiesResponse.data.forEach((activity) => {
        if (activity.project_id === projectId) {
          this.activities[activity.status].push(activity);
        }
      });
    } catch (error) {
      console.error("Erro ao carregar detalhes do projeto:", error);
    }
  },
};
</script>
