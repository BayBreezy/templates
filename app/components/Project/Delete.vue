<template>
  <UiAlertDialog>
    <UiAlertDialogTrigger as-child>
      <slot />
    </UiAlertDialogTrigger>
    <UiAlertDialogContent class="max-w-[400px]">
      <UiFancyIcon type="light" color="error" circle icon="lucide:trash-2" />
      <UiAlertDialogHeader>
        <UiAlertDialogTitle class="text-left">Delete Project</UiAlertDialogTitle>
        <UiAlertDialogDescription class="text-left">
          This action will permanently delete the project and all its associated design templates.
          Are you sure you want to proceed?
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
    project?: Project;
  }>();

  const performDelete = async () => {
    if (!props.project) return;
    try {
      await useProject().remove(props.project!.id!);
      useSonner.success("Project deleted successfully.", {
        description:
          "The project along with all its associated design templates have been deleted.",
      });
      return await navigateTo("/admin/projects");
    } catch (error) {
      useSonner.error("Failed to delete project.", {
        description: formatErrorMessage(error),
      });
    }
  };
</script>
