<template>
  <UiAlertDialog>
    <UiAlertDialogTrigger as-child>
      <slot />
    </UiAlertDialogTrigger>
    <UiAlertDialogContent class="max-w-[400px]">
      <UiFancyIcon type="light" color="error" circle icon="">
        <UiIcon class="text-destructive" name="lucide:trash-2" />
      </UiFancyIcon>
      <UiAlertDialogHeader>
        <UiAlertDialogTitle class="text-left">Delete Template</UiAlertDialogTitle>
        <UiAlertDialogDescription class="text-left">
          This action will permanently delete this template design. Are you sure you want to
          proceed?
        </UiAlertDialogDescription>
      </UiAlertDialogHeader>
      <UiAlertDialogFooter class="grid grid-cols-2">
        <UiAlertDialogCancel />
        <UiAlertDialogAction @click="performDelete" />
      </UiAlertDialogFooter>
    </UiAlertDialogContent>
  </UiAlertDialog>
</template>

<script lang="ts" setup>
  const props = defineProps<{
    template?: Template;
  }>();

  const emit = defineEmits<{
    refresh: [];
  }>();

  const performDelete = async () => {
    if (!props.template) return;
    try {
      await useTemplate().remove(props.template!.id!);
      useSonner.success("Template deleted successfully.", {
        description: "The template has been deleted.",
      });
      emit("refresh");
    } catch (error) {
      useSonner.error("Failed to delete template.", {
        description: formatErrorMessage(error),
      });
    }
  };
</script>
