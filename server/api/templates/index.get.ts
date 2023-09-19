export default defineEventHandler(async (event) => {
  return await Template.find();
});
