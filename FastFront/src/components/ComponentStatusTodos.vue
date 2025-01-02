<template>
  <div class="kanban">
    <div
      v-for="status in statuses"
      :key="status"
      class="kanban-column"
    >
      <h3>{{ status }}</h3>
      <draggable
        :list="groupedTodos[status]"
        group="todos"
        @end="onDrop"
      >
        <div v-for="todo in groupedTodos[status]" :key="todo.id" class="todo-card">
          {{ todo.title }}
        </div>
      </draggable>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import axios from "axios";

export default {
  components: { draggable },
  data: () => ({
    todos: [], // Lista completa de atividades
    statuses: ["Pendente", "A fazer", "Em progresso", "Em espera", "Feito"], // Colunas do Kanban
  }),
  computed: {
    groupedTodos() {
      // Agrupar atividades por status
      return this.statuses.reduce((acc, status) => {
        acc[status] = this.todos.filter((todo) => todo.state === status);
        return acc;
      }, {});
    },
  },
  async created() {
    await this.fetchTodos();
  },
  methods: {
    async fetchTodos() {
      try {
        const response = await axios.get("http://127.0.0.1:8000/todos/");
        this.todos = response.data;
      } catch (error) {
        console.error("Erro ao buscar atividades:", error);
      }
    },
    async onDrop(event) {
      // Recuperar o ID e o novo status do item arrastado
      const todo = event.item._underlying_vm_;
      const newState = this.statuses[event.to.dataset.index];

      // Atualizar no banco de dados
      try {
        await axios.put(`http://127.0.0.1:8000/todos/${todo.id}`, {
          ...todo,
          state: newState,
        });
        this.fetchTodos(); // Atualizar a lista após o drop
      } catch (error) {
        console.error("Erro ao atualizar atividade:", error);
      }
    },
  },
};
</script>

<style>
.kanban {
  display: flex;
  gap: 20px;
}
.kanban-column {
  width: 200px;
  background: #f4f4f4;
  padding: 10px;
  border-radius: 5px;
}
.todo-card {
  background: white;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>
