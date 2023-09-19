<template>
  <div id="app">
    <header class="sticky top-0 z-50 border-b bg-background">
      <div id="bar" class="flex h-16 items-center justify-between px-5 lg:px-10">
        <div class="flex items-center">
          <UIButton to="/" variant="outline" size="icon" class="mr-4 h-8 w-8">
            <Icon name="ph:arrow-left" class="h-4 w-4" />
          </UIButton>
          <h1>{{ template?.name }}</h1>
        </div>

        <div class="flex items-center gap-2">
          <UIButton variant="outline" @click="saveDesign">Save Design</UIButton>
          <UIButton variant="outline" @click="exportHtml">Export HTML</UIButton>
          <UIButton variant="outline" @click="preview">Preview</UIButton>
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

  const template = ref<Template | null>();

  if (route.query.id) {
    const { data } = await useFetch<Template | null>(`/api/templates/${route.query.id}`);
    template.value = data.value;
  }

  async function createNewTemplate() {
    try {
      emailEditor?.value.editor.exportHtml(async (data: any) => {
        const res = await $fetch<Template>("/api/templates", {
          method: "POST",
          body: {
            name: "New Template",
            html: data.html,
            design: data.design,
          },
        });

        router.push({
          path: "/editor",
          query: {
            id: res._id,
          },
        });

        template.value = res;
        alert("Template created successfully");
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function updateTemplate() {
    emailEditor?.value.editor.exportHtml(async (data: any) => {
      try {
        const res = await $fetch<Template>(`/api/templates/${route.query.id}`, {
          method: "PUT",
          body: {
            html: data.html,
            design: data.design,
          },
        });
        template.value = res;
        alert("Template updated successfully");
      } catch (error) {
        console.log(error);
      }
    });
  }
  async function editorLoaded() {
    if (!template.value) return;
    emailEditor?.value.editor.loadDesign(JSON.parse(JSON.stringify(template?.value?.design)));
  }
  function saveDesign() {
    if (!route.query.id) {
      return createNewTemplate();
    } else {
      updateTemplate();
    }
  }

  function exportHtml() {
    emailEditor?.value.editor.exportHtml(async (data: any) => {
      // download the html as index.html or the template.name if template is not null
      const fileName = template.value?.name || "index";
      const blob = new Blob([data.html], { type: "text/html" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `${fileName}.html`;
      link.click();
      window.URL.revokeObjectURL(link.href);
    });
  }

  function preview() {
    emailEditor?.value.editor.exportHtml(async (data: any) => {
      const win = window.open("", template.value?.name || "Preview");
      win?.document.write(data.html);
      win?.document.close();
    });
  }
</script>
