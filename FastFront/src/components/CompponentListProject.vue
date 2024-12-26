<template>
  <v-card class="mx-auto" max-width="800">
    <v-data-table
      :items="items"
      :headers="headers"
      class="elevation-1"
      item-value="id"
      item-key="id"
      dense
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Projetos</v-toolbar-title>
        </v-toolbar>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-icon @click="editProject(item)">mdi-pencil</v-icon>
        <v-icon @click="fetchDeleteProject(item.id)" class="red--text">mdi-delete</v-icon>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    items: [], 
    url: "http://127.0.0.1:8000/projects/", 
    headers: [
      { title: "ID", value: "id" },
      { title: "Nome", value: "name" },
      { title: "Descrição", value: "description_project" },
      { title: "Cliente", value: "customer_id" },
      { title: "Criado em", value: "created_at" },
      { title: "Ações", value: "actions", sortable: false },
    ],
  }),
  created() {
    this.fetchGetProjects();
  },
  methods: {
    async fetchGetProjects() {
      try {
        const response = await axios.get(this.url);
        this.items = response.data;
      } catch (error) {
        console.error("Erro ao buscar projetos:", error);
      }
    },
    async fetchDeleteProject(id) {
      try {
        await axios.delete(`${this.url}${id}`);
        this.fetchGetProjects(); 
      } catch (error) {
        console.error("Erro ao excluir projeto:", error);
      }
    },
    editProject(item) {
      console.log("Editar projeto:", item);
    },
    formatDate(date) {
      if (!date) return "";
      return new Date(date).toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    },
  },
};
</script>

<style>
.v-icon {
  cursor: pointer;
  margin-left: 8px;
}
.v-icon.red--text {
  color: red;
}
.v-data-table {
  margin-top: 16px;
}
</style>
