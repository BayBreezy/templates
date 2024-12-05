import type { PaginateParams } from "~/utils/types";

export default defineEventHandler({
  onRequest: [requireAuth],
  handler: async (event) => {
    const {
      limit = 20,
      page = 1,
      search = "",
      sort = { createdAt: "desc" },
      projectId,
    } = getQuery<PaginateParams>(event);

    const user = getUserFromCtx(event);
    const [templates, meta] = await prisma.template
      .paginate({
        where: {
          name: { contains: search },
          project: { id: projectId, userId: user.id },
        },
        orderBy: parseSortValues(sort),
      })
      .withPages({ limit: Number(limit), page: Number(page) });

    return { data: templates, meta };
  },
});
