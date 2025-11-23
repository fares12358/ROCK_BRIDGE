// lib/api_helpers.js
export function setAuthToken(token) {
    if (token) {
      // this helper will be replaced by setAuthTokenLocal in lib/api.js via import
      // But keep file so existing imports don't break
      if (typeof window !== "undefined") {
        // no-op fallback; prefer using setAuthTokenLocal from lib/api.js
        localStorage.setItem("token", token);
      }
    } else {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
    }
  }
  