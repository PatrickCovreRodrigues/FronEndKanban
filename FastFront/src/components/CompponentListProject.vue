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
          <button  @click="openPostProjectDialog" class="v-btn-creat">Criar Tarefa</button>
        </v-toolbar>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-icon @click="editProject(item)">mdi-pencil</v-icon>
        <v-icon @click="fetchDeleteProject(item.id)" class="red--text">mdi-delete</v-icon>
      </template>
    </v-data-table>

     <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Editar Projeto</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field v-model="editedItem.name" label="Nome"></v-text-field>
            <v-text-field v-model="editedItem.description_project" label="Descrição"></v-text-field>
            <v-select
              v-model="editedItem.customer_id"
              :items="customers"
              item-title="name"
              item-value="id"
              label="Cliente"
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialog">Cancelar</v-btn>
          <v-btn color="blue darken-1" text @click="updateProject">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    items: [],
    customers: [], 
    url: "http://127.0.0.1:8000/projects/", 
    customersUrl: "http://127.0.0.1:8000/customers/",
    headers: [
      { title: "ID", value: "id" },
      { title: "Nome", value: "name" },
      { title: "Descrição", value: "description_project" },
      { title: "Cliente", value: "customer_id" },
      { title: "Criado em", value: "created_at" },
      { title: "Ações", value: "actions", sortable: false },
    ],
    dialog: false,
    editedItem: {
      id: null,
      name: "",
      description_project: "",
      customer_id: null,
    },
  }),
  async created() {
    await this.fetchGetProjects();
    await this.fetchDeleteProject();
    await this.fetchCustomers();
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
    async fetchCustomers() {
      try {
        const response = await axios.get(this.customersUrl);
        this.customers = response.data;
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    },
    editProject(item) {
      this.editedItem = { ...item };
      this.dialog = true;
    },
    closeDialog(){
      this.dialog = false;
    },
    async updateProject() {
      try {
        const response = await axios.put(`${this.url}${this.editedItem.id}/`, this.editedItem);
        const index = this.items.findIndex(item => item.id === this.editedItem.id);
        if (index !== -1) {
          this.items.splice(index, 1, response.data);
        }
        this.dialog = false;
        alert("Projeto atualizado com sucesso!");
      } catch (error) {
        console.error("Erro ao atualizar projeto:", error);
        alert("Erro ao atualizar projeto!");
      }
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
.v-btn-creat {
  margin: 20px;
  border: 1px solid #3f51b5;
  background-color: #3f51b5;
  color: white;
  border-radius: 4px;
  width: 100px;
  height: 40px;
}
</style>
