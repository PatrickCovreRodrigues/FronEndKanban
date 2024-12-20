<template>
  <v-bottom-navigation :elevation="24" grow>
    <v-btn value="recent">
      <IconClipboardSearch stroke={2} />
      <span>Criar Projeto</span>
    </v-btn>

    <v-btn value="favorites">
      <IconPin stroke={2} />
      <span>Criar atividade</span>
    </v-btn>

    <v-btn value="nearby">
      <IconUserPlus stroke={2} />
      <span>Criar Cliente</span>
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
