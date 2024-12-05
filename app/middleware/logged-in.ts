/**
 * Middleware to redirect authenticated users away from certain routes.
 *
 * This middleware checks if the user is authenticated. If they are, it redirects them to the /admin/projects page.
 *
 * @returns A navigation guard that either allows access or redirects to the /admin/projects page.
 */
export default defineNuxtRouteMiddleware(async () => {
  const { isAuth } = useAuth();

  // If the user is authenticated, redirect to the /admin/projects page
  if (isAuth.value) {
    return await navigateTo("/admin/projects");
  }
});
