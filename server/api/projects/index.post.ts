import { CreateProjectSchema } from "~/utils/validations";

export default defineEventHandler({
  onRequest: [requireAuth],
  handler: async (event) => {
    const { name, description } = await readValidatedBody(event, (d) =>
      CreateProjectSchema.validate(d)
    );
    const user = getUserFromCtx(event);

    const project = await prisma.project.create({
      data: {
        name,
        description,
        userId: user.id,
      },
    });
    return { data: project };
  },
});
