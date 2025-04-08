import { redirect } from "next/navigation";
import { nanoid } from "nanoid";
/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
  type: "error" | "success",
  path: string,
  message: string,
) {
  return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

export function generateAlias(): string {
  const alias = nanoid().substring(0, 20);

  return alias;
}

export function removeCamelCaseAndUnderscore(text: string): string {
  const regex = /(?<=[a-z])(?=[A-Z])|-/g;
  const words = text.split(regex);
  return words
    .map(word =>
      word ? word[0].toUpperCase() + word.substring(1).toLowerCase() : ''
    )
    .join(' ');
}