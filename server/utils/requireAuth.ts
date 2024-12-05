import type { EventHandler, H3Event } from "h3";

/**
 * Middleware used to require authentication for a route.
 *
 * @param event - The H3 event containing the request and context information.
 * @throws Will throw an error if the user is not authenticated.
 *
 * Note: The current session is attached to `event.context.auth`.
 */
export const requireAuth: EventHandler = async (event: H3Event) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  });
  if (!session)
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "You must be logged in to access this resource.",
    });
  // Attach the session to the event
  event.context.auth = session;
};
