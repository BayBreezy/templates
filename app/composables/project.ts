/**
 * Composable for managing projects.
 *
 * Provides methods to perform CRUD operations on projects.
 */
export const useProject = () => {
  const projects = ref<Project[]>([]);

  /**
   * Fetches a list of projects with optional filters.
   *
   * @param filters - Optional pagination and filter parameters.
   * @returns A promise that resolves to a list of projects.
   */
  const get = async (filters?: PaginateParams) => {
    const res = await $fetch<FindMany<Project>>("/api/projects", { query: filters });
    projects.value = res.data;
    return res;
  };

  /**
   * Fetches a project by its ID.
   *
   * @param id - The ID of the project to fetch.
   * @returns A promise that resolves to the project.
   */
  const getById = async (id: string) => {
    return await $fetch<FindOne<Project>>(`/api/projects/${id}`);
  };

  /**
   * Creates a new project.
   *
   * @param data - The data for the new project.
   * @returns A promise that resolves to the created project.
   */
  const create = async (data: Project) => {
    return await $fetch<FindOne<Project>>("/api/projects", { method: "POST", body: data });
  };

  /**
   * Updates an existing project by its ID.
   *
   * @param id - The ID of the project to update.
   * @param data - The updated data for the project.
   * @returns A promise that resolves to the updated project.
   */
  const update = async (id: string, data: Project) => {
    return await $fetch<FindOne<Project>>(`/api/projects/${id}`, { method: "PUT", body: data });
  };

  /**
   * Deletes a project by its ID.
   *
   * @param id - The ID of the project to delete.
   * @returns A promise that resolves when the project is deleted.
   */
  const remove = async (id: string) => {
    return await $fetch<FindOne<Project>>(`/api/projects/${id}`, { method: "DELETE" });
  };

  return { get, create, getById, update, remove, projects };
};
