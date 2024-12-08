<template>
  <div>
    <MainNav />
    <div class="container py-5">
      <PageHeading :title="title" :description="description" />
      <UiDivider class="mb-6 mt-10" />
      <UiTabs default-value="personal">
        <UiTabsList class="justify-start">
          <UiTabsTrigger v-for="(t, i) in tabs" :key="i" class="gap-2" :value="t.value"
            ><Icon :name="t.icon" /> {{ t.label }}</UiTabsTrigger
          >
        </UiTabsList>
        <UiTabsContent value="personal">
          <ProfilePersonal class="max-w-md px-2 py-5" />
        </UiTabsContent>
        <UiTabsContent value="password">
          <ProfilePassword class="max-w-md px-2 py-5" />
        </UiTabsContent>
        <UiTabsContent value="sessions">
          <ProfileSessions class="max-w-md px-2 py-5" />
        </UiTabsContent>
      </UiTabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const title = "Profile";
  const description = "Here you can manage your profile.";
  useSeoMeta({ title, description });

  const tabs = [
    { label: "Personal", value: "personal", icon: "lucide:user" },
    { label: "Password", value: "password", icon: "lucide:lock-keyhole" },
    { label: "Sessions", value: "sessions", icon: "lucide:laptop" },
  ];
</script>
