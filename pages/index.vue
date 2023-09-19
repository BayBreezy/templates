<template>
  <div class="container py-5">
    <div class="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl font-bold">Templates</h1>
        <p class="text-muted-foreground">A list of all saved templates</p>
      </div>
      <div class="flex items-center gap-3">
        <UITooltip>
          <template #trigger>
            <UITooltipTrigger>
              <UIButton variant="outline" size="icon" @click="toggleColorMode">
                <Icon
                  class="h-5 w-5"
                  :name="
                    mode === 'dark' ? 'solar:sun-2-line-duotone' : 'solar:moon-fog-bold-duotone'
                  "
                />
              </UIButton>
            </UITooltipTrigger>
          </template>
          <template #content>
            <UITooltipContent align="center">
              <p class="text-sm">Click to switch to {{ mode == "dark" ? "light" : "dark" }} mode</p>
            </UITooltipContent>
          </template>
        </UITooltip>
        <UIButton to="/editor">Create New</UIButton>
      </div>
    </div>

    <section
      v-if="templates && templates.length"
      class="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3"
    >
      <template v-for="t in templates" :key="t._id">
        <UICard>
          <UICardHeader>
            <UICardTitle class="flex items-center justify-between gap-2 text-base font-semibold"
              >{{ t.name }}

              <UIDropdownMenu>
                <UIDropdownMenuTrigger asChild>
                  <UIButton class="h-8 w-8" variant="ghost" size="icon"
                    ><Icon class="h-5 w-5 rotate-90" name="solar:menu-dots-bold-duotone"
                  /></UIButton>
                </UIDropdownMenuTrigger>
                <UIDropdownMenuContent class="min-w-[180px]" align="end" :side-offset="8">
                  <UIDropdownMenuGroup class="space-y-1">
                    <UIDropdownMenuItem
                      @click="
                        editItem = t;
                        editNameDialog = true;
                      "
                      title="Edit name"
                      icon="solar:pen-line-duotone"
                    />
                    <UIDropdownMenuItem
                      @click="useExportTemplate(t.name + '.html', t.html!)"
                      title="Export HTML"
                      icon="solar:cloud-download-line-duotone"
                    />
                    <UIDropdownMenuItem
                      @click="useExportTemplate(t.name + '.json', JSON.stringify(t.design))"
                      title="Download design"
                      icon="solar:download-minimalistic-bold-duotone"
                    />
                    <UIDropdownMenuItem
                      @click="usePreviewTemplate(t.html!)"
                      title="Preview design"
                      icon="solar:telescope-line-duotone"
                    />
                  </UIDropdownMenuGroup>
                </UIDropdownMenuContent>
              </UIDropdownMenu>
            </UICardTitle>
            <UICardDescription class="truncate">{{ formatDate(t.createdAt) }}</UICardDescription>
          </UICardHeader>
          <UICardFooter class="gap-3">
            <UIAlertDialog
              trigger-text="Delete"
              title="Delete template"
              description="Are you sure you want to remove this template? This cannot be undone."
            >
              <template #trigger>
                <UIAlertDialogTrigger as-child>
                  <UIButton size="sm" class="h-8" variant="ghost">Delete</UIButton>
                </UIAlertDialogTrigger>
              </template>
              <template #action>
                <UIAlertDialogAction text="Confirm" @click="deleteTemplate(t._id)" />
              </template>
            </UIAlertDialog>
            <UIButton size="sm" class="h-8" :to="`/editor?id=${t._id}`">Edit</UIButton>
          </UICardFooter>
        </UICard>
      </template>
    </section>

    <section class="mt-14 flex flex-col items-center justify-center py-10" v-else>
      <Icon name="solar:document-medicine-line-duotone" class="h-20 w-20 text-muted-foreground" />
      <h2 class="mt-5 text-xl font-semibold">No templates found</h2>
      <p class="text-sm text-muted-foreground">Create a new template to get started</p>

      <UIButton to="/editor" class="mt-5">Create New</UIButton>
    </section>

    <!-- Used to edit name of template -->
    <UIDialog :default-open="false" v-model="editNameDialog">
      <UIDialogContent title="Edit template name" description="Enter a new name for your template">
        <template #content>
          <div class="py-2">
            <UIFormInput
              :disabled="isSubmitting"
              name="name"
              label="Template name"
              placeholder="Template name"
            />
          </div>
        </template>
        <template #footer>
          <UIDialogFooter>
            <UIButton
              variant="ghost"
              @click="
                editNameDialog = false;
                editItem = null;
              "
              >Cancel</UIButton
            >
            <UIButton :disabled="isSubmitting" @click="updateTemplate">Update</UIButton>
          </UIDialogFooter>
        </template>
      </UIDialogContent>
    </UIDialog>
  </div>
</template>

<script lang="ts" setup>
  import { object, string } from "yup";

  useSeoMeta({ title: "Templates" });
  // State for dialog used to edit template name
  const editNameDialog = ref(false);
  // State for template being edited
  const editItem = ref<Template | null>(null);
  // Watch for dialog closing and reset editItem
  watch(editNameDialog, (val) => {
    if (!val) {
      editItem.value = null;
    }
  });
  // Fetch templates
  const { data: templates, refresh } = useFetch<Template[]>("/api/templates");
  // Format date
  const formatDate = (date?: Date) => {
    if (!date) return "";
    return useDateFormat(date, "MMMM DD, YYYY @ hh:mm AA").value;
  };

  // Theme toggler
  const { mode, toggleColorMode } = useTheme();

  const { handleSubmit, isSubmitting } = useForm({
    initialValues: editItem,
    validationSchema: toTypedSchema(
      object({
        name: string().required("Name is required"),
      })
    ),
  });

  const updateTemplate = handleSubmit(async (values) => {
    if (!editItem.value) return;
    await useToast.promise(useUpdateTemplate(editItem.value._id!, values), {
      error: "Failed to update template",
      success: "Template updated successfully",
      pending: "Updating template...",
    });
    await refresh();
    editNameDialog.value = false;
  });

  const deleteTemplate = async (id?: string) => {
    if (!id) return;
    await useToast.promise(useDeleteTemplate(id), {
      error: "Failed to delete template",
      success: "Template deleted successfully",
      pending: "Deleting template...",
    });
    await refresh();
  };
</script>
