export default defineEventHandler({
  onRequest: [requireAuth, validateIdParam],
  handler: async (event) => {
    const id = getIdParam(event);
    const user = getUserFromCtx(event);
    const template = await prisma.template.findUnique({
      where: { id, project: { userId: user.id } },
    });
    if (!template) {
      throw createError({
        statusCode: 404,
        statusMessage: "Template not found",
      });
    }
    await prisma.template.delete({ where: { id } });
    return { data: { message: "Template deleted" } };
  },
});
