<template>
  <UiSheet v-model:open="open">
    <UiSheetTrigger as-child>
      <slot />
    </UiSheetTrigger>

    <UiSheetContent
      side="right"
      title="Create project"
      description="Give your project a name to start adding templates."
    >
      <template #content>
        <UiDivider class="mb-5 mt-3" />
        <form @submit="submit">
          <fieldset :disabled="isSubmitting" class="grid gap-5">
            <UiVeeInput name="name" label="Project name" required />
            <UiVeeTextarea
              name="description"
              label="Description"
              hint="This is an optional description of your project."
            />
            <UiButton type="submit">Create project</UiButton>
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
    name: "create-project-form",
    validationSchema: toTypedSchema(CreateProjectSchema),
  });

  const submit = handleSubmit(async (values) => {
    try {
      const res = await useProject().create(values);
      useSonner.success("Project created successfully.");
      open.value = false;
      resetForm();
      await navigateTo(`/admin/projects/${res.data.id}/templates`);
    } catch (error) {
      useSonner.error("Failed to create project.", {
        description: formatErrorMessage(error),
      });
    }
  });
</script>
