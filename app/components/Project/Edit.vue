<template>
  <div>
    <UiCollapsible v-model:open="open">
      <UiCollapsibleTrigger as-child>
        <UiButton :variant="open ? 'outline' : 'secondary'">
          {{ open ? "Close edit form" : "Click to edit project" }}
          <Icon :name="open ? 'lucide:x' : 'lucide:chevron-down'" />
        </UiButton>
      </UiCollapsibleTrigger>
      <UiCollapsibleContent>
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
        <UiDivider class="mt-8" />
      </UiCollapsibleContent>
    </UiCollapsible>
  </div>
</template>

<script lang="ts" setup>
  const open = ref(false);
  const project = inject<Ref<FindOne<Project>>>("project-details");

  if (!project) {
    throw createError({
      statusCode: 404,
      statusMessage: "Project not found.",
      message: "The project you are trying to edit does not exist.",
    });
  }

  const { handleSubmit, isSubmitting, setValues } = useForm({
    name: "edit-project-form",
    initialValues: project?.value.data,
    validationSchema: toTypedSchema(CreateProjectSchema),
  });

  watch(open, (v) => {
    if (v) {
      setValues(project?.value.data);
    }
  });

  const submit = handleSubmit(async (values) => {
    try {
      await useProject().update(project.value.data.id!, values);
      useSonner.success("Project updated successfully.");
      await refreshNuxtData();
    } catch (error) {
      useSonner.error("Failed to update project.", {
        description: formatErrorMessage(error),
      });
    }
  });
</script>
