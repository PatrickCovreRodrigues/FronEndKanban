<template>
  <form @submit.prevent="submit">
    <v-text-field
      v-model="formData.name"
      label="Name"
      :rules="[rules.required]"
    ></v-text-field>

    <v-text-field
      v-model="formData.description_project"
      label="Description"
      :rules="[rules.required]"
    ></v-text-field>

    <v-select
      v-model="formData.customer_id"
      :items="customers"
      item-title="name"
      item-value="id"
      label="Select Customer"
      :rules="[rules.required]"
    ></v-select>

    <v-btn type="submit">Submit</v-btn>
  </form>
</template>

<script>
import axios from 'axios';
import { useForm, defineRule } from 'vee-validate';
import { required } from '@vee-validate/rules';

export default {
  data() {
    return {
      formData: {
        name: '',
        description_project: '',
        customer_id: null 
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
        this.customers = response.data.map(customer => ({
          id: customer.id,
          name: customer.name 
        }));
        console.log(this.customers);
      } catch (error) {
        console.error('Error fetching customers:', error);
      } 
    },
    async submit() {
      try {
        const { id, ...payload } = this.formData;
        const response = await axios.post(this.url, payload);
        console.log(response.data);
        alert('Project created successfully!');
      } catch (error) {
        console.error('Error creating project:', error.response.data);
        alert('Failed to create project.');
      }
    }
  },
  setup() {
    defineRule('required', required);

    const { handleSubmit, handleReset } = useForm({
      validationSchema: {
        name: required,
        description_project: required,
        customer_id: required
      }
    });
    
    return {
      handleSubmit,
      handleReset,
      rules: {
        required
      }
    };
  }
};
</script>
