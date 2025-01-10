<template>
  <v-card
    class="mx-auto"
    max-width="800"
  >
    <v-data-table
      :items="formattedItems"
      :headers="headers"
      class="elevation-1"
      item-value="id"
      item-key="id"
      dense
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>Projetos</v-toolbar-title>
          <button
            class="v-btn-create"
            @click="openDialog"
          >
            Criar Projeto
          </button>
          
          <ComponentPostProject
            v-model="showDialog"
            @project-created="fetchGetProjects"
          />
        </v-toolbar>
      </template>

      <template #[`item.actions`]="{ item }">
        <v-icon @click="editProject(item)">
          mdi-pencil
        </v-icon>
        <v-icon
          class="red--text"
          @click="fetchDeleteProject(item.id)"
        >
          mdi-delete
        </v-icon>
        <v-icon
          class="blue--text"
          @click="navigateToProject(item.id)"
        >
          mdi-arrow-right
        </v-icon>
      </template>
    </v-data-table>

    <v-dialog
      v-model="dialog"
      max-width="500px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">Editar Projeto</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              v-model="editedItem.name"
              label="Nome"
            />
            <v-text-field
              v-model="editedItem.description_project"
              label="Descrição"
            />
            <v-select
              v-model="editedItem.customer_id"
              :items="customers"
              item-title="name"
              item-value="id"
              label="Cliente"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="red darken-1"
            text
            @click="closeDialog"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="updateProject"
          >
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import axios from "axios";
import ComponentPostProject from "./ComponentPostProject.vue";
import { toast } from 'vue3-toastify';

export default {
  components: {
    ComponentPostProject,
  },
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
    showDialog: false,
    dialog: false,
    editedItem: {
      id: null,
      name: "",
      description_project: "",
      customer_id: null,
    },
  }),
  computed: {
    formattedItems() {
      return this.items.map((item) => {
        const customer = this.customers.find(c => c.id === item.customer_id);
        return {
          ...item,
          created_at: this.formatDate(item.created_at),
          customer_id: customer ? customer.name : "",
        };
      });
    },
  },
  async created() {
    await this.fetchGetProjects();
    await this.fetchCustomers();
  },
  methods: {
    navigateToProject(id) {
      this.$router.push(`/projects/${id}`);
    },
    formatDate(date) {
      if (!date) return "";
      const options = { day: "2-digit", month: "2-digit", year: "numeric" };
      return new Date(date).toLocaleDateString("pt-BR", options);
    },
    openDialog() {
      this.showDialog = true;
    },
    closeDialog() {
      this.dialog = false;
    },
    editProject(item) {
      this.editedItem = { ...item };
      this.dialog = true;
    },
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
        toast.success("Projeto excluído com sucesso!"); // Exibe o toast de sucesso
      } catch (error) {
        console.error("Erro ao excluir projeto:", error);
        toast.error("Erro ao excluir projeto!"); // Exibe o toast de erro
      }
    },
    async fetchCustomers() {
      try {
        const response = await axios.get(this.customersUrl);
        this.customers = response.data;
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      }
    },

    async updateProject() {
      try {
        const updatedData = {
          ...this.editedItem,
          customer_id: this.customers.find(c => c.name === this.editedItem.customer_id)?.id
        };
        console.log("Dados atualizados:", updatedData); // Adicione esta linha para debug
        const response = await axios.put(
          `${this.url}${this.editedItem.id}/`,
          updatedData
        );
        const index = this.items.findIndex(
          (item) => item.id === this.editedItem.id
        );
        if (index !== -1) {
          this.items.splice(index, 1, response.data);
        }
        this.dialog = false;
        toast.success("Projeto atualizado com sucesso!"); // Exibe o toast de sucesso
        this.fetchGetProjects(); // Atualiza a lista de projetos
      } catch (error) {
        console.error("Erro ao atualizar projeto:", error);
        toast.error("Erro ao atualizar projeto!"); // Exibe o toast de erro
      }
    }
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
.v-btn-create {
  margin: 20px;
  border: 1px solid #3f51b5;
  background-color: #3f51b5;
  color: white;
  border-radius: 4px;
  width: 120px;
  height: 40px;
}
</style>