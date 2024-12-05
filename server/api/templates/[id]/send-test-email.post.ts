import { SendTestEmailSchema } from "~/utils/validations";
import mustache from "mustache";

export default defineEventHandler({
  onRequest: [requireAuth, validateIdParam],
  handler: async (event) => {
    const {
      email,
      subject,
      data = {},
    } = await readValidatedBody(event, (d) => SendTestEmailSchema.validate(d));

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
    // render with mustache
    const html = mustache.render(template.html || "", data);
    // send email
    await sendEmail({ to: email, subject, html });
    return { data: { message: "Email sent" } };
  },
});
