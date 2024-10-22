import { getUser, removeItem } from "./storage";

export function isTokenExpired(token: string): boolean {
  if (!token) return true;
  
  const decodedToken = JSON.parse(atob(token.split('.')[1]));
  const currentTime = Date.now() / 1000;
  
  return decodedToken.exp < currentTime;
}

export function logout(): void {
  removeItem('user'); 
  console.log("User logged out, redirecting to login page");
  window.location.href = '/'; 
}

export const isAuthenticated = (): boolean => {
  const user = getUser();
  return !!user;
}