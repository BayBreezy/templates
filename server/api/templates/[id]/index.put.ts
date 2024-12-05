import { CreateTemplateSchema } from "~/utils/validations";

export default defineEventHandler({
  onRequest: [requireAuth, validateIdParam],
  handler: async (event) => {
    const id = getIdParam(event);
    const { name, design, html } = await readValidatedBody(event, (d) =>
      CreateTemplateSchema.validate(d)
    );
    const user = getUserFromCtx(event);
    const template = await prisma.template.findUnique({
      where: { id, project: { userId: user.id } },
    });
    if (!template) {
      throw createError({ statusCode: 404, statusMessage: "Template not found" });
    }
    const updatedTemplate = await prisma.template.update({
      where: { id },
      data: { name, design, html },
    });
    return { data: updatedTemplate };
  },
});
