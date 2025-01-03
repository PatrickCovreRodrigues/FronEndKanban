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
        >
          <v-card-title>{{ activity.name }}</v-card-title>
          <v-card-subtitle>{{ activity.description_activity }}</v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      project: {},
      statuses: ['PENDING', 'TODO', 'INPROGRESS', 'WAITING', 'DONE'],
      activities: {
        PENDING: [],
        TODO: [],
        INPROGRESS: [],
        WAITING: [],
        DONE: [],
      },
    };
  },
  async created() {
    const projectId = parseInt(this.$route.params.id, 10); // Converter para número se necessário
    try {
      // Buscar os detalhes do projeto
      const projectResponse = await axios.get(`http://localhost:8000/projects/${projectId}`);
      this.project = projectResponse.data;

      // Buscar as atividades relacionadas
      const activitiesResponse = await axios.get('http://localhost:8000/activitys');
      activitiesResponse.data.forEach((activity) => {
        if (activity.project_id === projectId) {
          // Adicionar a atividade ao status correspondente
          this.activities[activity.status].push(activity);
        }
      });
    } catch (error) {
      console.error('Erro ao carregar detalhes do projeto:', error);
    }
  },
};
</script>
