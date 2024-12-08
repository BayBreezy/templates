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
    // create a new copy of the template
    const newTemplate = await prisma.template.create({
      data: {
        design: template.design as any,
        html: template.html,
        projectId: template.projectId,
        name: `${template.name} (Copy)`,
      },
      include: { project: true },
    });
    return { data: newTemplate };
  },
});
