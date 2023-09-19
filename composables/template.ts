export const useUpdateTemplate = async (id: string, values: Partial<Template>) => {
  return await $fetch<Template>(`/api/templates/${id}`, {
    method: "PUT",
    body: values,
  });
};

export const useDeleteTemplate = async (id: string) => {
  return await $fetch(`/api/templates/${id}`, {
    method: "DELETE",
  });
};

export const useCreateTemplate = async (values: Partial<Template>) => {
  return await $fetch<Template>(`/api/templates`, {
    method: "POST",
    body: { name: values.name || "New Template", ...values },
  });
};

export const useExportTemplate = async (fileName: string = "index.html", html: string) => {
  const blob = new Blob([html], { type: "text/html" });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
  window.URL.revokeObjectURL(link.href);
};

export const usePreviewTemplate = async (html: string) => {
  const tab = window.open();
  tab?.document.write(html);
  tab?.document.close();
};
