<template>
  <v-dialog
    :value="showDialog"
    max-width="500px"
    @input="updateDialog"
  >
    <v-card>
      <v-card-title>
        <span class="headline">Criar Atividade</span>
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
            v-model="formData.description_activity"
            label="Descrição"
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
              @click="notify"
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
    closeDialog() {
      this.showDialog = false;
    },
    async submit() {
      if (!this.formData.name || !this.formData.description_activity) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
      }

      try {
        const dataToSend = {
          ...this.formData,
          project_id: this.projectId,
          status: "PENDING",
        };

        await axios.post(`http://127.0.0.1:8000/activitys/`, dataToSend);
        toast.success("Atividade criada com sucesso!"); // Exibe o toast de sucesso
        this.$emit("activity-created"); // Emite o evento quando a atividade é criada
      } catch (error) {
        console.error("Erro ao criar atividade:", error.response?.data || error.message);
        toast.error("Erro ao criar atividade!"); // Exibe o toast de erro
      }
    },
    updateDialog(value) {
      this.$emit("update:showDialog", value);
    },
  },
};
</script>
