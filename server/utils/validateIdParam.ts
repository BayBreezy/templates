import { IdParamSchema } from "~/utils/validations";
import type { EventHandler, H3Event } from "h3";

/**
 * Middleware used to validate the id parameter of a route.
 *
 * @param event - The H3 event containing the request and context information.
 * @throws Will throw an error if the id parameter is invalid.
 *
 * Note: The validated id parameter is attached to `event.context.idParam`.
 */
export const validateIdParam: EventHandler = async (event: H3Event) => {
  const { id } = await getValidatedRouterParams(event, (v) =>
    IdParamSchema.validate(v, { disableStackTrace: true, stripUnknown: true })
  );
  event.context.idParam = id;
};
