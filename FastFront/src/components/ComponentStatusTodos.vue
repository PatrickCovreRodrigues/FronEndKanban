<template>
  <v-container>
    <v-toolbar flat>
      <h1>{{ project.name }}</h1>
      <v-spacer></v-spacer>
      <button @click="openDialog" class="v-btn-create">Criar Atividade</button>
      <ComponentPostActivity v-model="showDialog" :projectId="project.id" />
    </v-toolbar>
    <v-row>
      <v-col v-for="status in statuses" :key="status" cols="4">
        <h2>{{ status }}</h2>
        <v-card
          v-for="activity in activities[status]"
          :key="activity.id"
          class="mb-3"
          draggable="true"
          @dragstart="onDragStart(activity)"
          @dblclick="openUpdateDialog(activity)"
        >
          <v-card-title>Titulo: {{ activity.name }}</v-card-title>
          <v-card-subtitle>Descrição: {{ activity.description_activity }}</v-card-subtitle>
          <v-icon icon @click.stop="openDeleteDialog(activity)" class="red--text">mdi-delete</v-icon>
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
    <ComponentUpdateActivity v-model="showUpdateDialog" :activity="selectedActivity" />
    <ComponentDeleteActivity v-model="showDeleteDialog" :activity="selectedActivity" />
  </v-container>
</template>

<script>
import axios from "axios";
import ComponentPostActivity from "./ComponentPostActivity.vue";
import ComponentUpdateActivity from "./ComponentUpdateActivity.vue";
import ComponentDeleteActivity from "./ComponentDeleteActivity.vue";

export default {
  components: {
    ComponentPostActivity,
    ComponentUpdateActivity,
    ComponentDeleteActivity,
  },
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
      showDialog: false,
      showUpdateDialog: false,
      showDeleteDialog: false,
      draggedActivity: null,
      selectedActivity: null,
    };
  },
  methods: {
    onDragStart(activity) {
      this.draggedActivity = activity;
    },
    openDialog() {
      this.showDialog = true;
    },
    openUpdateDialog(activity) {
      this.selectedActivity = activity;
      this.showUpdateDialog = true;
    },
    openDeleteDialog(activity) {
      this.selectedActivity = activity;
      this.showDeleteDialog = true;
    },
    async onDrop(newStatus) {
      if (!this.draggedActivity || !this.statuses.includes(newStatus)) {
        console.error("Status inválido ou nenhuma atividade arrastada");
        return;
      }

      try {
        await axios.patch(`http://localhost:8000/activitys/${this.draggedActivity.id}/status/`, {
          status: newStatus,
        });

        const currentStatus = this.draggedActivity.status;

        this.activities[currentStatus] = this.activities[currentStatus].filter(
          (activity) => activity.id !== this.draggedActivity.id
        );

        this.draggedActivity.status = newStatus;
        this.activities[newStatus].push(this.draggedActivity);

        this.draggedActivity = null;
      } catch (error) {
        console.error("Erro ao mover atividade:", error.response?.data || error.message);
        alert("Não foi possível mover a atividade. Tente novamente.");
      }
    },
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


<style>
h1{
  margin: 15px;
}
.v-icon.red--text {
  color: red;
}
</style>
