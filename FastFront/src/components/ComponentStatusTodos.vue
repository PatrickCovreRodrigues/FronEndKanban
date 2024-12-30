<template>
  <v-container>
    <v-row>
      <!-- Coluna para cada estado -->
      <v-col
        v-for="state in states"
        :key="state"
        cols="12"
        md="4"
      >
        <v-card>
          <v-card-title>{{ state }}</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="todo in filteredTodos(state)"
                :key="todo.id"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ todo.title }}</v-list-item-title>
                  <v-list-item-subtitle>{{ todo.description_activity }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <!-- Botões de ação -->
                  <v-btn small color="primary" @click="moveTask(todo, 'next')">Mover</v-btn>
                  <v-btn small color="red" @click="deleteTask(todo.id)">Excluir</v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
import axios from "axios";

export default {
  data() {
    return {
      todos: [],
      states: ["Pendente", "A fazer", "Em progresso", "Em espera", "Feito"], // Baseado no enum TodoState
    };
  },
  methods: {
    async fetchTodos() {
      const response = await axios.get("http://127.0.0.1:8000/todos");
      this.todos = response.data;
    },
    filteredTodos(state) {
      return this.todos.filter((todo) => todo.state === state);
    },
    async moveTask(todo, direction) {
      const stateOrder = this.states;
      const currentIndex = stateOrder.indexOf(todo.state);
      const newIndex =
        direction === "next" ? currentIndex + 1 : currentIndex - 1;
      if (newIndex >= 0 && newIndex < stateOrder.length) {
        todo.state = stateOrder[newIndex];
        await axios.put(`/todos/${todo.id}`, { state: todo.state });
        this.fetchTodos();
      }
    },
    async deleteTask(id) {
      await axios.delete(`/todos/${id}`);
      this.fetchTodos();
    },
  },
  mounted() {
    this.fetchTodos();
  },
};
</script>
