<template>
  <UiSheet v-model:open="open">
    <UiSheetTrigger as-child>
      <slot />
    </UiSheetTrigger>

    <UiSheetContent
      class="md:max-w-2xl"
      side="right"
      title="Send Test Email"
      description="Fill out the form below to send a test email"
    >
      <template #content>
        <UiDivider class="mb-5 mt-3" />
        <form @submit="submit">
          <fieldset :disabled="isSubmitting" class="grid gap-5">
            <UiVeeInput name="email" label="Email" type="email" required />
            <UiVeeInput name="subject" label="Subject" required />
            <div class="flex flex-col gap-2">
              <UiLabel for="data">Template data</UiLabel>
              <JSONEditor
                v-model="data"
                :class="[$colorMode.value == 'dark' && 'jse-theme-dark']"
                :mode="Mode.text"
              />
              <span class="text-sm text-muted-foreground"
                >Templates use
                <NuxtLink
                  href="https://mustache.github.io/mustache.5.html"
                  target="_blank"
                  external
                  class="text-sky-500 underline underline-offset-2"
                  >Mustache</NuxtLink
                >
                to inject the data. Your design can include mustache syntax. If it does, be sure to
                add the JSON object to the input above.</span
              >
            </div>
            <UiButton variant="ringHover" type="submit">
              <span v-if="!isSubmitting">Send Test Email</span>
              <Icon v-else name="svg-spinners:8-dots-rotate" />
            </UiButton>
          </fieldset>
        </form>
        <UiSheetX />
      </template>
    </UiSheetContent>
  </UiSheet>
</template>

<script lang="ts" setup>
  import { useStorage } from "@vueuse/core";
  import destr from "destr";
  import JSONEditor from "json-editor-vue";
  import { Mode } from "vanilla-jsoneditor";

  import "vanilla-jsoneditor/themes/jse-theme-dark.css";

  const open = ref(false);
  const { handleSubmit, isSubmitting, resetForm } = useForm({
    name: "send-test-email-form",
    validationSchema: toTypedSchema(SendTestEmailSchema),
  });

  const template = inject<Ref<FindOne<Template>>>("template-details");

  if (!template) {
    throw createError({
      statusCode: 404,
      statusMessage: "Template not found.",
      message: "The TestEmail component must be used within a template.",
    });
  }
  const data = useStorage(`${template.value.data.id}-test-email-data`, {});

  const submit = handleSubmit(async (values) => {
    try {
      await useTemplate().sendTestTemplate(template.value.data.id!, {
        email: values.email,
        subject: values.subject,
        data: destr(data.value),
      });
      open.value = false;
      useSonner.success("Test email sent successfully.");
      resetForm();
    } catch (error) {
      useSonner.error("Failed to send test email.", {
        description: formatErrorMessage(error),
      });
    }
  });
</script>

<style>
  :root {
    --jse-theme-color: theme(colors.primary.DEFAULT);
    --jse-menu-color: theme(colors.primary.foreground);
    --jse-font-family: theme(fontFamily.sans);
    --jse-theme-color-highlight: theme(colors.primary.foreground/40%);
    --jse-button-primary-color: theme(colors.primary.foreground);
    --jse-button-primary-background-highlight: theme(colors.primary.DEFAULT/70%);

    .jse-theme-dark {
      --jse-theme-color: theme(colors.primary.DEFAULT);
      --jse-menu-color: theme(colors.primary.foreground);
      --jse-font-family: theme(fontFamily.sans);
      --jse-theme-color-highlight: theme(colors.primary.foreground/40%);
      --jse-button-primary-color: theme(colors.primary.foreground);
      --jse-button-primary-background-highlight: theme(colors.primary.DEFAULT/70%);
    }
  }
</style>
