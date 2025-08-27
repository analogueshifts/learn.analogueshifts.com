import Cookies from "js-cookie";

export function clearUserSession() {
  const authLink = process.env.NEXT_PUBLIC_AUTH_URL;
  const app = process.env.NEXT_PUBLIC_SITE_BUILD_UUID;

  Cookies.remove("analogueshifts");
  window.location.href = `${authLink}?app=${app}`;
}
