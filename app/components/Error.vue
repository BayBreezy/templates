<template>
  <div class="relative flex h-screen items-center">
    <div
      class="absolute h-full w-full bg-[radial-gradient(theme(colors.border)_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"
    />
    <div class="container relative z-[1] flex flex-col items-center justify-center text-center">
      <p class="mb-5 font-bold tracking-tight text-primary">{{ statusCode }}</p>
      <h1 class="text-4xl font-bold tracking-tight">{{ title }}</h1>
      <p class="mt-2 text-lg text-muted-foreground">
        {{ props.message }}
      </p>
      <UiButton class="mt-10" @click="clearError({ redirect: '/' })">Take me home</UiButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps<{
    statusCode?: number;
    fatal?: boolean;
    unhandled?: boolean;
    statusMessage?: string;
    message?: string;
    data?: unknown;
    cause?: unknown;
  }>();

  const title = computed(() => {
    if (!props.message && !props.statusMessage) return "Error";
    if (props.statusMessage) return props.statusMessage;
    return props.message || "Error";
  });

  useSeoMeta({ title });
</script>
