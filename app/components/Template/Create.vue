<template>
  <UiSheet v-model:open="open">
    <UiSheetTrigger as-child>
      <slot />
    </UiSheetTrigger>

    <UiSheetContent
      side="right"
      title="Create template"
      description="Give your template a name to start designing."
    >
      <template #content>
        <UiDivider class="mb-5 mt-3" />
        <form @submit="submit">
          <fieldset :disabled="isSubmitting" class="grid gap-5">
            <UiVeeInput name="name" label="Template name" required />
            <UiButton type="submit">Create template</UiButton>
          </fieldset>
        </form>
        <UiSheetX />
      </template>
    </UiSheetContent>
  </UiSheet>
</template>

<script lang="ts" setup>
  const open = ref(false);
  const { handleSubmit, isSubmitting, resetForm } = useForm({
    name: "create-template-form",
    validationSchema: toTypedSchema(CreateProjectSchema),
  });

  const project = inject<Ref<FindOne<Project>>>("project-details");

  if (!project) {
    throw createError({
      statusCode: 404,
      statusMessage: "Project not found.",
      message: "The TemplateCreate component must be used within a project.",
    });
  }

  const submit = handleSubmit(async (values) => {
    try {
      const res = await useTemplate().create({
        name: values.name,
        projectId: project.value.data.id,
      });
      useSonner.success("Template created successfully.");
      open.value = false;
      resetForm();
      await navigateTo(`/admin/projects/${project.value.data.id}/templates/${res.data.id}/editor`);
    } catch (error) {
      useSonner.error("Failed to create template.", {
        description: formatErrorMessage(error),
      });
    }
  });
</script>
