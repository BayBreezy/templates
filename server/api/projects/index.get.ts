import type { PaginateParams } from "~/utils/types";

export default defineEventHandler({
  onRequest: [requireAuth],
  handler: async (event) => {
    const {
      limit = 20,
      page = 1,
      search = "",
      sort = { createdAt: "desc" },
    } = getQuery<PaginateParams>(event);

    const user = getUserFromCtx(event);
    const [projects, meta] = await prisma.project
      .paginate({
        where: {
          name: { contains: search },
          userId: user.id,
        },
        orderBy: parseSortValues(sort),
        include: { _count: { select: { templates: true } } },
      })
      .withPages({ limit: Number(limit), page: Number(page) });

    return { data: projects, meta };
  },
});
