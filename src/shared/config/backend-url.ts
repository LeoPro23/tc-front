const configuredBackendUrl = process.env.NEXT_PUBLIC_URL_BACKEND;

export const URL_BACKEND =
  configuredBackendUrl && configuredBackendUrl.trim().length > 0
    ? configuredBackendUrl
    : "http://localhost:8000";
