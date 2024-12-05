import dayjs from "dayjs";

export const formatDateTimeForInput = (date: Date | string) => {
  return dayjs(date).format("YYYY-MM-DDTHH:mm");
};

export const displayFormErrors = async (errors: any) => {
  const errs = Object.values(errors).flat();
  for (let i = 0; i < errs.length; i++) {
    const err = errs[i];
    await new Promise((resolve) => setTimeout(resolve, 100));
    if (err) useSonner.warning(err, { duration: 10000 });
  }
};

/**
 * Accepts an error and returns the error message
 */
export const formatErrorMessage = (error: any) => {
  if (error.data) {
    if (error.data.message) {
      // check if error.data.message is an array or string
      if (Array.isArray(error.data.message)) {
        return error.data.message[0];
      }
      return error.data.message;
    }
    return error.data;
  }
  if (error.error) {
    if (error.error.message) {
      // check if error.data.message is an array or string
      if (Array.isArray(error.error.message)) {
        return error.error.message[0];
      }
      return error.error.message;
    }
    return error.error;
  }
};

/**
 *  Accepts a number and returns the formatted currency
 * @param amount - The amount to be formatted
 * @returns  The formatted currency
 */
export const formatCurrency = (amount?: number | null) => {
  return Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount || 0);
};

/**
 * Generates a random password based on the length provided
 */
export const generatePassword = (length: number = 12) => {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789)@#&$";
  let retVal = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
};

/**
 * Returns the message to be displayed when the table is empty
 */
export const getEmptyTableMessage = (
  title: string = "No records found",
  message: string = "Click button above to add a new record"
) => {
  const data = `
  <div class="flex py-5 items-center flex-col gap-1">
    <p class="font-bold">${title}</p>
    <p class="text-muted-foreground">${message}</p>  
  </div>
  `;
  return data;
};
