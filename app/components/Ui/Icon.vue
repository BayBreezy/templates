<template>
  <Icon :icon="name" v-bind="props" />
</template>

<script lang="ts" setup>
  import { Icon } from "@iconify/vue";
  import type { IconifyIconProps } from "@iconify/vue";

  const props = defineProps<
    Omit<IconifyIconProps, "icon"> & {
      name: string;
    }
  >();
</script>
