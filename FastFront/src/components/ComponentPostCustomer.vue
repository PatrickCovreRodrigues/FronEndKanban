<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Criar Novo Cliente</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-text-field
            v-model="customer.name"
            label="Nome"
            :rules="[rules.required]"
            required
          ></v-text-field>
          <v-text-field
            v-model="customer.email"
            label="Email"
            :rules="[rules.required, rules.email]"
            required
          ></v-text-field>
          <v-textarea
            v-model="customer.description"
            label="Descrição"
            :rules="[rules.required]"
            required
          ></v-textarea>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red darken-1" text @click="closeDialog">Cancelar</v-btn>
        <v-btn color="blue darken-1" text @click="createCustomer">Salvar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";

import { toast } from 'vue3-toastify';

export default {
  props: {
    value: Boolean, // 'value' será a prop que recebe o estado de showDialog
  },
  data() {
    return {
      customer: {
        name: "",
        email: "",
        description: ""
      },
      valid: false,
      dialog: this.value, // Usamos 'dialog' local para controlar a visibilidade
      rules: {
        required: value => !!value || "Campo obrigatório.",
        email: value => /.+@.+\..+/.test(value) || "Email deve ser válido."
      }
    };
  },
  watch: {
    dialog(newValue) {
      this.$emit('update:value', newValue); // Emitimos o evento quando o valor de 'dialog' mudar
    }
  },
  methods: {
    closeDialog() {
      this.dialog = false; // Fecha o diálogo
    },
    async createCustomer() {
      if (this.$refs.form.validate()) {
        try {
          const response = await axios.post("http://127.0.0.1:8000/customers/", this.customer);
          this.dialog = false; // Fecha o diálogo após sucesso
          this.$emit("customerCreated", response.data); // Emite evento com o novo cliente
          this.customer = { name: "", email: "", description: "" }; // Limpa os campos
          toast.success("Cliente criado com sucesso!"); // Exibe o toast de sucesso
        } catch (error) {
          console.error("Erro ao criar cliente:", error);
          toast.error("Erro ao criar cliente!"); // Exibe o toast de erro
        }
      }
    }
  }
};

</script>

<style scoped>
.v-dialog .v-card {
  min-width: 400px;
}
</style>