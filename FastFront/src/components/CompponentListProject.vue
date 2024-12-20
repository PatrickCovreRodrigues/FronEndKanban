
<template>
  <v-card
    class="mx-auto"
    max-width="300"
  >
    <v-list :items="items"></v-list>
  </v-card>
</template>
<script>
import axios from 'axios';

export default {
    data: () => ({
        items: [],
    }),
    created() {
        this.fetchCustomers();
    },
    methods: {
        async fetchCustomers() {
            try {
                const response = await axios.get('http://localhost:8000/');
                console.log(response.data);       
        } catch (error) {
            console.error(error);
        }
    }
}
}
</script>