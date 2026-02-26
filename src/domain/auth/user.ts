export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface LoginDto {
  email: string;
  password: string;
  otpCode?: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}
