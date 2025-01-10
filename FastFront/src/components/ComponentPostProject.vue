<template>
  <v-dialog
    :value="showDialog"
    max-width="500px"
    @input="updateDialog"
  >
    <v-card>
      <v-card-title>
        <span class="headline">Criar Projeto</span>
      </v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          @submit.prevent="submit"
        >
          <v-text-field
            v-model="formData.name"
            label="Nome"
            :rules="[rules.required]"
          />
          <v-text-field
            v-model="formData.description_project"
            label="Descrição"
            :rules="[rules.required]"
          />
          <v-select
            v-model="formData.customer_id"
            :items="customers"
            item-title="name"
            item-value="id"
            label="Cliente"
            :rules="[rules.required]"
          />
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
              type="submit"
              color="blue darken-1"
              text
            >
              Salvar
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";

import { toast } from 'vue3-toastify';

export default {
  props: {
    showDialog: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      formData: {
        name: "",
        description_project: "",
        customer_id: null,
      },
      customers: [],
      url: "http://127.0.0.1:8000/projects/",
      customersUrl: "http://127.0.0.1:8000/customers/",
      rules: {
        required: (value) => !!value || "Campo obrigatório",
      },
    };
  },
  async created() {
    await this.fetchCustomers();
  },
  methods: {
    async fetchCustomers() {
      try {
        const response = await axios.get(this.customersUrl);
        this.customers = response.data.map((customer) => ({
          id: customer.id,
          name: customer.name,
        }));
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      }
    },
    async submit() {
      try {
        await axios.post(this.url, this.formData);
        toast.success("Projeto criado com sucesso!"); // Exibe o toast de sucesso
        this.$emit("project-created"); // Emite o evento quando o projeto é criado
        this.closeDialog();
      } catch (error) {
        console.error("Erro ao criar projeto:", error);
        toast.error("Erro ao criar projeto!"); // Exibe o toast de erro
      }
    },
    closeDialog() {
      this.$emit("update:showDialog", false);
    },
    updateDialog(value) {
      this.$emit("update:showDialog", value);
    },
  },
};

</script>
