/**
 * Middleware to protect admin routes by checking if the user is authenticated.
 *
 * This middleware checks if the user is trying to access a route that starts with /admin.
 * If the user is not authenticated, they are redirected to the login page.
 *
 * @param to - The target route object.
 * @returns A navigation guard that either allows access or redirects to the login page.
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const { isAuth } = useAuth();
  // Check if the user is trying to access a route that starts with /admin
  const route = /^\/admin/.test(to.path);

  // If the route is an admin route and the user is not authenticated, redirect to login
  if (route && !isAuth.value) {
    return await navigateTo("/auth/login");
  }
});
