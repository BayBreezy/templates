import Vue3Toastify, { type ToastOptions } from "vue3-toastify";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Vue3Toastify, {
    autoClose: 7000,
  } satisfies ToastOptions);
});
