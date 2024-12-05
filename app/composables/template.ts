/**
 * Composable for managing templates.
 *
 * Provides methods to perform CRUD operations on templates, preview templates, export templates, and send test emails.
 */
export const useTemplate = () => {
  /**
   * Fetches a list of templates with optional filters.
   *
   * @param filters - Optional pagination and filter parameters.
   * @returns A promise that resolves to a list of templates.
   */
  const get = async (projectId: string, filters?: PaginateParams) => {
    return await $fetch<FindMany<Template>>("/api/templates", { query: { projectId, ...filters } });
  };

  /**
   * Fetches a template by its ID.
   *
   * @param id - The ID of the template to fetch.
   * @returns A promise that resolves to the template.
   */
  const getById = async (id: string, projectId: string) => {
    return await $fetch<FindOne<Template>>(`/api/templates/${id}`, {
      query: { projectId },
    });
  };

  /**
   * Creates a new template.
   *
   * @param data - The data for the new template.
   * @returns A promise that resolves to the created template.
   */
  const create = async (data: Partial<Template>) => {
    return await $fetch<FindOne<Template>>("/api/templates", { method: "POST", body: data });
  };

  /**
   * Updates an existing template by its ID.
   *
   * @param id - The ID of the template to update.
   * @param data - The updated data for the template.
   * @returns A promise that resolves to the updated template.
   */
  const update = async (id: string, data: Partial<Template>) => {
    return await $fetch<FindOne<Template>>(`/api/templates/${id}`, { method: "PUT", body: data });
  };

  /**
   * Deletes a template by its ID.
   *
   * @param id - The ID of the template to delete.
   * @returns A promise that resolves when the template is deleted.
   */
  const remove = async (id: string) => {
    return await $fetch(`/api/templates/${id}`, { method: "DELETE" });
  };

  /**
   * Previews a template by opening it in a new browser tab.
   *
   * @param html - The HTML content of the template to preview.
   */
  const previewTemplate = async (html: string) => {
    const tab = window.open();
    tab?.document.write(html);
    tab?.document.close();
  };

  /**
   * Exports a template as an HTML file.
   *
   * @param fileName - The name of the exported file (default is "index.html").
   * @param html - The HTML content of the template to export.
   */
  const exportTemplate = async (fileName: string = "index.html", html: string) => {
    const blob = new Blob([html], { type: "text/html" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(link.href);
  };

  /**
   * Sends a test email using a template.
   *
   * @param id - The ID of the template to use for the test email.
   * @param data - The data for the test email.
   * @returns A promise that resolves when the test email is sent.
   */
  const sendTestTemplate = async (id: string, data: any) => {
    return await $fetch(`/api/templates/${id}/send-test-email`, { method: "POST", body: data });
  };

  return {
    get,
    create,
    getById,
    update,
    remove,
    previewTemplate,
    exportTemplate,
    sendTestTemplate,
  };
};
