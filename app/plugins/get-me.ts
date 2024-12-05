/**
 * Nuxt plugin to fetch the current authenticated user on app initialization.
 *
 * This plugin checks if the user is already fetched. If not, it fetches the user data.
 */
export default defineNuxtPlugin(async () => {
  const { user, getUser } = useAuth();

  // If the user is not already fetched, fetch the user data
  if (!user.value) {
    await getUser();
  }
});
