<template>
  <v-bottom-navigation :elevation="24" grow>
    <v-btn :to="'/viewProjects'" >
      <IconClipboardSearch stroke={2} />
      <span>Ir para Projeto</span>
    </v-btn>

    <v-btn value="activitys">
      <IconPin stroke={2} />
      <span>Criar atividade</span>
    </v-btn>

    <v-btn value="customers">
      <IconUserPlus stroke={2} />
      <span>Ir para Cliente</span>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
import { IconUserPlus } from '@tabler/icons-vue';
import { IconPin } from '@tabler/icons-vue';
import { IconClipboardSearch } from '@tabler/icons-vue';


export default {
  components: {
    IconUserPlus,
    IconPin,
    IconClipboardSearch
  },
};
</script>
