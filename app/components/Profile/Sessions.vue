<template>
  <div>
    <slot name="title">
      <h2 v-if="title" class="text-xl font-semibold">{{ title }}</h2>
    </slot>
    <slot name="description">
      <p v-if="description">{{ description }}</p>
    </slot>

    <ul class="mt-10 flex flex-col gap-5">
      <template v-for="(s, i) in data?.data" :key="i">
        <li class="flex flex-col gap-1 rounded-lg border p-5 text-sm">
          <div class="flex items-center justify-between gap-3">
            <p class="font-semibold">
              {{ UAParser(s.userAgent).browser?.name }} {{ UAParser(s.userAgent).browser?.version }}
            </p>
            <UiBadge v-if="isCurrentSession(s)">Active</UiBadge>
          </div>
          <p v-if="isCurrentSession(s)">
            {{ user?.session.location }}
          </p>
          <p class="text-muted-foreground">
            {{ UAParser(s.userAgent).os?.name }} {{ UAParser(s.userAgent).os?.version }}
          </p>
          <p class="text-muted-foreground">
            {{ UAParser(s.userAgent).device?.vendor }} {{ UAParser(s.userAgent).device?.model }}
          </p>
          <p class="text-muted-foreground">
            Created
            <span>{{ useDateFormat(s.createdAt, "ddd MMM DD, YYYY h:mm A").value }}</span>
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

  const user = useUser();

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

  const isCurrentSession = (session: typeof authClient.$Infer.Session.session) => {
    return session.token === user.value?.session?.token;
  };
</script>
