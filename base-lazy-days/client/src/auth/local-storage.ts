const USER_LOCALSTORAGE_KEY = "lazyday_user";
import { LoginData } from "./types";

// helper to get user from localstorage
export const getStoredLoginData = (): LoginData | null => {
  const storedLoginData = localStorage.getItem(USER_LOCALSTORAGE_KEY);
  try {
    return JSON.parse(storedLoginData);
  } catch {
    return null;
  }
};

export const setStoredLoginData = (loginData: LoginData): void => {
  localStorage.setItem(USER_LOCALSTORAGE_KEY, JSON.stringify(loginData));
};

export const clearStoredLoginData = (): void => {
  localStorage.removeItem(USER_LOCALSTORAGE_KEY);
};
