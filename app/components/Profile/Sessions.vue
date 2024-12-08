<template>
  <div>
    <slot name="title">
      <h2 v-if="title" class="text-xl font-semibold">{{ title }}</h2>
    </slot>
    <slot name="description">
      <p v-if="description">{{ description }}</p>
    </slot>

    <ul class="mt-10">
      <template v-for="(s, i) in data?.data" :key="i">
        <li class="flex flex-col gap-1 rounded-lg border p-5 text-sm">
          <p class="font-semibold">
            {{ UAParser(s.userAgent).browser?.name }} {{ UAParser(s.userAgent).browser?.version }}
          </p>
          <p class="text-muted-foreground">
            {{ UAParser(s.userAgent).os?.name }} {{ UAParser(s.userAgent).os?.version }}
          </p>
          <p class="text-muted-foreground">
            {{ UAParser(s.userAgent).device?.vendor }} {{ UAParser(s.userAgent).device?.model }}
          </p>
          <div class="mt-3">
            <UiButton
              variant="outline"
              size="sm"
              @click="
                authClient.revokeSession({
                  token: s.token,
                })
              "
            >
              <Icon name="lucide:trash" />
              Revoke session
            </UiButton>
          </div>
        </li>
      </template>
    </ul>
  </div>
</template>

<script lang="ts" setup>
  import { UAParser } from "ua-parser-js";

  const { data } = await useAsyncData(() => authClient.listSessions());
  withDefaults(
    defineProps<{
      title?: string;
      description?: string;
    }>(),
    {
      title: "Sessions",
      description: "Here you can manage your sessions.",
    }
  );
</script>
