<template>
  <div id="app">
    <header class="sticky top-0 z-50 border-b bg-background">
      <div id="bar" class="flex h-16 items-center justify-between px-5 lg:px-10">
        <div class="flex items-center">
          <UIButton to="/" variant="outline" size="icon" class="mr-4 h-8 w-8">
            <Icon name="ph:arrow-left" class="h-4 w-4" />
          </UIButton>
          <h1 class="text-lg font-semibold">{{ template?.name }}</h1>
        </div>

        <div class="flex items-center gap-2">
          <UIDropdownMenu>
            <UIDropdownMenuTrigger asChild>
              <UIButton variant="outline"
                >Actions <Icon name="solar:alt-arrow-down-line-duotone"
              /></UIButton>
            </UIDropdownMenuTrigger>
            <UIDropdownMenuContent class="w-[200px]" align="end" :sideOffset="10">
              <UIDropdownMenuGroup class="space-y-1">
                <UIDropdownMenuItem
                  @click="saveDesign"
                  title="Save design"
                  icon="solar:diskette-line-duotone"
                />
                <UIDropdownMenuItem
                  @click="exportHtml"
                  title="Export HTML"
                  icon="solar:cloud-download-line-duotone"
                />
                <UIDropdownMenuItem
                  @click="preview"
                  title="Preview design"
                  icon="solar:telescope-line-duotone"
                />
                <UIDropdownMenuItem
                  @click="open()"
                  title="Import design"
                  icon="solar:upload-minimalistic-bold-duotone"
                />
                <UIDropdownMenuItem
                  @click="downloadDesign()"
                  title="Download design"
                  icon="solar:download-minimalistic-bold-duotone"
                />
              </UIDropdownMenuGroup>
            </UIDropdownMenuContent>
          </UIDropdownMenu>
        </div>
      </div>

      <div class="h-[calc(100dvh-65px)]">
        <EmailEditor
          :editorId="template?._id || '1'"
          :options="{
            fonts: {
              showDefaultFonts: false,
            },
          }"
          :appearance="{
            theme: mode,
          }"
          style="height: 100%"
          ref="emailEditor"
          @load="editorLoaded"
        />
      </div>
    </header>
  </div>
</template>

<script lang="ts" setup>
  // @ts-ignore
  import { EmailEditor } from "vue-email-editor";
  import sample from "@/sample.json";

  const route = useRoute();
  const router = useRouter();
  const emailEditor = shallowRef<EmailEditor>();

  const { mode } = useTheme();

  const template = ref<Template | null>();

  if (route.query.id) {
    const { data } = await useFetch<Template | null>(`/api/templates/${route.query.id}`);
    template.value = data.value;
  }

  async function createNewTemplate() {
    emailEditor?.value.editor.exportHtml(async (data: any) => {
      const res = await useToast.promise(useCreateTemplate(data), {
        error: "Failed to create template",
        success: {
          closeButton: true,
          closeOnClick: true,
          render: () => "Template created successfully",
        },
        pending: "Creating template...",
      });

      router.push({
        path: "/editor",
        query: {
          id: res._id,
        },
      });

      template.value = res;
    });
  }

  async function updateTemplate() {
    emailEditor?.value.editor.exportHtml(async (data: any) => {
      const res = await useToast.promise(useUpdateTemplate(route.query.id as string, data), {
        error: "Failed to update template",
        success: {
          closeButton: true,
          closeOnClick: true,
          render: () => "Template updated successfully",
        },
        pending: "Updating template...",
      });
      template.value = res;
    });
  }
  async function editorLoaded() {
    if (!template.value) return;
    emailEditor?.value.editor.loadDesign(JSON.parse(JSON.stringify(template?.value?.design)));
  }
  function saveDesign() {
    if (!route.query.id) {
      createNewTemplate();
    } else {
      updateTemplate();
    }
  }

  function exportHtml() {
    emailEditor?.value.editor.exportHtml(async (data: any) => {
      useExportTemplate(template.value?.name + ".html", data.html);
    });
  }

  function downloadDesign() {
    emailEditor?.value.editor.exportHtml(async (data: any) => {
      useExportTemplate(template.value?.name + ".json", JSON.stringify(data.design));
    });
  }

  function preview() {
    emailEditor?.value.editor.exportHtml(async (data: any) => {
      usePreviewTemplate(data.html);
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
    const reader = new FileReader();
    reader.onload = (e) => {
      const design = JSON.parse(e.target?.result as string);
      emailEditor?.value.editor.loadDesign(design);
    };
    reader.readAsText(file);
  });
</script>
