<template>
  <v-card
    class="mx-auto"
    max-width="800"
  >
    <v-data-table
      :items="formattedCustomers"
      :headers="headers"
      class="elevation-1"
      item-value="id"
      item-key="id"
      dense
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>Clientes</v-toolbar-title>
          <button
            class="v-btn-create"
            @click="openDialog"
          >
            Criar Cleinte
          </button>
          <ComponentPostCustomer
            v-model="showDialog"
            @customer-created="fetchGetCustomers"
          />
        </v-toolbar>
      </template>

      <template #[`item.actions`]="{ item }">
        <v-icon @click="editCustomer(item)">
          mdi-pencil
        </v-icon>
        <v-icon
          class="red--text"
          @click="fetchDeleteCustomer(item.id)"
        >
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>

    <v-dialog
      v-model="dialog"
      max-width="500px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">Editar Cliente</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              v-model="editedCustomer.name"
              label="Nome"
            />
            <v-text-field
              v-model="editedCustomer.email"
              label="Email"
            />
            <v-text-field
              v-model="editedCustomer.description"
              label="Descrição"
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
            @click="updateCustomer"
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
import ComponentPostCustomer from "./ComponentPostCustomer.vue";

import { toast } from 'vue3-toastify';

export default {
  components: {
    ComponentPostCustomer,
  },
  data: () => ({
    customers: [],
    url: "http://127.0.0.1:8000/customers/",
    headers: [
      { title: "ID", value: "id" },
      { title: "Nome", value: "name" },
      { title: "Email", value: "email" },
      { title: "Descrição", value: "description" },
      { title: "Ações", value: "actions", sortable: false },
    ],
    showDialog: false,
    dialog: false,
    editedCustomer: {
      id: null,
      name: "",
      email: "",
      description: "",
    },
  }),
  computed: {
    formattedCustomers() {
      return this.customers;
    },
  },
  async created() {
    await this.fetchGetCustomers();
  },
  methods: {
    navigateToCustomer(id) {
      this.$router.push(`/customers/${id}`);
    },
    openDialog() {
      this.showDialog = true;
    },
    closeDialog() {
      this.dialog = false;
    },
    editCustomer(item) {
      this.editedCustomer = { ...item };
      this.dialog = true;
    },
    async fetchGetCustomers() {
      try {
        const response = await axios.get(this.url);
        this.customers = response.data;
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      }
    },
    async fetchDeleteCustomer(id) {
      try {
        await axios.delete(`${this.url}${id}`);
        this.fetchGetCustomers();
        toast.success("Cliente excluído com sucesso!"); // Exibe o toast de sucesso
      } catch (error) {
        console.error("Erro ao excluir cliente:", error);
        toast.error("Erro ao excluir cliente!"); // Exibe o toast de erro
      }
    },
    async updateCustomer() {
      try {
        const response = await axios.put(
          `${this.url}${this.editedCustomer.id}/`,
          this.editedCustomer
        );
        const index = this.customers.findIndex(
          (customer) => customer.id === this.editedCustomer.id
        );
        if (index !== -1) {
          this.customers.splice(index, 1, response.data);
        }
        this.dialog = false;
        toast.success("Cliente atualizado com sucesso!"); // Exibe o toast de sucesso
      } catch (error) {
        console.error("Erro ao atualizar cliente:", error);
        toast.error("Erro ao atualizar cliente!"); // Exibe o toast de erro
      }
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
