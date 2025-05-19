import Cookies from "js-cookie";

export function clearUserSession() {
  Cookies.remove("analogueshifts");
  window.location.href = "https://auth.analogueshifts.app?app=learn";
}
