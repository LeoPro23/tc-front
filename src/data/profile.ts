import { URL_BACKEND } from '@/shared/config/backend-url';

import { getToken } from '@/lib/auth-helpers';

export async function getProfile() {
    const token = getToken();
    const res = await fetch(`${URL_BACKEND}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Error al obtener perfil');
    return res.json();
}

export async function updateProfile(data: { name?: string; email?: string; farmName?: string; phoneCountry?: string; phoneNumber?: string }) {
    const token = getToken();
    const res = await fetch(`${URL_BACKEND}/auth/profile`, {
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
    const res = await fetch(`${URL_BACKEND}/auth/change-password`, {
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
    const res = await fetch(`${URL_BACKEND}/auth/2fa/toggle`, {
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

export async function generate2FaSecret() {
    const token = getToken();
    const res = await fetch(`${URL_BACKEND}/auth/2fa/generate`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Error al generar secreto 2FA');
    return res.json();
}

export async function revokeDevice(sessionId: string) {
    const token = getToken();
    const res = await fetch(`${URL_BACKEND}/auth/devices/${sessionId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Error al eliminar sesión');
    return res.json();
}

export async function verify2Fa(otpCode: string) {
    const token = getToken();
    const res = await fetch(`${URL_BACKEND}/auth/2fa/verify`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ otpCode })
    });

    if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(body.message ?? 'Código incorrecto o ha expirado');
    }
    return true;
}

export async function getConnectedDevices() {
    const token = getToken();
    const res = await fetch(`${URL_BACKEND}/auth/devices`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Error al obtener dispositivos');
    return res.json();
}
