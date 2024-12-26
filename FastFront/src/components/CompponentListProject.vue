<template>
  <v-card
    class="mx-auto"
    max-width="300"
  >
    <v-list id="listProject" :items="items">
      <v-list-item v-for="(item, index) in items" :key="index">
        {{ item.name }}
        <v-btn @click="fetchDeleteProject(item.id)"><Trash /></v-btn>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
import axios from 'axios';

export default {
  data: () => ({
    items: [],
    url: 'http://127.0.0.1:8000/projects/'
  }),
  created() {
    this.fetchGetProjects();
  },
  methods: {
    async fetchGetProjects() {
      try {
        const response = await axios.get(this.url);
        console.log(response.data);
        this.items = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchDeleteProject(id) {
      try {
        const response = await axios.delete(this.url + id); 
        console.log(response.data);
        this.fetchGetProjects();
      } catch (error) {
        console.error(error);
      }
    },
  }
}
</script>
