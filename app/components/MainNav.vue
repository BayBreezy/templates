<template>
  <UiNavbar sticky>
    <div class="container flex h-16 items-center justify-between">
      <NuxtLink to="/">
        <Logo class="h-6" />
      </NuxtLink>
      <div class="flex items-center gap-2">
        <div v-tippy="'Go to projects'">
          <UiButton variant="outline" size="icon-sm" to="/">
            <Icon class="size-4 text-foreground/80" name="lucide:home" />
            <span class="sr-only">Click to go to projects</span>
          </UiButton>
        </div>
        <UiButton
          v-tippy="'Change theme'"
          variant="outline"
          size="icon-sm"
          @click="$colorMode.preference = $colorMode.value == 'dark' ? 'light' : 'dark'"
        >
          <Icon class="size-4" name="lucide:sun" />
          <span class="sr-only">Click to change theme</span>
        </UiButton>
        <UiButton v-tippy="'Logout'" variant="outline" size="icon-sm" @click="useAuth().logout()">
          <Icon class="size-4" name="lucide:log-out" />
          <span class="sr-only">Click to logout</span>
        </UiButton>
      </div>
    </div>
  </UiNavbar>
</template>

<script lang="ts" setup></script>
