export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    return await Template.findByIdAndDelete(id);
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message,
    });
  }
});
