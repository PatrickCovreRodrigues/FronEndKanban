<template>
  <v-dialog :value="showDialog" @input="updateDialog" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Atualizar Atividade</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" @submit.prevent="submit">
          <v-text-field
            v-model="formData.name"
            label="Nome"
            :rules="[rules.required]"
            v-if="activity"
          ></v-text-field>
          <v-text-field
            v-model="formData.description_activity"
            label="Descrição"
            :rules="[rules.required]"
            v-if="activity"
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
    activity: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      formData: {
        name: this.activity ? this.activity.name : "",
        description_activity: this.activity ? this.activity.description_activity : "",
      },
      rules: {
        required: (value) => !!value || "Campo obrigatório",
      },
    };
  },
  watch: {
    activity: {
      handler(newActivity) {
        if (newActivity) {
          this.formData.name = newActivity.name;
          this.formData.description_activity = newActivity.description_activity;
        }
      },
      immediate: true,
    },
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
        await axios.put(`http://127.0.0.1:8000/activitys/${this.activity.id}`, this.formData);
        alert("Atividade atualizada com sucesso!");
        this.closeDialog();
      } catch (error) {
        console.error("Erro ao atualizar atividade:", error.response?.data || error.message);
      }
    },
    updateDialog(value) {
      this.$emit("update:showDialog", value);
    },
  },
};
</script>
