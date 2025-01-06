<template>
  <v-dialog :value="showDialog" @input="updateDialog" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Criar Atividade</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" @submit.prevent="submit">
          <v-text-field
            v-model="formData.name"
            label="Nome"
            :rules="[rules.required]"
          ></v-text-field>
          <v-text-field
            v-model="formData.description_activity"
            label="Descrição"
            :rules="[rules.required]"
          ></v-text-field>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="closeDialog">Cancelar</v-btn>
            <v-btn type="submit" color="blue darken-1" text>Salvar</v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";

export default {
  props: {
    showDialog: {
      type: Boolean,
      required: true,
    },
    projectId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      formData: {
        name: "",
        description_activity: "",
      },
      rules: {
        required: (value) => !!value || "Campo obrigatório",
      },
    };
  },
  methods: {
    async submit() {
      try {
        console.log("Valor de projectId:", this.projectId);
        const dataToSend = {
          ...this.formData,
          project_id: this.projectId,
          status: "PENDING",
        };
        console.log("Dados enviados para o backend:", dataToSend);

        await axios.post(`http://127.0.0.1:8000/activitys/`, dataToSend);
        alert("Atividade criada com sucesso!");
        this.closeDialog();
      } catch (error) {
        console.error("Erro ao criar atividade:", error.response?.data || error.message);
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
