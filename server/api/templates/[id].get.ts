export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  return await Template.findById(id);
});
