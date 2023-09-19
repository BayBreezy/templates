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
              <UIButton variant="ghost" size="icon" @click="toggleColorMode">
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

              <UITooltip>
                <template #trigger>
                  <UITooltipTrigger>
                    <UIButton
                      @click="
                        editNameDialog = true;
                        editItem = t;
                      "
                      class="h-8 w-8"
                      variant="ghost"
                      size="icon"
                      ><Icon name="solar:pen-2-line-duotone"
                    /></UIButton>
                  </UITooltipTrigger>
                </template>
                <template #content>
                  <UITooltipContent align="center">
                    <p class="text-sm">Edit template name</p>
                  </UITooltipContent>
                </template>
              </UITooltip>
            </UICardTitle>
            <UICardDescription>{{ formatDate(t.createdAt) }}</UICardDescription>
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
          <div class="py-4">
            <UIFormInput name="name" label="Template name" placeholder="Template name" />
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
            <UIButton @click="updateTemplate">Update</UIButton>
          </UIDialogFooter>
        </template>
      </UIDialogContent>
    </UIDialog>
  </div>
</template>

<script lang="ts" setup>
  import { object, string } from "yup";

  useSeoMeta({ title: "Templates" });

  const editNameDialog = ref(false);

  const editItem = ref<Template | null>(null);

  watch(editNameDialog, (val) => {
    if (!val) {
      editItem.value = null;
    }
  });

  const { data: templates, refresh } = useFetch<Template[]>("/api/templates");

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const mode = useColorMode();
  const toggleColorMode = () => {
    mode.value = mode.value === "dark" ? "light" : "dark";
  };

  const { handleSubmit, isSubmitting } = useForm({
    initialValues: editItem,
    validationSchema: toTypedSchema(
      object({
        name: string().required("Name is required"),
      })
    ),
  });

  const updateTemplate = handleSubmit(async (values) => {
    const { error } = await useFetch(`/api/templates/${editItem.value?._id}`, {
      method: "PUT",
      body: JSON.stringify(values),
    });
    if (error.value) {
      return console.log(error.value);
    }
    await refresh();
    editNameDialog.value = false;
  });

  const deleteTemplate = async (id: string) => {
    const { error } = await useFetch(`/api/templates/${id}`, {
      method: "DELETE",
    });
    if (error.value) {
      return console.log(error.value);
    }
    await refresh();
  };
</script>
