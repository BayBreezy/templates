// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  typescript: { shim: false },
  tailwindcss: { exposeConfig: true, injectPosition: "last" },
  css: ["vue3-toastify/dist/index.css"],
  imports: {
    // Add tv and VariantProps to the set of auto imported modules
    imports: [
      { from: "tailwind-variants", name: "tv" },
      { from: "vue3-toastify", name: "toast", as: "useToast" },
      { from: "tailwind-variants", name: "VariantProps", type: true },
    ],
  },
  app: {
    head: {
      title: "Templates",
      link: [
        // Favicon
        { rel: "icon", type: "image/x-icon", href: "/icon.png" },
        // Inter font
        { rel: "stylesheet", href: "https://rsms.me/inter/inter.css" },
        { rel: "preconnect", href: "https://rsms.me/" },
      ],
    },
  },
  mongoose: {
    uri: process.env.MONGODB_URI || "mongodb://localhost:27017/your_db_name",
  },
  modules: [
    "@nuxtjs/tailwindcss",
    "@vueuse/nuxt",
    "radix-vue/nuxt",
    "nuxt-icon",
    "@vee-validate/nuxt",
    "@samk-dev/nuxt-vcalendar",
    "nuxt-mongoose",
  ],
});
