<template>
  <UiSheet v-model:open="open">
    <UiSheetTrigger as-child>
      <slot />
    </UiSheetTrigger>

    <UiSheetContent
      side="right"
      title="Edit template name"
      description="Update the name of your template."
    >
      <template #content>
        <UiDivider class="mb-5 mt-3" />
        <form @submit="submit">
          <fieldset :disabled="isSubmitting" class="grid gap-5">
            <UiVeeInput name="name" label="Template name" required />
            <UiButton type="submit">Update template name</UiButton>
          </fieldset>
        </form>
        <UiSheetX />
      </template>
    </UiSheetContent>
  </UiSheet>
</template>

<script lang="ts" setup>
  const open = ref(false);
  const props = defineProps<{ template?: Template }>();
  const { handleSubmit, isSubmitting, setValues } = useForm({
    name: "edit-template-name-form",
    initialValues: props.template,
    validationSchema: toTypedSchema(CreateProjectSchema),
  });

  const emit = defineEmits<{ refresh: [] }>();
  watch(open, (v) => {
    if (v) setValues(props.template || {});
  });

  const submit = handleSubmit(async (values) => {
    if (!props.template) return;
    try {
      await useTemplate().update(props.template.id!, {
        name: values.name,
      });
      useSonner.success("Template updated successfully.");
      open.value = false;
      emit("refresh");
    } catch (error) {
      useSonner.error("Failed to update template.", {
        description: formatErrorMessage(error),
      });
    }
  });
</script>
