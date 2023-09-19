export default defineEventHandler(async (event) => {
  try {
    const { name, html, design } = await readBody(event);
    if (!design) {
      throw createError({
        statusCode: 400,
        message: "Design is required",
      });
    }
    const template = await Template.create({ name, html, design });
    return template;
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message,
    });
  }
});
