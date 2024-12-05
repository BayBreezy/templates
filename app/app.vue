<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UiVueSonner />
  </div>
</template>
<script lang="ts" setup>
  const title = "Templates";
  const description = "Create and manage email templates";
  const image = "/cover.png";
  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogImage: image,
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: image,
    twitterCard: "summary_large_image",
  });
  useHead({
    htmlAttrs: { lang: "en" },
    link: [{ rel: "icon", type: "image/svg+xml", href: "/logo.svg" }],
  });
</script>
