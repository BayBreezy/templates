export default defineEventHandler({
  handler: async (event) => {
    try {
      // Perform a simple query to check if Prisma is working
      await prisma.$queryRaw`SELECT 1`;
      setResponseStatus(event, 200);
      // Return a success message if the query succeeds
      return "API is healthy";
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Return an error message if the query fails
      setResponseStatus(event, 503);
      return "API is unhealthy";
    }
  },
});
