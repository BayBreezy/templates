<template>
  <UiAlertDialog>
    <UiAlertDialogTrigger as-child>
      <slot />
    </UiAlertDialogTrigger>
    <UiAlertDialogContent class="max-w-[400px]">
      <UiFancyIcon icon="">
        <UiIcon name="lucide:copy" />
      </UiFancyIcon>
      <UiAlertDialogHeader>
        <UiAlertDialogTitle class="text-left">Duplicate Template</UiAlertDialogTitle>
        <UiAlertDialogDescription class="text-left">
          This action will duplicate this template design. Are you sure you want to proceed?
        </UiAlertDialogDescription>
      </UiAlertDialogHeader>
      <UiAlertDialogFooter class="grid grid-cols-2">
        <UiAlertDialogCancel />
        <UiAlertDialogAction @click="performDuplicate" />
      </UiAlertDialogFooter>
    </UiAlertDialogContent>
  </UiAlertDialog>
</template>

<script lang="ts" setup>
  const props = defineProps<{
    template?: Template;
  }>();

  const emit = defineEmits<{ refresh: [] }>();

  const performDuplicate = async () => {
    if (!props.template) return;
    try {
      await useTemplate().duplicate(props.template!.id!);
      useSonner.success("Template duplicated successfully.", {
        description: "The template has been duplicated.",
      });
      emit("refresh");
    } catch (error) {
      useSonner.error("Failed to duplicate template.", {
        description: formatErrorMessage(error),
      });
    }
  };
</script>
