import { UserRole } from "./User";

export interface AuthState {
  token: string | null;
  login: string | null;
  role: UserRole | null;
}
