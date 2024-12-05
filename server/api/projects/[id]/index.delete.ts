export default defineEventHandler({
  onRequest: [requireAuth, validateIdParam],
  handler: async (event) => {
    const id = getIdParam(event);
    const user = getUserFromCtx(event);
    const project = await prisma.project.findUnique({
      where: { id, userId: user.id },
    });
    if (!project) {
      throw createError({
        statusCode: 404,
        statusMessage: "Project not found",
      });
    }
    await prisma.project.delete({ where: { id } });
    return { data: { message: "Project deleted" } };
  },
});
