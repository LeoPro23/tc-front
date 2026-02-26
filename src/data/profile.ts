const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3100';

import { getToken } from '@/lib/auth-helpers';

export async function getProfile() {
    const token = getToken();
    const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Error al obtener perfil');
    return res.json();
}

export async function updateProfile(data: { name?: string; email?: string; farmName?: string }) {
    const token = getToken();
    const res = await fetch(`${API_URL}/auth/profile`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al actualizar el perfil');
    return res.json();
}

export async function changePassword(currentPassword: string, newPassword: string) {
    const token = getToken();
    const res = await fetch(`${API_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Error al cambiar la contraseña');
    }
    return true;
}

export async function toggle2Fa(isEnabled: boolean) {
    const token = getToken();
    const res = await fetch(`${API_URL}/auth/2fa/toggle`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isEnabled }),
    });
    if (!res.ok) throw new Error('Error al actualizar 2FA');
    return true;
}

export async function getConnectedDevices() {
    const token = getToken();
    const res = await fetch(`${API_URL}/auth/devices`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Error al obtener dispositivos');
    return res.json();
}
