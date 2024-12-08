<template>
  <div>
    <UiNavbar sticky>
      <div id="bar" class="flex h-16 items-center justify-between px-3 lg:px-3">
        <div class="flex items-center">
          <UiButton variant="outline" size="icon" class="mr-4 h-8 w-8" @click="$router.back()">
            <Icon name="lucide:arrow-left" class="h-4 w-4" />
          </UiButton>
          <h1 class="text-lg font-semibold">{{ template?.data?.name }}</h1>
        </div>

        <div class="flex items-center gap-2">
          <UiDropdownMenu v-model:open="dropdownOpen">
            <UiDropdownMenuTrigger as-child>
              <UiButton variant="outline"
                >Actions <Icon name="solar:alt-arrow-down-line-duotone"
              /></UiButton>
            </UiDropdownMenuTrigger>
            <UiDropdownMenuContent class="w-[200px]" align="end" :side-offset="10">
              <UiDropdownMenuGroup class="space-y-1">
                <UiDropdownMenuLabel label="Main Action" />
                <TemplateEditName
                  :template="template?.data"
                  @refresh="
                    refresh();
                    dropdownOpen = false;
                  "
                >
                  <UiDropdownMenuItem
                    title="Edit name"
                    icon="lucide:pen-line"
                    @select="(e) => e.preventDefault()"
                  />
                </TemplateEditName>
                <UiDropdownMenuItem title="Save design" icon="lucide:save" @click="saveDesign" />
                <UiDropdownMenuSeparator />
                <UiDropdownMenuLabel label="Other Actions" />
                <TemplateTestEmail>
                  <UiDropdownMenuItem
                    title="Send Test Email"
                    icon="lucide:send"
                    @select="(e) => e.preventDefault()"
                  />
                </TemplateTestEmail>
                <UiDropdownMenuItem
                  title="Export HTML"
                  icon="lucide:cloud-download"
                  @click="exportHtml"
                />
                <UiDropdownMenuItem
                  title="Preview design"
                  icon="lucide:telescope"
                  @click="preview"
                />
                <UiDropdownMenuItem title="Import design" icon="lucide:upload" @click="open()" />
                <UiDropdownMenuItem
                  title="Download design"
                  icon="lucide:download"
                  @click="downloadDesign()"
                />
              </UiDropdownMenuGroup>
            </UiDropdownMenuContent>
          </UiDropdownMenu>
        </div>
      </div>
    </UiNavbar>

    <section class="h-[calc(100dvh-65px)]">
      <ClientOnly>
        <EmailEditor display-mode="email" @ready="editorLoaded" />
      </ClientOnly>
    </section>
  </div>
</template>

<script lang="ts" setup>
  import type { EditorInstance } from "#unlayer/props";

  const route = useRoute("admin-projects-id-templates-templateId-editor");
  const emailEditor = shallowRef<EditorInstance | null | undefined>();
  const dropdownOpen = ref(false);

  const { data: template, refresh } = await useAsyncData(() =>
    useTemplate().getById(route.params.templateId, route.params.id)
  );
  if (!template.value)
    throw createError({
      statusCode: 404,
      statusMessage: "The template is required to proceed on this page",
    });

  provide("template-details", template);

  async function editorLoaded(v: any) {
    emailEditor.value = v;
    if (!template.value?.data || !template.value.data.design) return;
    emailEditor.value?.loadDesign(JSON.parse(JSON.stringify(template?.value?.data?.design)));
  }

  function saveDesign() {
    emailEditor.value?.exportHtml(async (data) => {
      try {
        await useTemplate().update(template.value!.data.id!, {
          design: data.design,
          html: data.html,
          name: template.value?.data?.name,
        });
        useSonner.success("Design saved successfully");
      } catch (error) {
        useSonner.error("Unable to save design", {
          description: formatErrorMessage(error),
        });
      }
    });
  }

  function exportHtml() {
    emailEditor.value?.exportHtml(async (data) => {
      useTemplate().exportTemplate(template.value?.data?.name + ".html", data.html);
    });
  }

  function downloadDesign() {
    emailEditor.value?.exportHtml(async (data) => {
      useTemplate().exportTemplate(
        template.value?.data?.name + ".json",
        JSON.stringify(data.design)
      );
    });
  }

  function preview() {
    emailEditor?.value?.exportHtml(async (data) => {
      console.log(data);

      useTemplate().previewTemplate(data.html);
    });
  }

  const { open, onChange: importDesign } = useFileDialog({
    accept: ".json",
    multiple: false,
    reset: true,
  });

  importDesign((files) => {
    if (!files) return;
    const file = files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const design = JSON.parse(e.target?.result as string);
      emailEditor.value?.loadDesign(design);
    };
    reader.readAsText(file);
  });

  useSeoMeta({
    title: template.value?.data?.name || "Editor",
    description: "Create and edit email templates",
  });
</script>
