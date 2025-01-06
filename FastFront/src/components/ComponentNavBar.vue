<template>
  <v-bottom-navigation :elevation="24" grow>
    <v-btn :to="'/'" >
      <IconClipboardSearch stroke={2} />
      <span>Ir para Projeto</span>
    </v-btn>

    <v-btn :to="'/customer'" >
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
