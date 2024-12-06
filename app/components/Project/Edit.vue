<template>
  <UiSheet v-model:open="open">
    <UiSheetTrigger as-child>
      <slot />
    </UiSheetTrigger>

    <UiSheetContent
      class="md:max-w-xl"
      side="right"
      title="Edit project"
      description="You can update the project name and description."
    >
      <template #content>
        <UiDivider class="mb-5 mt-3" />
        <form class="mt-5 max-w-xl" @submit="submit">
          <fieldset :disabled="isSubmitting" class="grid gap-5">
            <UiVeeInput name="name" label="Project name" required />
            <UiVeeTextarea
              name="description"
              label="Description"
              hint="This is an optional description of your project."
            />
            <div>
              <UiButton type="submit">Update details</UiButton>
            </div>
          </fieldset>
        </form>
        <UiSheetX />
      </template>
    </UiSheetContent>
  </UiSheet>
</template>

<script lang="ts" setup>
  const open = ref(false);
  const props = defineProps<{
    project?: Project;
  }>();

  const { handleSubmit, isSubmitting, setValues } = useForm({
    name: "edit-project-form",
    initialValues: props.project,
    validationSchema: toTypedSchema(CreateProjectSchema),
  });

  watch(open, (v) => {
    if (v) {
      setValues(props.project || {});
    }
  });

  const submit = handleSubmit(async (values) => {
    if (!props.project) return;
    try {
      await useProject().update(props.project.id!, values);
      useSonner.success("Project updated successfully.", {
        position: "top-left",
      });
      await refreshNuxtData();
      open.value = false;
    } catch (error) {
      useSonner.error("Failed to update project.", {
        description: formatErrorMessage(error),
      });
    }
  });
</script>
