export const AUTH_USER_KEY = "eicUser";

export interface User {
  email: string;
  firstName: string;
  lastName: string;
  studentId: string;
  _id?: string;
}

export const isEmailAllowed = (email: string) =>
  /^[A-Za-z0-9._%+-]+@students\.bowiestate\.edu$/.test(email);

export const loginUser = (user: User) => {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
};

export const logoutUser = () => {
  localStorage.removeItem(AUTH_USER_KEY);
};

export const getUser = (): User | null => {
  const userData = localStorage.getItem(AUTH_USER_KEY);
  return userData ? JSON.parse(userData) : null;
};

export const getUserEmail = (): string | null => {
  const user = getUser();
  return user?.email || null;
};

export const getUserFirstName = (): string | null => {
  const user = getUser();
  return user?.firstName || null;
};
