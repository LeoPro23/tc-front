import { AuthResponse, LoginDto, RegisterDto } from "@/domain/auth/user";

const BASE_URL = process.env.NEXT_PUBLIC_URL_BACKEND ?? "http://localhost:8000";

export async function loginUser(dto: LoginDto): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message ?? "Error al iniciar sesión");
  }

  return res.json() as Promise<AuthResponse>;
}

export async function registerUser(dto: RegisterDto): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message ?? "Error al registrarse");
  }

  return res.json() as Promise<AuthResponse>;
}

export async function getMe(token: string): Promise<AuthResponse["user"]> {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Sesión expirada");

  return res.json() as Promise<AuthResponse["user"]>;
}
