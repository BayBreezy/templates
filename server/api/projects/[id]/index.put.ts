import { CreateProjectSchema } from "~/utils/validations";

export default defineEventHandler({
  onRequest: [requireAuth, validateIdParam],
  handler: async (event) => {
    const id = getIdParam(event);
    const { name, description } = await readValidatedBody(event, (d) =>
      CreateProjectSchema.validate(d)
    );
    const user = getUserFromCtx(event);
    const project = await prisma.project.findUnique({
      where: { id, userId: user.id },
    });
    if (!project) {
      throw createError({ statusCode: 404, statusMessage: "Project not found" });
    }
    const updatedProject = await prisma.project.update({
      where: { id },
      data: { name, description },
    });
    return { data: updatedProject };
  },
});
