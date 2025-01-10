<template>
  <v-container>
    <v-toolbar flat>
      <h1>{{ project.name }}</h1>
      <v-spacer />
      <button
        class="v-btn-create"
        @click="openDialog"
      >
        Criar Atividade
      </button>
      <ComponentPostActivity
        v-model="showDialog"
        :project-id="project.id"
        @activity-created="fetchActivities"
      />
    </v-toolbar>
    <v-row>
      <v-col
        v-for="status in statuses"
        :key="status"
        cols="4"
      >
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
          <v-icon
            icon
            class="red--text"
            @click.stop="openDeleteDialog(activity)"
          >
            mdi-delete
          </v-icon>
        </v-card>
        <!-- Drop Area -->
        <div
          class="drop-area"
          style="border: 2px dashed #ccc; padding: 1em; text-align: center;"
          @dragover.prevent
          @drop="onDrop(status)"
        >
          Solte aqui para mover para {{ status }}
        </div>
      </v-col>
    </v-row>
    <ComponentUpdateActivity
      v-model="showUpdateDialog"
      :activity="selectedActivity"
    />
    <ComponentDeleteActivity
      v-model="showDeleteDialog"
      :activity="selectedActivity"
      @activity-deleted="fetchActivities"
    />
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
  async created() {
    const projectId = parseInt(this.$route.params.id, 10);
    try {
      const projectResponse = await axios.get(`http://localhost:8000/projects/${projectId}`);
      this.project = projectResponse.data;

      await this.fetchActivities();
    } catch (error) {
      console.error("Erro ao carregar detalhes do projeto:", error);
    }
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
    async fetchActivities() {
      const projectId = parseInt(this.$route.params.id, 10);
      try {
        const activitiesResponse = await axios.get("http://localhost:8000/activitys");
        this.activities = {
          PENDING: [],
          TODO: [],
          INPROGRESS: [],
          WAITING: [],
          DONE: [],
        };
        activitiesResponse.data.forEach((activity) => {
          if (activity.project_id === projectId) {
            this.activities[activity.status].push(activity);
          }
        });
      } catch (error) {
        console.error("Erro ao carregar atividades:", error);
      }
    },
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
