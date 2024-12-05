import { CreateTemplateSchema } from "~/utils/validations";

export default defineEventHandler({
  onRequest: [requireAuth],
  handler: async (event) => {
    const { name, projectId } = await readValidatedBody(event, (d) =>
      CreateTemplateSchema.validate(d)
    );

    const template = await prisma.template.create({
      data: {
        name,
        projectId,
      },
    });
    return { data: template };
  },
});
