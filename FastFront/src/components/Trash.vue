<template>
     <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Editar Projeto</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field v-model="editedItem.name" label="Nome"></v-text-field>
            <v-text-field v-model="editedItem.description_project" label="Descrição"></v-text-field>
            <v-select
              v-model="editedItem.customer_id"
              :items="customers"
              item-text="name"
              item-value="id"
              label="Cliente"
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialog">Cancelar</v-btn>
          <v-btn color="blue darken-1" text @click="updateProject">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>