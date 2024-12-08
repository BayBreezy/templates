export default defineNuxtConfig({
  devtools: { enabled: true },
  experimental: { typedPages: true },
  future: { compatibilityVersion: 4 },
  nitro: {
    imports: { dirs: ["./lib"] },
  },
  routeRules: {
    "/": { redirect: "/auth/login" },
    "/admin/**": { ssr: false },
    "/api/**": { cors: true },
  },
  css: ["~/assets/css/tippy.css"],
  icon: { clientBundle: { scan: true, sizeLimitKb: 0 }, mode: "svg" },
  modules: [
    "@nuxtjs/tailwindcss",
    "@vueuse/nuxt",
    "@vee-validate/nuxt",
    "@nuxtjs/color-mode",
    "@nuxt/icon",
    "@nuxt/fonts",
    "nuxt-unlayer",
    "@morev/vue-transitions/nuxt",
    "@nuxt/eslint",
    "json-editor-vue/nuxt",
  ],
  tailwindcss: { exposeConfig: true, editorSupport: true },
  colorMode: { classSuffix: "" },
  imports: {
    imports: [
      { from: "tailwind-variants", name: "tv" },
      { from: "tailwind-variants", name: "VariantProps", type: true },
      { from: "vue-sonner", name: "toast", as: "useSonner" },
    ],
  },

  app: {
    head: {
      title: "Templates",
      titleTemplate: "%s | Templates",
      script: [
        {
          src: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.12/pdfmake.min.js",
          defer: true,
        },
        {
          src: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.12/vfs_fonts.min.js",
          defer: true,
        },
      ],
    },
  },
  compatibilityDate: "2024-12-03",
  build: { transpile: ["vue-sonner"] },
});