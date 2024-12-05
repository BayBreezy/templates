import destr from "destr";
import { isArray, isObject, isString } from "lodash-es";
import type { H3Event } from "h3";

/**
 * Parses the sort values from the input.
 *
 * @param sortValues - The sort values to parse, which can be a string, array, or object.
 * @returns An array of parsed sort values.
 */
export const parseSortValues = (sortValues?: any): any => {
  if (!sortValues) return [];
  if (isString(sortValues)) return destr(sortValues);
  if (isArray(sortValues)) {
    return sortValues.map((item) => (isString(item) ? destr(item) : item));
  } else if (isObject(sortValues)) {
    return [sortValues];
  }
  return [];
};

/**
 * Gets the logged in user from the event context.
 *
 * @param event - The H3 event containing the context with the user information.
 * @returns The user object if available, otherwise null.
 */
export const getUserFromCtx = (event: H3Event) => {
  const user = event.context?.auth?.user as (typeof auth.$Infer.Session)["user"];
  return user || null;
};

/**
 * Retrieves the 'idParam' from the event context.
 *
 * @param event - The H3 event containing the context with the id parameter.
 * @returns The id parameter from the event context.
 */
export const getIdParam = (event: H3Event) => {
  return event.context.idParam;
};
