<template>
  <div :class="styles({ class: props.class })">
    <div>
      <slot name="title">
        <h1 v-if="title" class="mb-2 text-2xl font-bold tracking-tight lg:text-3xl">{{ title }}</h1>
      </slot>
      <slot name="description">
        <p v-if="description" class="text-muted-foreground">{{ description }}</p>
      </slot>
    </div>
    <slot />
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps<{
    title?: string;
    description?: string;
    class?: any;
  }>();

  const styles = tv({
    base: "grid grid-cols-1 gap-5 md:flex md:items-center md:justify-between",
  });
</script>
