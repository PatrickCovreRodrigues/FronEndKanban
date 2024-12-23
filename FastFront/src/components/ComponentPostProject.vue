<template>
  <form @submit.prevent="submit">
    <v-text-field
      v-model="formData.name"
      label="Name"
    ></v-text-field>

    <v-text-field
      v-model="formData.description"
      label="Description"
    ></v-text-field>

    <v-select
      v-model="formData.select"
      :items="customers"
      item-text="name"
      item-value="id"
      label="Select Customer"
    ></v-select>

    <v-btn type="submit">Submit</v-btn>
  </form>
</template>

<script>
import axios from 'axios';
import { useForm } from 'vee-validate';

export default {
  data() {
    return {
      formData: {
        name: '',
        description: '',
        select: ''
      },
      customers: [],
      url: 'http://127.0.0.1:8000/projects/', 
      customersUrl: 'http://127.0.0.1:8000/customers/' 
    };
  },
  async created() {
    await this.fetchCustomers();
  },
  methods: {
    async fetchCustomers() {
      try {
        const response = await axios.get(this.customersUrl);
        this.customers = response.data;
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    }
  },
  setup() {
    const { handleSubmit, handleReset } = useForm({
      validationSchema: {
        name: 'required|min:3',
        description: 'required|min:3',
        select: 'required'
      },
      select(value) {
        if (value) return true;
        return 'This field is required';
      },
    });

    const submit = handleSubmit(async (values) => {
      try {
        const response = await axios.post(this.url, values);
        console.log(response.data);
        alert('Project created');
      } catch (error) {
        console.error(error);
        alert('Error');
      }
    });

    return { submit, handleReset };
  }
};
</script>