<template>
  <v-dialog
    :value="showDialog"
    max-width="500px"
    @input="updateDialog"
  >
    <v-card>
      <v-card-title>
        <span class="headline">Excluir Atividade</span>
      </v-card-title>
      <v-card-text>
        <p>Tem certeza de que deseja excluir a atividade "{{ activity.name }}"?</p>
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
            @click="deleteActivity"
          >
            Excluir
          </v-btn>
        </v-card-actions>
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
  methods: {
    closeDialog() {
      this.showDialog = false;
    },
    async deleteActivity() {
      try {
        await axios.delete(`http://127.0.0.1:8000/activitys/${this.activity.id}`);
        alert("Atividade excluída com sucesso!");
        this.$emit("activity-deleted"); // Emite o evento quando a atividade é excluída
        this.closeDialog();
      } catch (error) {
        console.error("Erro ao excluir atividade:", error.response?.data || error.message);
      }
    },
    updateDialog(value) {
      this.$emit("update:showDialog", value);
    },
  },
};
</script>
